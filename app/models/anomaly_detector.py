from sklearn.ensemble import IsolationForest
import joblib
import os

MODEL_PATH = "app/models/isolation_forest.pkl"

def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    else:
        # Train on dummy data if no model exists
        return train_initial_model()

def train_initial_model():
    # Dummy training data - in real scenario, use historical normal data
    import numpy as np
    X = np.random.normal(0, 1, (1000, 10))  # 10 features
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(X)
    joblib.dump(model, MODEL_PATH)
    return model

def detect_anomaly(features: dict) -> float:
    model = load_model()
    # Convert features dict to array
    feature_values = list(features.values())
    # Reshape for single prediction
    prediction = model.predict([feature_values])
    # Convert to risk score (0-1, higher = more anomalous)
    # IsolationForest returns -1 for outliers, 1 for inliers
    risk_score = 1 if prediction[0] == -1 else 0
    return risk_score