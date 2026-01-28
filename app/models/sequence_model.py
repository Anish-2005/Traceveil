import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import joblib
import os
from typing import List, Dict, Any
from app.database.models import get_user_events

MODEL_DIR = "app/models"
SEQUENCE_MODEL_PATH = os.path.join(MODEL_DIR, "sequence_model.pth")
SEQUENCE_SCALER_PATH = os.path.join(MODEL_DIR, "sequence_scaler.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

class EventDataset(Dataset):
    def __init__(self, sequences, labels):
        self.sequences = sequences
        self.labels = labels

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        return self.sequences[idx], self.labels[idx]

class LSTMSequenceModel(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 64, num_layers: int = 2):
        super(LSTMSequenceModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)

        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])  # Take last time step
        return out

def extract_sequence_features(events: List) -> np.ndarray:
    """Extract features from a sequence of events"""
    if not events:
        return np.zeros(11)  # Same as feature vector size

    features = []

    # Time-based features
    timestamps = [e.timestamp for e in events]
    if len(timestamps) > 1:
        time_diffs = np.diff([t.timestamp() for t in timestamps])
        features.extend([
            np.mean(time_diffs),  # avg time between events
            np.std(time_diffs),   # std of time between events
            np.min(time_diffs),   # min time between events
            np.max(time_diffs),   # max time between events
        ])
    else:
        features.extend([0, 0, 0, 0])

    # Event type diversity
    event_types = [e.event_type for e in events]
    unique_types = len(set(event_types))
    type_entropy = -sum((np.array(list(np.unique(event_types, return_counts=True)[1])) / len(event_types)) *
                        np.log(np.array(list(np.unique(event_types, return_counts=True)[1])) / len(event_types)))
    features.extend([unique_types / len(event_types), type_entropy])

    # Metadata features
    mouse_speeds = [e.event_metadata.get('mouse_speed', 0) for e in events if e.event_metadata.get('mouse_speed')]
    reaction_times = [e.event_metadata.get('reaction_time', 0) for e in events if e.event_metadata.get('reaction_time')]

    features.extend([
        np.mean(mouse_speeds) if mouse_speeds else 0,
        np.std(mouse_speeds) if mouse_speeds else 0,
        np.mean(reaction_times) if reaction_times else 0,
        np.std(reaction_times) if reaction_times else 0,
    ])

    # Pad or truncate to fixed size
    while len(features) < 11:
        features.append(0)

    return np.array(features[:11])

def create_sequences(user_events: List, sequence_length: int = 10) -> List[np.ndarray]:
    """Create sequences from user events"""
    sequences = []
    for i in range(len(user_events) - sequence_length + 1):
        sequence_events = user_events[i:i + sequence_length]
        sequence_features = [extract_sequence_features([e]) for e in sequence_events]
        sequences.append(np.array(sequence_features))

    return sequences if sequences else [np.zeros((sequence_length, 11))]

def load_sequence_model():
    """Load trained sequence model or create default"""
    if os.path.exists(SEQUENCE_MODEL_PATH):
        try:
            checkpoint = torch.load(SEQUENCE_MODEL_PATH)
            model = LSTMSequenceModel(checkpoint['input_size'], checkpoint['hidden_size'], checkpoint['num_layers'])
            model.load_state_dict(checkpoint['model_state_dict'])
            model.eval()
            return model
        except Exception as e:
            print(f"Error loading sequence model: {e}")

    # Create and train default model
    print("Training default sequence model...")
    model = train_default_sequence_model()
    return model

def train_default_sequence_model():
    """Train a basic sequence model on synthetic data"""
    # Generate synthetic sequences
    np.random.seed(42)
    n_sequences = 500
    sequence_length = 10
    input_size = 11

    # Normal sequences
    normal_sequences = []
    for _ in range(n_sequences // 2):
        seq = np.random.normal(0, 0.5, (sequence_length, input_size))
        # Add some patterns
        seq[:, 0] = np.random.uniform(1, 10, sequence_length)  # action frequency
        seq[:, 4] = np.random.uniform(400, 1200, sequence_length)  # mouse speed
        normal_sequences.append(seq)

    # Suspicious sequences
    suspicious_sequences = []
    for _ in range(n_sequences // 2):
        seq = np.random.normal(0, 1.0, (sequence_length, input_size))
        # Add suspicious patterns
        seq[:, 0] = np.random.uniform(20, 100, sequence_length)  # high action frequency
        seq[:, 1] = np.random.uniform(2, 5, sequence_length)     # high burstiness
        seq[:, 4] = np.random.uniform(1500, 2500, sequence_length)  # very fast mouse
        suspicious_sequences.append(seq)

    # Labels: 0 = normal, 1 = suspicious
    X = np.array(normal_sequences + suspicious_sequences)
    y = np.array([0] * len(normal_sequences) + [1] * len(suspicious_sequences))

    # Train model
    model = LSTMSequenceModel(input_size)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    dataset = EventDataset(X, y)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    for epoch in range(50):
        model.train()
        epoch_loss = 0
        for sequences, labels in dataloader:
            optimizer.zero_grad()
            outputs = model(sequences.float())
            loss = criterion(outputs.squeeze(), labels.float())
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        if (epoch + 1) % 10 == 0:
            print(f"Sequence Model Epoch {epoch+1}/50, Loss: {epoch_loss/len(dataloader):.4f}")

    # Save model
    torch.save({
        'input_size': input_size,
        'hidden_size': 64,
        'num_layers': 2,
        'model_state_dict': model.state_dict()
    }, SEQUENCE_MODEL_PATH)

    return model

def predict_sequence_risk(user_id: str) -> float:
    """Predict risk from user's event sequence"""
    events = get_user_events(user_id, limit=50)

    if len(events) < 5:
        return 0.0  # Not enough data for sequence analysis

    # Create sequences
    sequences = create_sequences(events)

    if not sequences:
        return 0.0

    # Load model and predict
    model = load_sequence_model()

    with torch.no_grad():
        # Take the most recent sequence
        sequence = torch.FloatTensor(sequences[-1]).unsqueeze(0)  # Add batch dimension
        output = model(sequence)
        risk_score = output.item()

    # Rule-based fallback for suspicious patterns
    rule_based_score = 0.0

    # Check for rapid tab switching
    tab_switches = sum(1 for e in events if e.event_type == 'tab_switch')
    if tab_switches / len(events) > 0.3:
        rule_based_score += 0.4

    # Check for IP changes
    ips = [e.event_metadata.get('ip', '') for e in events]
    unique_ips = len(set(ips))
    if unique_ips / len(events) > 0.5:
        rule_based_score += 0.3

    # Check for abnormal mouse speeds
    mouse_speeds = [e.event_metadata.get('mouse_speed', 0) for e in events if 'mouse_speed' in e.event_metadata]
    if mouse_speeds and np.mean(mouse_speeds) > 1800:
        rule_based_score += 0.3

    # Combine ML and rule-based scores
    final_score = 0.7 * risk_score + 0.3 * rule_based_score

    return min(1.0, max(0.0, final_score))

    return risk_score

# Placeholder for actual LSTM model
# In production, would train on sequences of events
def train_sequence_model():
    # TODO: Implement LSTM training
    pass

def train_lstm_model(X_train, X_test, y_train, y_test, epochs=50, batch_size=32):
    """Train LSTM model for sequence anomaly detection"""
    # Determine input dimensions based on data shape
    if X_train.ndim == 3:
        # Sequence data: (batch_size, seq_len, n_features)
        input_size = X_train.shape[2]
        seq_len = X_train.shape[1]
        print(f"Training LSTM on sequence data: {X_train.shape[0]} sequences, length {seq_len}, {input_size} features")
    elif X_train.ndim == 2:
        # Tabular data: treat as single time step
        input_size = X_train.shape[1]
        X_train = X_train.unsqueeze(1)  # Add sequence dimension: (batch_size, 1, n_features)
        X_test = X_test.unsqueeze(1)
        print(f"Training LSTM on tabular data: {X_train.shape[0]} samples, {input_size} features")
    else:
        raise ValueError(f"Unsupported data dimensionality: {X_train.ndim}D")
    
    model = LSTMSequenceModel(input_size)
    
    # Convert to tensors
    X_train_tensor = torch.FloatTensor(X_train)
    y_train_tensor = torch.FloatTensor(y_train)
    X_test_tensor = torch.FloatTensor(X_test)
    y_test_tensor = torch.FloatTensor(y_test)
    
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Training loop
    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        outputs = model(X_train_tensor)
        loss = criterion(outputs.squeeze(), y_train_tensor)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item():.4f}")
    
    return model