#!/usr/bin/env python3
"""
Train Traceveil Models Part by Part on Real Data
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
import torch
import torch.nn as nn
import warnings
warnings.filterwarnings('ignore')

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.dataset_loader import dataset_loader
from app.models.anomaly_detector import train_autoencoder
from app.models.sequence_model import train_default_sequence_model
from app.models.graph_model import train_default_graph_model
from app.models.model_manager import model_manager

def train_autoencoder_on_real_data():
    """Train autoencoder on IEEE-CIS real data"""
    print("🔥 TRAINING AUTOENCODER ON IEEE-CIS REAL DATA")
    print("=" * 50)

    # Load IEEE-CIS dataset
    datasets = dataset_loader.load_all_datasets()
    if 'ieee_cis' not in datasets:
        print("❌ IEEE-CIS dataset not found")
        return

    df = datasets['ieee_cis']
    print(f"Loaded {len(df)} transactions")

    # Prepare data (same as train_industry_datasets.py)
    categorical_cols = ['ProductCD', 'card4', 'card6', 'P_emaildomain', 'R_emaildomain', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'DeviceType', 'DeviceInfo']
    for col in categorical_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).fillna('unknown')
            from sklearn.preprocessing import LabelEncoder
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])

    exclude_cols = ['isFraud', 'TransactionID', 'TransactionDT', 'TransactionAmt']
    feature_cols = [col for col in df.columns if col not in exclude_cols]

    df[feature_cols] = df[feature_cols].fillna(-999)
    X = df[feature_cols].values.astype(np.float32)
    y = df['isFraud'].values.astype(np.int64)

    # Use smaller subset for faster training
    if len(df) > 10000:
        print("Using subset of 10,000 samples for faster training")
        fraud_df = df[df['isFraud'] == 1]
        normal_df = df[df['isFraud'] == 0]

        n_fraud = min(len(fraud_df), 1000)
        n_normal = 9000

        fraud_sample = fraud_df.sample(n=n_fraud, random_state=42)
        normal_sample = normal_df.sample(n=min(n_normal, len(normal_df)), random_state=42)

        df = pd.concat([fraud_sample, normal_sample]).reset_index(drop=True)
        X = df[feature_cols].values.astype(np.float32)
        y = df['isFraud'].values.astype(np.int64)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Training set: {len(X_train)} samples ({np.sum(y_train)} fraud)")
    print(f"Test set: {len(X_test)} samples ({np.sum(y_test)} fraud)")
    print(f"Feature dimensions: {X.shape[1]}")

    # Train autoencoder
    print("Training autoencoder...")
    autoencoder = train_autoencoder(X_train, epochs=10)

    # Evaluate
    autoencoder.eval()
    with torch.no_grad():
        test_tensor = torch.FloatTensor(X_test)
        reconstructed = autoencoder(test_tensor)
        mse = nn.MSELoss(reduction='none')(reconstructed, test_tensor).mean(dim=1)
        auc = roc_auc_score(y_test, mse.numpy())

    print(f"✅ Autoencoder trained with AUC: {auc:.4f}")
    print("Saving autoencoder model...")

    # Save with model manager
    model_manager.save_model('autoencoder', autoencoder, {
        'training_date': pd.Timestamp.now(),
        'dataset': 'IEEE-CIS',
        'dataset_size': len(df),
        'auc_score': auc,
        'training_type': 'real_data'
    })

    print("✅ Autoencoder training completed!")

def train_lstm_on_real_data():
    """Train LSTM on exam behavior data (realistic patterns)"""
    print("🧠 TRAINING LSTM SEQUENCE MODEL")
    print("=" * 50)

    # For now, use the default training which creates realistic exam behavior data
    # In production, this would use real user event sequences
    print("Training LSTM on synthetic but realistic exam behavior sequences...")
    lstm_model = train_default_sequence_model()

    model_manager.save_model('lstm', lstm_model, {
        'training_date': pd.Timestamp.now(),
        'dataset': 'realistic_exam_behavior',
        'training_type': 'realistic_synthetic'
    })

    print("✅ LSTM training completed!")

def train_graph_model_on_real_data():
    """Train graph model on fraud network patterns"""
    print("🕸️ TRAINING GRAPH CLASSIFICATION MODEL")
    print("=" * 50)

    # Use default training which creates realistic fraud network patterns
    print("Training graph model on realistic fraud network patterns...")
    classifier, scaler = train_default_graph_model()

    # Save both classifier and scaler
    model_manager.save_model('graph', classifier, {
        'training_date': pd.Timestamp.now(),
        'dataset': 'realistic_fraud_network',
        'training_type': 'realistic_synthetic'
    })

    print("✅ Graph model training completed!")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Train Traceveil models part by part")
    parser.add_argument("--model", choices=['autoencoder', 'lstm', 'graph', 'all'],
                       default='all', help="Which model to train")

    args = parser.parse_args()

    if args.model in ['autoencoder', 'all']:
        train_autoencoder_on_real_data()

    if args.model in ['lstm', 'all']:
        train_lstm_on_real_data()

    if args.model in ['graph', 'all']:
        train_graph_model_on_real_data()

    print("\n🎉 PART-BY-PART TRAINING COMPLETED!")
    print("Models trained on real IEEE-CIS data and realistic synthetic patterns.")