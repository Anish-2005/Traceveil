import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from app.models.anomaly_detector import train_default_models, load_models
from app.models.sequence_model import train_default_sequence_model, load_sequence_model
import torch
import numpy as np

def verify_models():
    print("=== Verifying Anomaly Detector (Deep Autoencoder) ===")
    try:
        # Trigger training
        autoencoder, scaler = train_default_models()
        print("Anomaly Detector training completed successfully.")
        
        # Test inference
        print("Testing inference...")
        normal_data = np.random.normal(0, 1, (1, 11))
        # Scale
        scaled = scaler.transform(normal_data)
        # Predict
        loss = autoencoder.get_reconstruction_error(torch.FloatTensor(scaled))
        print(f"Normal sample reconstruction error: {loss[0]:.4f}")
        
    except Exception as e:
        print(f"FAILED Anomaly Detector verification: {e}")
        import traceback
        traceback.print_exc()

    print("\n=== Verifying Sequence Model (BiLSTM) ===")
    try:
        # Trigger training
        seq_model = train_default_sequence_model()
        if seq_model:
            print("Sequence Model training completed successfully.")
            
            # Test inference
            print("Testing inference...")
            seq_data = torch.randn(1, 10, 11) # Batch=1, Seq=10, Feat=11
            output = seq_model(seq_data)
            print(f"Random sequence risk score: {output.item():.4f}")
        else:
            print("Sequence Model training returned None (likely insufficient data).")
            
    except Exception as e:
        print(f"FAILED Sequence Model verification: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    verify_models()
