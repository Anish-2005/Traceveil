import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import kaggle
import requests
import zipfile
import tarfile
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

DATA_DIR = "data"
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

class DatasetLoader:
    """Load and preprocess industry-standard fraud detection datasets"""

    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}

    def download_kaggle_dataset(self, dataset_name: str, output_path: str):
        """Download dataset from Kaggle"""
        try:
            kaggle.api.competition_download_files(dataset_name, path=output_path, quiet=False)
            print(f"Downloaded {dataset_name} from Kaggle")
        except Exception as e:
            print(f"Failed to download {dataset_name}: {e}")
            print("Please download manually from Kaggle and place in data/raw/")

    def load_ieee_cis_fraud(self) -> pd.DataFrame:
        """Load IEEE-CIS Fraud Detection dataset"""
        dataset_path = os.path.join(RAW_DIR, "ieee-cis-fraud-detection")

        if not os.path.exists(dataset_path):
            print("IEEE-CIS dataset not found. Downloading...")
            self.download_kaggle_dataset("ieee-fraud-detection", dataset_path)

        # Load transaction data
        train_transaction = pd.read_csv(os.path.join(dataset_path, "train_transaction.csv"))
        train_identity = pd.read_csv(os.path.join(dataset_path, "train_identity.csv"))

        # Merge datasets
        df = train_transaction.merge(train_identity, on='TransactionID', how='left')

        # Basic preprocessing
        df = self._preprocess_transaction_data(df)

        return df

    def load_credit_card_fraud(self) -> pd.DataFrame:
        """Load European Credit Card Fraud dataset"""
        dataset_path = os.path.join(RAW_DIR, "creditcardfraud")

        if not os.path.exists(dataset_path):
            print("Credit card fraud dataset not found.")
            print("Please download from: https://www.kaggle.com/mlg-ulb/creditcardfraud")
            return pd.DataFrame()

        df = pd.read_csv(os.path.join(dataset_path, "creditcard.csv"))

        # Add synthetic user and session features for Traceveil compatibility
        df = self._enhance_credit_card_data(df)

        return df

    def load_exam_behavior_data(self) -> pd.DataFrame:
        """Load or generate exam cheating behavior data"""
        # Since real exam datasets are hard to find, we'll generate synthetic
        # but realistic exam behavior data
        print("Generating synthetic exam behavior data...")
        return self._generate_exam_behavior_data()

    def load_synthetic_fraud_network(self) -> pd.DataFrame:
        """Generate synthetic fraud network data for graph modeling"""
        print("Generating synthetic fraud network data...")
        return self._generate_fraud_network_data()

    def load_time_series_anomaly(self) -> pd.DataFrame:
        """Load Yahoo/NAB time series anomaly data"""
        dataset_path = os.path.join(RAW_DIR, "NAB")

        if not os.path.exists(dataset_path):
            print("NAB dataset not found.")
            print("Please download from: https://github.com/numenta/NAB")
            return pd.DataFrame()

        # Load a sample time series for anomaly detection training
        return self._load_nab_data(dataset_path)

    def _preprocess_transaction_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess transaction data for fraud detection"""
        # Handle missing values
        df = df.fillna(-999)

        # Convert categorical features
        cat_features = [col for col in df.columns if col.startswith('card') or col.startswith('M') or col.startswith('id_')]
        for col in cat_features:
            if col in df.columns:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le

        # Scale numerical features
        num_features = [col for col in df.columns if df[col].dtype in ['int64', 'float64'] and col not in ['isFraud', 'TransactionID']]
        df[num_features] = self.scaler.fit_transform(df[num_features])

        # Add time-based features
        if 'TransactionDT' in df.columns:
            df['hour'] = df['TransactionDT'] % (24 * 3600) // 3600
            df['day'] = df['TransactionDT'] // (24 * 3600)

        return df

    def _enhance_credit_card_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add features to make credit card data compatible with Traceveil"""
        np.random.seed(42)

        # Add synthetic user IDs
        df['user_id'] = np.random.randint(1000, 9999, len(df))

        # Add session information
        df['session_id'] = df.groupby('user_id').cumcount() // np.random.randint(5, 20)

        # Add timing features
        df['time_since_last_transaction'] = df.groupby('user_id')['Time'].diff().fillna(0)

        # Add device/browser fingerprints (synthetic)
        df['device_fingerprint'] = np.random.randint(10000, 99999, len(df))
        df['browser_fingerprint'] = np.random.randint(10000, 99999, len(df))

        # Add IP information
        df['ip_address'] = [f"192.168.{i%255}.{j%255}" for i,j in zip(np.random.randint(0,255,len(df)), np.random.randint(0,255,len(df)))]

        # Add behavioral features
        df['transaction_velocity'] = df.groupby('user_id')['Time'].diff().fillna(0)
        df['amount_to_balance_ratio'] = df['Amount'] / (df.groupby('user_id')['Amount'].cumsum() + 1)

        return df

    def _generate_exam_behavior_data(self) -> pd.DataFrame:
        """Generate realistic exam cheating behavior data"""
        np.random.seed(42)
        n_students = 1000
        n_questions = 50

        data = []

        for student_id in range(n_students):
            # Normal student behavior
            is_cheater = np.random.random() < 0.1  # 10% cheaters

            for question_id in range(n_questions):
                base_time = np.random.normal(120, 30)  # 2 minutes average

                if is_cheater:
                    # Cheaters show suspicious patterns
                    if np.random.random() < 0.3:  # 30% of answers are suspiciously fast
                        time_spent = np.random.uniform(5, 15)  # Too fast
                    else:
                        time_spent = base_time * np.random.uniform(0.8, 1.2)
                else:
                    time_spent = base_time * np.random.uniform(0.5, 1.5)

                # Add behavioral features
                data.append({
                    'student_id': student_id,
                    'question_id': question_id,
                    'time_spent': max(1, time_spent),  # Minimum 1 second
                    'is_correct': np.random.random() > 0.3,  # 70% correct rate
                    'is_cheater': is_cheater,
                    'click_count': np.random.poisson(5 if is_cheater else 3),
                    'tab_switches': np.random.poisson(2 if is_cheater else 0.5),
                    'mouse_movements': np.random.poisson(100 if is_cheater else 50),
                    'session_start_time': np.random.uniform(0, 86400),  # Random time of day
                    'device_type': np.random.choice(['desktop', 'mobile', 'tablet'], p=[0.7, 0.2, 0.1])
                })

        return pd.DataFrame(data)

    def _generate_fraud_network_data(self) -> pd.DataFrame:
        """Generate synthetic fraud network data"""
        np.random.seed(42)
        n_transactions = 5000

        # Create fraud rings
        n_fraud_rings = 10
        ring_sizes = np.random.randint(3, 8, n_fraud_rings)

        data = []
        transaction_id = 0

        for ring_id, ring_size in enumerate(ring_sizes):
            # Create fraudulent users in this ring
            ring_users = [f"fraud_user_{ring_id}_{i}" for i in range(ring_size)]

            for user in ring_users:
                # Each user makes several transactions
                n_user_transactions = np.random.randint(5, 15)

                for _ in range(n_user_transactions):
                    # Coordinated timing within fraud rings
                    base_time = np.random.uniform(0, 86400)
                    time_offset = np.random.normal(0, 3600)  # Within 1 hour window
                    transaction_time = base_time + time_offset

                    data.append({
                        'transaction_id': transaction_id,
                        'user_id': user,
                        'amount': np.random.lognormal(3, 1),  # Skewed amount distribution
                        'timestamp': transaction_time,
                        'ip_address': f"10.{ring_id%255}.{np.random.randint(0,255)}.{np.random.randint(0,255)}",
                        'device_id': f"device_{ring_id}_{np.random.randint(0,10)}",
                        'merchant_category': np.random.choice(['online', 'retail', 'service'], p=[0.5, 0.3, 0.2]),
                        'is_fraud': 1,  # All in fraud rings are fraudulent
                        'fraud_ring_id': ring_id,
                        'coordinated_timing': abs(time_offset) < 1800  # Within 30 minutes
                    })
                    transaction_id += 1

        # Add legitimate transactions
        for _ in range(n_transactions - transaction_id):
            data.append({
                'transaction_id': transaction_id,
                'user_id': f"legit_user_{np.random.randint(1000, 9999)}",
                'amount': np.random.lognormal(2, 0.8),
                'timestamp': np.random.uniform(0, 86400),
                'ip_address': f"192.168.{np.random.randint(0,255)}.{np.random.randint(0,255)}",
                'device_id': f"device_legit_{np.random.randint(0,1000)}",
                'merchant_category': np.random.choice(['online', 'retail', 'service'], p=[0.4, 0.4, 0.2]),
                'is_fraud': 0,
                'fraud_ring_id': -1,
                'coordinated_timing': False
            })
            transaction_id += 1

        return pd.DataFrame(data)

    def _load_nab_data(self, dataset_path: str) -> pd.DataFrame:
        """Load NAB time series anomaly data"""
        # Load a sample file for anomaly detection training
        sample_file = os.path.join(dataset_path, "data", "realKnownCause", "nyc_taxi.csv")

        if os.path.exists(sample_file):
            df = pd.read_csv(sample_file)
            # Convert to format suitable for Traceveil
            df = df.rename(columns={'timestamp': 'time', 'value': 'metric_value'})
            df['is_anomaly'] = 0  # Would be labeled in real NAB data
            return df
        else:
            # Generate synthetic time series data
            print("NAB sample not found, generating synthetic time series...")
            return self._generate_synthetic_time_series()

    def _generate_synthetic_time_series(self) -> pd.DataFrame:
        """Generate synthetic time series data for anomaly detection"""
        np.random.seed(42)
        n_points = 10000

        # Generate normal behavior
        time = np.arange(n_points)
        base_pattern = 100 + 20 * np.sin(2 * np.pi * time / 1440)  # Daily pattern
        noise = np.random.normal(0, 5, n_points)
        values = base_pattern + noise

        # Add anomalies
        anomaly_indices = np.random.choice(n_points, size=int(0.05 * n_points), replace=False)
        values[anomaly_indices] += np.random.normal(0, 30, len(anomaly_indices))

        # Add drift
        drift_start = n_points // 2
        values[drift_start:] += np.linspace(0, 20, n_points - drift_start)

        return pd.DataFrame({
            'time': time,
            'metric_value': values,
            'is_anomaly': [1 if i in anomaly_indices else 0 for i in range(n_points)],
            'data_type': 'synthetic_time_series'
        })

    def load_all_datasets(self) -> dict:
        """Load all available datasets"""
        datasets = {}

        try:
            print("Loading IEEE-CIS Fraud Detection dataset...")
            datasets['ieee_cis'] = self.load_ieee_cis_fraud()
        except Exception as e:
            print(f"Failed to load IEEE-CIS: {e}")

        try:
            print("Loading Credit Card Fraud dataset...")
            datasets['credit_card'] = self.load_credit_card_fraud()
        except Exception as e:
            print(f"Failed to load Credit Card: {e}")

        try:
            print("Loading Exam Behavior dataset...")
            datasets['exam_behavior'] = self.load_exam_behavior_data()
        except Exception as e:
            print(f"Failed to load Exam Behavior: {e}")

        try:
            print("Loading Fraud Network dataset...")
            datasets['fraud_network'] = self.load_synthetic_fraud_network()
        except Exception as e:
            print(f"Failed to load Fraud Network: {e}")

        try:
            print("Loading Time Series Anomaly dataset...")
            datasets['time_series'] = self.load_time_series_anomaly()
        except Exception as e:
            print(f"Failed to load Time Series: {e}")

        return datasets

    def save_processed_datasets(self, datasets: dict):
        """Save processed datasets for model training"""
        for name, df in datasets.items():
            output_path = os.path.join(PROCESSED_DIR, f"{name}_processed.csv")
            df.to_csv(output_path, index=False)
            print(f"Saved {name} dataset ({len(df)} rows) to {output_path}")

# Global instance
dataset_loader = DatasetLoader()