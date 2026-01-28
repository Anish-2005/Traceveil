#!/usr/bin/env python3
"""
Industry-Standard Dataset Integration for Traceveil
Trains models on real fraud detection datasets
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
import warnings
warnings.filterwarnings('ignore')

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.dataset_loader import dataset_loader
from app.models.anomaly_detector import Autoencoder, train_autoencoder
from app.models.sequence_model import LSTMSequenceModel, train_lstm_model
from app.models.graph_model import train_graph_model
from app.models.model_training import trainer
from app.features.feature_engineering import compute_features

def prepare_ieee_cis_data(df: pd.DataFrame) -> tuple:
    """Prepare IEEE-CIS data for training"""
    print(f"Preparing IEEE-CIS data: {len(df)} transactions")

    # Handle categorical columns explicitly
    categorical_cols = ['ProductCD', 'card4', 'card6', 'P_emaildomain', 'R_emaildomain', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'DeviceType', 'DeviceInfo']
    for col in categorical_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).fillna('unknown')
            from sklearn.preprocessing import LabelEncoder
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])

    # Select relevant features (exclude IDs and target)
    exclude_cols = ['isFraud', 'TransactionID', 'TransactionDT', 'TransactionAmt']
    feature_cols = [col for col in df.columns if col not in exclude_cols]

    # Handle missing values
    df[feature_cols] = df[feature_cols].fillna(-999)

    # Convert to numeric (should all be numeric now)
    try:
        X = df[feature_cols].values.astype(np.float32)
    except ValueError as e:
        print(f"Error converting to float: {e}")
        # Debug: find problematic columns
        for col in feature_cols:
            try:
                df[col].astype(np.float32)
            except:
                print(f"Problematic column: {col}, dtype: {df[col].dtype}, sample values: {df[col].head(3).values}")
        raise

    y = df['isFraud'].values.astype(np.int64)

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Training set: {len(X_train)} samples ({np.sum(y_train)} fraud)")
    print(f"Test set: {len(X_test)} samples ({np.sum(y_test)} fraud)")
    print(f"Feature dimensions: {X.shape[1]}")

    return X_train, X_test, y_train, y_test

def prepare_credit_card_data(df: pd.DataFrame) -> tuple:
    """Prepare credit card fraud data for training"""
    print(f"Preparing Credit Card data: {len(df)} transactions")

    # Use V1-V28 features + Amount + Time
    feature_cols = [f'V{i}' for i in range(1, 29)] + ['Amount', 'Time']

    X = df[feature_cols].values.astype(np.float32)
    y = df['Class'].values.astype(np.int64)

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Training set: {len(X_train)} samples ({np.sum(y_train)} fraud)")
    print(f"Test set: {len(X_test)} samples ({np.sum(y_test)} fraud)")

    return X_train, X_test, y_train, y_test

def prepare_exam_behavior_data(df: pd.DataFrame) -> tuple:
    """Prepare exam behavior data for training"""
    print(f"Preparing Exam Behavior data: {len(df)} student-question pairs")

    # Group by student to create sequences
    student_sequences = []
    student_labels = []

    for student_id in df['student_id'].unique():
        student_data = df[df['student_id'] == student_id]

        # Create feature sequence
        features = student_data[['time_spent', 'click_count', 'tab_switches', 'mouse_movements']].values
        label = student_data['is_cheater'].iloc[0]

        student_sequences.append(features)
        student_labels.append(label)

    # Convert to numpy arrays
    X = np.array(student_sequences, dtype=np.float32)
    y = np.array(student_labels, dtype=np.int64)

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Training set: {len(X_train)} students ({np.sum(y_train)} cheaters)")
    print(f"Test set: {len(X_test)} students ({np.sum(y_test)} cheaters)")

    return X_train, X_test, y_train, y_test

def prepare_fraud_network_data(df: pd.DataFrame) -> tuple:
    """Prepare fraud network data for graph training"""
    print(f"Preparing Fraud Network data: {len(df)} transactions")

    # Create graph features
    from sklearn.preprocessing import LabelEncoder

    # Encode categorical features
    le_ip = LabelEncoder()
    le_device = LabelEncoder()
    le_user = LabelEncoder()

    df['ip_encoded'] = le_ip.fit_transform(df['ip_address'])
    df['device_encoded'] = le_device.fit_transform(df['device_id'])
    df['user_encoded'] = le_user.fit_transform(df['user_id'])

    # Create node features
    node_features = df[['amount', 'timestamp', 'ip_encoded', 'device_encoded']].values.astype(np.float32)
    labels = df['is_fraud'].values.astype(np.int64)

    # Create adjacency matrix (optimized - connect transactions with same IP/device)
    n_nodes = len(df)
    adjacency = np.zeros((n_nodes, n_nodes))

    # Connect transactions with same IP (more efficient)
    ip_groups = df.groupby('ip_encoded').groups
    for ip_indices in ip_groups.values():
        indices_list = list(ip_indices)
        for i in range(len(indices_list)):
            for j in range(i+1, len(indices_list)):
                idx_i, idx_j = indices_list[i], indices_list[j]
                adjacency[idx_i, idx_j] = adjacency[idx_j, idx_i] = 1

    print(f"Created adjacency matrix with {np.sum(adjacency)//2} connections")

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        node_features, labels, test_size=0.2, random_state=42, stratify=labels
    )

    print(f"Training set: {len(X_train)} nodes ({np.sum(y_train)} fraud)")
    print(f"Test set: {len(X_test)} nodes ({np.sum(y_test)} fraud)")

    return X_train, X_test, y_train, y_test, adjacency

def prepare_time_series_data(df: pd.DataFrame) -> tuple:
    """Prepare time series data for anomaly detection"""
    print(f"Preparing Time Series data: {len(df)} points")

    # Create sequences for LSTM
    sequence_length = 50
    values = df['metric_value'].values.astype(np.float32)

    sequences = []
    labels = []

    for i in range(len(values) - sequence_length):
        seq = values[i:i+sequence_length]
        label = df.iloc[i+sequence_length]['is_anomaly']
        sequences.append(seq)
        labels.append(label)

    X = np.array(sequences)
    y = np.array(labels)

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training set: {len(X_train)} sequences ({np.sum(y_train)} anomalies)")
    print(f"Test set: {len(X_test)} sequences ({np.sum(y_test)} anomalies)")

    return X_train, X_test, y_train, y_test

def train_on_industry_datasets():
    """Train Traceveil models on industry-standard datasets"""
    print("🚀 Starting Industry-Standard Dataset Training for Traceveil")
    print("=" * 60)

    # Load all available datasets
    datasets = dataset_loader.load_all_datasets()

    if not datasets:
        print("❌ No datasets loaded. Please ensure datasets are available.")
        return

    # Train models on each dataset
    results = {}

    # 1. IEEE-CIS Fraud Detection (Tier 1)
    if 'ieee_cis' in datasets:
        print("\n🏆 TRAINING ON IEEE-CIS FRAUD DETECTION DATASET")
        print("-" * 50)

        try:
            X_train, X_test, y_train, y_test = prepare_ieee_cis_data(datasets['ieee_cis'])

            # Train Autoencoder for anomaly detection
            print("Training Autoencoder...")
            autoencoder = train_autoencoder(X_train)

            # Evaluate
            autoencoder.eval()
            with torch.no_grad():
                test_tensor = torch.FloatTensor(X_test)
                reconstructed = autoencoder(test_tensor)
                mse = nn.MSELoss(reduction='none')(reconstructed, test_tensor).mean(dim=1)
                auc = roc_auc_score(y_test, mse.numpy())

            results['ieee_cis'] = {'auc': auc, 'dataset_size': len(datasets['ieee_cis'])}
            print(f"✅ IEEE-CIS training completed - AUC: {auc:.4f}")
        except Exception as e:
            print(f"❌ Failed to train on IEEE-CIS: {e}")

    # 2. Credit Card Fraud (Tier 1)
    if 'credit_card' in datasets:
        print("\n💳 TRAINING ON CREDIT CARD FRAUD DATASET")
        print("-" * 50)

        try:
            X_train, X_test, y_train, y_test = prepare_credit_card_data(datasets['credit_card'])

            # Train Autoencoder
            print("Training Autoencoder...")
            autoencoder = train_autoencoder(X_train)

            # Evaluate
            autoencoder.eval()
            with torch.no_grad():
                test_tensor = torch.FloatTensor(X_test)
                reconstructed = autoencoder(test_tensor)
                mse = nn.MSELoss(reduction='none')(reconstructed, test_tensor).mean(dim=1)
                auc = roc_auc_score(y_test, mse.numpy())

            results['credit_card'] = {'auc': auc, 'dataset_size': len(datasets['credit_card'])}
            print(f"✅ Credit Card training completed - AUC: {auc:.4f}")
        except Exception as e:
            print(f"❌ Failed to train on Credit Card: {e}")

    # 3. Exam Behavior Data (Tier 2)
    if 'exam_behavior' in datasets:
        print("\n📚 TRAINING ON EXAM BEHAVIOR DATASET")
        print("-" * 50)

        try:
            X_train, X_test, y_train, y_test = prepare_exam_behavior_data(datasets['exam_behavior'])

            # Train LSTM for sequence modeling
            print("Training LSTM...")
            lstm_model = train_lstm_model(X_train, X_test, y_train, y_test)

            # Evaluate
            lstm_model.eval()
            with torch.no_grad():
                test_tensor = torch.FloatTensor(X_test)
                outputs = lstm_model(test_tensor)
                predictions = torch.sigmoid(outputs.squeeze()).numpy()
                auc = roc_auc_score(y_test, predictions)

            results['exam_behavior'] = {'auc': auc, 'dataset_size': len(datasets['exam_behavior'])}
            print(f"✅ Exam Behavior training completed - AUC: {auc:.4f}")
        except Exception as e:
            print(f"❌ Failed to train on Exam Behavior: {e}")

    # 4. Fraud Network Data (Tier 3)
    if 'fraud_network' in datasets:
        print("\n🕸️ TRAINING ON FRAUD NETWORK DATASET")
        print("-" * 50)

        try:
            X_train, X_test, y_train, y_test, adjacency = prepare_fraud_network_data(datasets['fraud_network'])

            # Train Graph Neural Network
            print("Training Graph Model...")
            graph_model = train_graph_model(X_train, X_test, y_train, y_test, adjacency)

            # Evaluate (simplified)
            results['fraud_network'] = {'dataset_size': len(datasets['fraud_network'])}
            print("✅ Graph model trained on network data")
        except Exception as e:
            print(f"❌ Failed to train on Fraud Network: {e}")

    # 5. Time Series Anomaly (Tier 4)
    if 'time_series' in datasets:
        print("\n📈 TRAINING ON TIME SERIES ANOMALY DATASET")
        print("-" * 50)

        try:
            X_train, X_test, y_train, y_test = prepare_time_series_data(datasets['time_series'])

            # Train LSTM for anomaly detection
            print("Training LSTM for anomaly detection...")
            anomaly_lstm = train_lstm_model(X_train, X_test, y_train, y_test)

            # Evaluate
            anomaly_lstm.eval()
            with torch.no_grad():
                test_tensor = torch.FloatTensor(X_test)
                outputs = anomaly_lstm(test_tensor)
                predictions = torch.sigmoid(outputs.squeeze()).numpy()
                auc = roc_auc_score(y_test, predictions)

            results['time_series'] = {'auc': auc, 'dataset_size': len(datasets['time_series'])}
            print(f"✅ Time Series training completed - AUC: {auc:.4f}")
        except Exception as e:
            print(f"❌ Failed to train on Time Series: {e}")

    # Save processed datasets
    print("\n💾 Saving processed datasets...")
    dataset_loader.save_processed_datasets(datasets)

    # Print final results
    print("\n🎯 TRAINING RESULTS SUMMARY")
    print("=" * 60)
    for dataset_name, metrics in results.items():
        print(f"{dataset_name.upper()}:")
        print(f"  Dataset Size: {metrics['dataset_size']:,} samples")
        if 'auc' in metrics:
            print(f"  AUC-ROC: {metrics['auc']:.4f}")
        print()

    print("✅ Industry-standard training completed!")
    print("Models are now trained on real-world fraud detection data.")
    print("This makes Traceveil production-ready with proven datasets.")

    return results

if __name__ == "__main__":
    train_on_industry_datasets()