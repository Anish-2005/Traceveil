import sys
import os
import numpy as np

# Add project root to path
sys.path.append(os.getcwd())

from app.models.graph_model import train_default_graph_model

def verify_graph_model():
    print("="*50)
    print("VERIFYING GRAPH MODEL")
    print("="*50)
    
    try:
        classifier, scaler = train_default_graph_model()
        print("\nGraph Model trained successfully.")
        
        # Test inference with dummy features
        test_feat = np.array([[0.5, 0.1, 0.4, 5, 5, 10, 1]]) # Suspicious-like
        scaled = scaler.transform(test_feat)
        prob = classifier.predict_proba(scaled)[0][1]
        print(f"Test Inference (Suspicious inputs): Risk Score = {prob:.4f}")
        
    except Exception as e:
        print(f"FAILED Graph Model verification: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    verify_graph_model()
