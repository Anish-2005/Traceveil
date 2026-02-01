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
        # Deep Autoencoder with BatchNorm and Dropout
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.2),
            
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.BatchNorm1d(hidden_dim // 2),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.1),
            
            nn.Linear(hidden_dim // 2, hidden_dim // 4)  # Latent space
        )
        self.decoder = nn.Sequential(
            nn.Linear(hidden_dim // 4, hidden_dim // 2),
            nn.BatchNorm1d(hidden_dim // 2),
            nn.LeakyReLU(0.2),
            
            nn.Linear(hidden_dim // 2, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.LeakyReLU(0.2),
            
            nn.Linear(hidden_dim, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

    def get_reconstruction_error(self, x):
        with torch.no_grad():
            self.eval()
            reconstructed = self(x)
            loss = nn.MSELoss(reduction='none')(reconstructed, x)
            return loss.mean(dim=1).numpy()

def train_autoencoder(X: np.ndarray, epochs: int = 100, batch_size: int = 32, validation_split: float = 0.2):
    """Train autoencoder with validation and early stopping"""
    input_dim = X.shape[1]
    model = Autoencoder(input_dim)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5, verbose=True)

    # Split data
    split_idx = int(len(X) * (1 - validation_split))
    X_train = torch.FloatTensor(X[:split_idx])
    X_val = torch.FloatTensor(X[split_idx:])

    best_val_loss = float('inf')
    patience = 10
    patience_counter = 0
    best_model_state = None

    print(f"Training Autoencoder: {len(X_train)} train samples, {len(X_val)} val samples")

    for epoch in range(epochs):
        model.train()
        train_loss = 0
        
        # Mini-batch training
        permutation = torch.randperm(X_train.size()[0])
        for i in range(0, X_train.size()[0], batch_size):
            indices = permutation[i:i+batch_size]
            batch = X_train[indices]
            
            optimizer.zero_grad()
            output = model(batch)
            loss = criterion(output, batch)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()

        # Validation
        model.eval()
        with torch.no_grad():
            val_output = model(X_val)
            val_loss = criterion(val_output, X_val).item()

        avg_train_loss = train_loss / (len(X_train) / batch_size)
        scheduler.step(val_loss)

        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs} | Train Loss: {avg_train_loss:.4f} | Val Loss: {val_loss:.4f}")

        # Early stopping check
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            best_model_state = model.state_dict()
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping at epoch {epoch+1}")
                break
    
    # Restore best model
    if best_model_state:
        model.load_state_dict(best_model_state)
        
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
            autoencoder = Autoencoder(input_dim) # Uses new architecture
            autoencoder.load_state_dict(checkpoint['model_state_dict'])
            autoencoder.eval()

            # Load scaler
            scaler = joblib.load(SCALER_PATH)

            return autoencoder, scaler
        except Exception as e:
            print(f"Error loading models: {e}")

    # Fallback: create and train default models
    print("Training default anomaly detection models with NEW Data Generator...")
    autoencoder, scaler = train_default_models()
    return autoencoder, scaler

def train_default_models():
    """Train models using realistic synthetic data"""
    from app.models.data_generator import DataGenerator
    
    # Generate realistic data
    generator = DataGenerator()
    sequences, labels, _ = generator.generate_dataset(n_normal=500, n_attack=0) # Train only on normal
    
    # Extract features matching the model's expected input
    # We use the simplified extractor for now since we don't have the full app context easily injected here
    features_list = [generator.extract_features_from_sequence(seq) for seq in sequences]
    X_normal = np.array(features_list)
    
    # Scale the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_normal)

    # Train autoencoder
    autoencoder = train_autoencoder(X_scaled, epochs=100, batch_size=32)

    # Save models
    torch.save({
        'input_dim': X_scaled.shape[1],
        'model_state_dict': autoencoder.state_dict()
    }, AUTOENCODER_MODEL_PATH)

    joblib.dump(scaler, SCALER_PATH)
    
    # Train Isolation Forest as fallback
    iso_forest = IsolationForest(contamination=0.1, random_state=42)
    iso_forest.fit(X_scaled)
    joblib.dump(iso_forest, ANOMALY_MODEL_PATH)

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