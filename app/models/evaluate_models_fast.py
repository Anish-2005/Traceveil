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

def evaluate_models_fast():
    print("STARTING FAST EVALUATION")
    generator = DataGenerator(seed=123)
    
    # --- ANOMALY DETECTOR ---
    print("\n[Anomaly Detector]")
    # Generate 20 samples total
    seq_normal, _, _ = generator.generate_dataset(n_normal=20, n_attack=0)
    seq_attack, _, _ = generator.generate_dataset(n_normal=0, n_attack=20)
    
    features_normal = np.array([generator.extract_features_from_sequence(s) for s in seq_normal])
    features_attack = np.array([generator.extract_features_from_sequence(s) for s in seq_attack])
    
    X_test = np.vstack([features_normal, features_attack])
    y_true = np.array([0]*20 + [1]*20)
    
    autoencoder, scaler = load_models()
    X_scaled = scaler.transform(X_test)
    recon_error = autoencoder.get_reconstruction_error(torch.FloatTensor(X_scaled))
    
    threshold = np.percentile(recon_error[:20], 95)
    y_pred = (recon_error > threshold).astype(int)
    
    print(f"Precision: {accuracy_score(y_true, y_pred):.2f}") # Approximation
    print(classification_report(y_true, y_pred, target_names=['Normal', 'Anomaly']))
    
    # --- SEQUENCE MODEL ---
    print("\n[Sequence Model]")
    # Generate raw sessions
    _, _, raw_normal = generator.generate_dataset(n_normal=20, n_attack=0)
    _, _, raw_attack = generator.generate_dataset(n_normal=0, n_attack=20)
    
    def process(sessions):
        processed = []
        for s in sessions:
            class MockEvent:
                def __init__(self, d):
                    self.timestamp = d['timestamp']
                    self.event_type = d['event_type']
                    self.event_metadata = d.get('metadata', {})
            events = [MockEvent(e) for e in s]
            seqs = create_sequences(events, 10)
            if seqs: processed.append(seqs[-1])
        return np.array(processed)

    X_norm = process(raw_normal)
    X_att = process(raw_attack)
    
    if len(X_norm) > 0 and len(X_att) > 0:
        X_test = np.vstack([X_norm, X_att])
        y_true = np.array([0]*len(X_norm) + [1]*len(X_att))
        
        model = load_sequence_model()
        with torch.no_grad():
            outputs = model(torch.FloatTensor(X_test))
            y_pred = (outputs.squeeze().numpy() > 0.5).astype(int)
            
        print(classification_report(y_true, y_pred, target_names=['Normal', 'Suspicious']))
    else:
        print("Not enough sequences generated.")

if __name__ == "__main__":
    evaluate_models_fast()
