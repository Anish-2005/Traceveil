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
        print(f"FAILED Graph Model training: {e}")
        import traceback
        traceback.print_exc()
        return

    print("\n[Integration Test]")
    from app.models.graph_model import compute_graph_risk
    # Needs database context, so we might need to mock get_user_events if not connected
    # But verify_graph is running in environment where imports work. 
    # Let's try calling it on a dummy user, assuming it handles empty gracefully or we check.
    
    # We can mock get_user_events in the graph_model module for this test
    import app.models.graph_model as gm
    
    # Mock
    original_get = gm.get_user_events
    gm.get_user_events = lambda uid, limit: [
        {'user_id': uid, 'event_type': 'login', 'metadata': {'device_id': 'd1', 'ip': 'i1'}},
        {'user_id': uid, 'event_type': 'login', 'metadata': {'device_id': 'd1', 'ip': 'i1'}}, # Duplicate normal
        {'user_id': uid, 'event_type': 'login', 'metadata': {'device_id': 'd1', 'ip': 'i1'}}
    ]
    
    try:
        risk, features = compute_graph_risk("test_user")
        print(f"compute_graph_risk returned: Score={risk}, Features={list(features.keys())}")
        if isinstance(risk, float) and isinstance(features, dict):
            print("SUCCESS: Return type signature is correct.")
        else:
            print("FAILURE: Invalid return types.")
    except Exception as e:
        print(f"FAILED compute_graph_risk: {e}")
        traceback.print_exc()
    finally:
        gm.get_user_events = original_get

if __name__ == "__main__":
    verify_graph_model()
