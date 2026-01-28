from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import joblib
import os
from typing import Dict, Any

MODEL_DIR = "app/models"
ANOMALY_MODEL_PATH = os.path.join(MODEL_DIR, "anomaly_model.pkl")
AUTOENCODER_MODEL_PATH = os.path.join(MODEL_DIR, "autoencoder_model.pth")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

class Autoencoder(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int = 64):
        super(Autoencoder, self).__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, hidden_dim // 4)
        )
        self.decoder = nn.Sequential(
            nn.Linear(hidden_dim // 4, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

    def get_reconstruction_error(self, x):
        with torch.no_grad():
            reconstructed = self(x)
            loss = nn.MSELoss(reduction='none')(reconstructed, x)
            return loss.mean(dim=1).numpy()

def train_autoencoder(X: np.ndarray, epochs: int = 100, batch_size: int = 32):
    """Train autoencoder for anomaly detection"""
    input_dim = X.shape[1]
    model = Autoencoder(input_dim)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    # Convert to tensor
    X_tensor = torch.FloatTensor(X)

    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        for i in range(0, len(X), batch_size):
            batch = X_tensor[i:i+batch_size]
            optimizer.zero_grad()
            output = model(batch)
            loss = criterion(output, batch)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        if (epoch + 1) % 20 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Loss: {epoch_loss/len(X):.4f}")

    return model

def load_models():
    """Load trained models or create defaults"""
    scaler = StandardScaler()

    # Try to load existing models
    if os.path.exists(AUTOENCODER_MODEL_PATH) and os.path.exists(SCALER_PATH):
        try:
            # Load autoencoder
            checkpoint = torch.load(AUTOENCODER_MODEL_PATH)
            input_dim = checkpoint['input_dim']
            autoencoder = Autoencoder(input_dim)
            autoencoder.load_state_dict(checkpoint['model_state_dict'])
            autoencoder.eval()

            # Load scaler
            scaler = joblib.load(SCALER_PATH)

            return autoencoder, scaler
        except Exception as e:
            print(f"Error loading models: {e}")

    # Fallback: create and train default models
    print("Training default anomaly detection models...")
    autoencoder, scaler = train_default_models()
    return autoencoder, scaler

def train_default_models():
    """Train models on synthetic normal data"""
    # Generate synthetic normal behavior data
    np.random.seed(42)
    n_samples = 1000
    n_features = 11  # Based on our feature set

    # Normal behavior patterns
    X_normal = np.random.normal(0, 1, (n_samples, n_features))

    # Add some realistic patterns
    X_normal[:, 0] = np.random.uniform(0, 20, n_samples)  # action_frequency
    X_normal[:, 1] = np.random.uniform(0, 2, n_samples)   # burstiness_score
    X_normal[:, 4] = np.random.uniform(300, 1500, n_samples)  # mouse_speed
    X_normal[:, 5] = np.random.uniform(0.3, 0.8, n_samples)   # working_hours

    # Scale the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_normal)

    # Train autoencoder
    autoencoder = train_autoencoder(X_scaled, epochs=50)

    # Save models
    torch.save({
        'input_dim': n_features,
        'model_state_dict': autoencoder.state_dict()
    }, AUTOENCODER_MODEL_PATH)

    joblib.dump(scaler, SCALER_PATH)

    return autoencoder, scaler

def detect_anomaly(features: Dict[str, Any]) -> float:
    """
    Detect anomalies using both Isolation Forest and Autoencoder
    Returns risk score between 0 and 1
    """
    # Convert features dict to array
    feature_values = np.array([list(features.values())])

    autoencoder, scaler = load_models()

    # Scale features
    try:
        feature_scaled = scaler.transform(feature_values)
    except:
        # If scaler not fitted, use raw features
        feature_scaled = feature_values

    # Autoencoder reconstruction error
    feature_tensor = torch.FloatTensor(feature_scaled)
    reconstruction_errors = autoencoder.get_reconstruction_error(feature_tensor)
    ae_score = min(1.0, reconstruction_errors[0] / 0.5)  # Normalize

    # Isolation Forest (fallback/simple method)
    if os.path.exists(ANOMALY_MODEL_PATH):
        iso_forest = joblib.load(ANOMALY_MODEL_PATH)
        iso_pred = iso_forest.predict(feature_scaled)
        iso_score = 1.0 if iso_pred[0] == -1 else 0.0
    else:
        # Simple rule-based anomaly detection
        iso_score = 0.0
        if features.get('action_frequency', 0) > 50:  # Very high activity
            iso_score = 0.8
        elif features.get('device_stability', 0) < 0.1:  # Many device changes
            iso_score = 0.6

    # Combine scores
    final_score = 0.7 * ae_score + 0.3 * iso_score

    return min(1.0, max(0.0, final_score))