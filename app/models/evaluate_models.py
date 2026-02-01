import sys
import os
import numpy as np
import torch
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix, accuracy_score

# Add project root to path
sys.path.append(os.getcwd())

from app.models.data_generator import DataGenerator
from app.models.anomaly_detector import load_models
from app.models.sequence_model import load_sequence_model, create_sequences

def evaluate_anomaly_detector():
    print("\n" + "="*50)
    print("EVALUATING ANOMALY DETECTOR (AUTOENCODER)")
    print("="*50)
    
    # 1. Generate Test Data
    generator = DataGenerator(seed=999) # Different seed for testing
    print("Generating test data...")
    # Normal data for testing false positives
    seq_normal, _, _ = generator.generate_dataset(n_normal=50, n_attack=0)
    # Attack data for testing detection
    seq_attack, _, _ = generator.generate_dataset(n_normal=0, n_attack=50)
    
    # Extract features
    print("Extracting features...")
    features_normal = np.array([generator.extract_features_from_sequence(s) for s in seq_normal])
    features_attack = np.array([generator.extract_features_from_sequence(s) for s in seq_attack])
    
    X_test = np.vstack([features_normal, features_attack])
    y_true = np.array([0] * len(features_normal) + [1] * len(features_attack))
    
    # 2. Load Model
    autoencoder, scaler = load_models()
    
    # 3. Predict (Reconstruction Error)
    print("Running inference...")
    X_scaled = scaler.transform(X_test)
    X_tensor = torch.FloatTensor(X_scaled)
    
    reconstruction_errors = autoencoder.get_reconstruction_error(X_tensor)
    
    # Determine threshold (simple approach: mean + 2*std of normal part, or fixed)
    # Ideally should be tuned on validation set. Let's look at the distribution.
    error_normal = reconstruction_errors[:len(features_normal)]
    error_attack = reconstruction_errors[len(features_normal):]
    
    print(f"Avg Error (Normal): {np.mean(error_normal):.4f} +/- {np.std(error_normal):.4f}")
    print(f"Avg Error (Attack): {np.mean(error_attack):.4f} +/- {np.std(error_attack):.4f}")
    
    # Set threshold to 95th percentile of normal errors (allow 5% false alarms)
    threshold = np.percentile(error_normal, 95)
    print(f"Setting detection threshold: {threshold:.4f}")
    
    y_pred = (reconstruction_errors > threshold).astype(int)
    
    # 4. Metrics
    print("\n--- PERFORMANCE METRICS ---")
    print(classification_report(y_true, y_pred, target_names=['Normal', 'Anomaly']))
    print(f"AUC Score: {roc_auc_score(y_true, reconstruction_errors):.4f}")
    
    cm = confusion_matrix(y_true, y_pred)
    print(f"\nConfusion Matrix:\n{cm}")

def evaluate_sequence_model():
    print("\n" + "="*50)
    print("EVALUATING SEQUENCE MODEL (BiLSTM)")
    print("="*50)
    
    # 1. Generate Test Data
    generator = DataGenerator(seed=888)
    print("Generating test data...")
    # We need raw sessions to convert to sequences
    _, _, raw_normal = generator.generate_dataset(n_normal=50, n_attack=0)
    _, _, raw_attack = generator.generate_dataset(n_normal=0, n_attack=50)
    
    # Helper to process into model input format
    def process_test_sequences(sessions):
        processed_seqs = []
        valid_indices = [] # Track which sessions actually produced sequences
        
        for i, session in enumerate(sessions):
            if len(session) < 11: continue
            
            # Mock Event
            class MockEvent:
                def __init__(self, data):
                    self.timestamp = data['timestamp']
                    self.event_type = data['event_type']
                    self.event_metadata = data.get('metadata', {})
            
            events = [MockEvent(e) for e in session]
            # Just take the *last* sequence from the session as the classification target
            seqs = create_sequences(events, sequence_length=10)
            if seqs:
                processed_seqs.append(seqs[-1])
                valid_indices.append(i)
                
        return np.array(processed_seqs), len(processed_seqs)

    print("Processing sequences...")
    X_normal, n_norm = process_test_sequences(raw_normal)
    X_attack, n_att = process_test_sequences(raw_attack)
    
    if n_norm == 0 or n_att == 0:
        print("Not enough valid sequences generated for evaluation.")
        return

    X_test = np.vstack([X_normal, X_attack])
    y_true = np.array([0] * n_norm + [1] * n_att)
    
    # 2. Load Model
    model = load_sequence_model()
    
    # 3. Predict
    print("Running inference...")
    with torch.no_grad():
        X_tensor = torch.FloatTensor(X_test)
        outputs = model(X_tensor)
        y_scores = outputs.squeeze().numpy()
        
    y_pred = (y_scores > 0.5).astype(int)
    
    # 4. Metrics
    print("\n--- PERFORMANCE METRICS ---")
    print(classification_report(y_true, y_pred, target_names=['Normal', 'Suspicious']))
    print(f"AUC Score: {roc_auc_score(y_true, y_scores):.4f}")
    
    cm = confusion_matrix(y_true, y_pred)
    print(f"\nConfusion Matrix:\n{cm}")

if __name__ == "__main__":
    evaluate_anomaly_detector()
    evaluate_sequence_model()
