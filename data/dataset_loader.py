import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import requests
import zipfile
import tarfile
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# Kaggle will be imported only when needed
KAGGLE_AVAILABLE = False

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
        global KAGGLE_AVAILABLE
        
        if not KAGGLE_AVAILABLE:
            # Try to import kaggle
            try:
                import kaggle
                kaggle.api.authenticate()
                KAGGLE_AVAILABLE = True
                print("✅ Kaggle API authenticated successfully")
            except Exception as e:
                print(f"⚠️ Kaggle API not available: {e}")
                print("Please download manually from Kaggle and place in data/raw/")
                return False
        
        try:
            import kaggle
            kaggle.api.competition_download_files(dataset_name, path=output_path, quiet=False)
            print(f"Downloaded {dataset_name} from Kaggle")
            return True
        except Exception as e:
            print(f"Failed to download {dataset_name}: {e}")
            print("Please download manually from Kaggle and place in data/raw/")
            return False

    def load_ieee_cis_fraud(self) -> pd.DataFrame:
        """Load IEEE-CIS Fraud Detection dataset"""
        # Check if files exist directly in raw directory (manual download)
        train_transaction_path = os.path.join(RAW_DIR, "train_transaction.csv")
        train_identity_path = os.path.join(RAW_DIR, "train_identity.csv")
        
        if os.path.exists(train_transaction_path) and os.path.exists(train_identity_path):
            print("Found IEEE-CIS files in raw directory")
            try:
                # Load transaction data
                train_transaction = pd.read_csv(train_transaction_path)
                train_identity = pd.read_csv(train_identity_path)

                # Merge datasets
                df = train_transaction.merge(train_identity, on='TransactionID', how='left')

                # Basic preprocessing
                df = self._preprocess_transaction_data(df)

                return df
            except Exception as e:
                print(f"Failed to load IEEE-CIS dataset: {e}")
                print("Using synthetic IEEE-CIS data...")
                return self._generate_synthetic_ieee_cis()
        
        # Check for organized directory structure
        dataset_path = os.path.join(RAW_DIR, "ieee-cis-fraud-detection")

        if not os.path.exists(dataset_path):
            print("IEEE-CIS dataset not found. Downloading...")
            success = self.download_kaggle_dataset("ieee-fraud-detection", dataset_path)
            if not success:
                print("Using synthetic IEEE-CIS data...")
                return self._generate_synthetic_ieee_cis()

        try:
            # Load transaction data
            train_transaction = pd.read_csv(os.path.join(dataset_path, "train_transaction.csv"))
            train_identity = pd.read_csv(os.path.join(dataset_path, "train_identity.csv"))

            # Merge datasets
            df = train_transaction.merge(train_identity, on='TransactionID', how='left')

            # Basic preprocessing
            df = self._preprocess_transaction_data(df)

            return df
        except Exception as e:
            print(f"Failed to load IEEE-CIS dataset: {e}")
            print("Using synthetic IEEE-CIS data...")
            return self._generate_synthetic_ieee_cis()

    def load_credit_card_fraud(self) -> pd.DataFrame:
        """Load European Credit Card Fraud dataset"""
        dataset_path = os.path.join(RAW_DIR, "creditcardfraud")

        if not os.path.exists(dataset_path):
            print("Credit card fraud dataset not found. Using synthetic data...")
            return self._generate_synthetic_credit_card()

        try:
            df = pd.read_csv(os.path.join(dataset_path, "creditcard.csv"))
            # Add synthetic user and session features for Traceveil compatibility
            df = self._enhance_credit_card_data(df)
            return df
        except Exception as e:
            print(f"Failed to load credit card dataset: {e}")
            print("Using synthetic credit card data...")
            return self._generate_synthetic_credit_card()

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

    def _generate_synthetic_credit_card(self) -> pd.DataFrame:
        """Generate synthetic credit card fraud data similar to the European dataset"""
        np.random.seed(42)
        n_samples = 50000
        
        # Generate data similar to the real credit card dataset
        data = {
            'Time': np.sort(np.random.uniform(0, 172800, n_samples)),  # 48 hours in seconds
            'V1': np.random.normal(0, 1, n_samples),
            'V2': np.random.normal(0, 1, n_samples),
            'V3': np.random.normal(0, 1, n_samples),
            'V4': np.random.normal(0, 1, n_samples),
            'V5': np.random.normal(0, 1, n_samples),
            'V6': np.random.normal(0, 1, n_samples),
            'V7': np.random.normal(0, 1, n_samples),
            'V8': np.random.normal(0, 1, n_samples),
            'V9': np.random.normal(0, 1, n_samples),
            'V10': np.random.normal(0, 1, n_samples),
            'V11': np.random.normal(0, 1, n_samples),
            'V12': np.random.normal(0, 1, n_samples),
            'V13': np.random.normal(0, 1, n_samples),
            'V14': np.random.normal(0, 1, n_samples),
            'V15': np.random.normal(0, 1, n_samples),
            'V16': np.random.normal(0, 1, n_samples),
            'V17': np.random.normal(0, 1, n_samples),
            'V18': np.random.normal(0, 1, n_samples),
            'V19': np.random.normal(0, 1, n_samples),
            'V20': np.random.normal(0, 1, n_samples),
            'V21': np.random.normal(0, 1, n_samples),
            'V22': np.random.normal(0, 1, n_samples),
            'V23': np.random.normal(0, 1, n_samples),
            'V24': np.random.normal(0, 1, n_samples),
            'V25': np.random.normal(0, 1, n_samples),
            'V26': np.random.normal(0, 1, n_samples),
            'V27': np.random.normal(0, 1, n_samples),
            'V28': np.random.normal(0, 1, n_samples),
            'Amount': np.random.exponential(100, n_samples),
            'Class': np.random.choice([0, 1], n_samples, p=[0.9983, 0.0017])  # 0.17% fraud rate
        }
        
        df = pd.DataFrame(data)
        
        # Add fraud patterns to V features
        fraud_mask = df['Class'] == 1
        for i in range(1, 29):
            df.loc[fraud_mask, f'V{i}'] += np.random.normal(0, 2, fraud_mask.sum())
        
        df.loc[fraud_mask, 'Amount'] *= np.random.uniform(1.5, 5, fraud_mask.sum())
        
        return df

    def _generate_synthetic_ieee_cis(self) -> pd.DataFrame:
        """Generate synthetic IEEE-CIS fraud detection data"""
        np.random.seed(42)
        n_samples = 10000
        
        # Generate transaction data similar to IEEE-CIS
        data = {
            'TransactionID': range(1, n_samples + 1),
            'isFraud': np.random.choice([0, 1], n_samples, p=[0.985, 0.015]),  # 1.5% fraud rate
            'TransactionAmt': np.random.exponential(100, n_samples),
            'ProductCD': np.random.choice(['W', 'H', 'C', 'S', 'R'], n_samples),
            'card1': np.random.randint(1000, 20000, n_samples),
            'card2': np.random.randint(100, 600, n_samples),
            'card3': np.random.choice([150, 185, 150.0, 185.0], n_samples),
            'card4': np.random.choice(['visa', 'mastercard', 'american express', 'discover'], n_samples),
            'card5': np.random.randint(100, 300, n_samples),
            'card6': np.random.choice(['debit', 'credit'], n_samples),
            'addr1': np.random.randint(100, 500, n_samples),
            'addr2': np.random.randint(10, 100, n_samples),
            'dist1': np.random.exponential(50, n_samples),
            'dist2': np.random.exponential(50, n_samples),
            'P_emaildomain': np.random.choice(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'], n_samples),
            'R_emaildomain': np.random.choice(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'], n_samples),
        }
        
        # Add some engineered features
        for i in range(1, 10):
            data[f'C{i}'] = np.random.randint(0, 1000, n_samples)
            data[f'D{i}'] = np.random.exponential(10, n_samples)
            data[f'M{i}'] = np.random.choice(['T', 'F'], n_samples)
            data[f'V{i}'] = np.random.randint(0, 2, n_samples)
        
        df = pd.DataFrame(data)
        
        # Add fraud patterns
        fraud_mask = df['isFraud'] == 1
        df.loc[fraud_mask, 'TransactionAmt'] *= np.random.uniform(2, 10, fraud_mask.sum())
        df.loc[fraud_mask, 'dist1'] = np.random.exponential(200, fraud_mask.sum())  # Fraud from far away
        
        return df

# Global instance
dataset_loader = DatasetLoader()