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

        # Bidirectional LSTM for better context
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2, bidirectional=True)
        # Output layer sees 2 * hidden_size because of bidirectionality
        self.fc = nn.Sequential(
            nn.Linear(hidden_size * 2, 32),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        # BiLSTM requires 2 * num_layers for initial states
        h0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(x.device)

        out, _ = self.lstm(x, (h0, c0))
        # out shape: (batch_size, seq_len, hidden_size * 2)
        
        # Take mean over sequence
        out = torch.mean(out, dim=1) 
        
        out = self.fc(out)
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
    
    if len(event_types) > 0:
        counts = list(np.unique(event_types, return_counts=True)[1])
        probs = np.array(counts) / len(event_types)
        type_entropy = -sum(probs * np.log(probs + 1e-9)) # Add epsilon
    else:
        unique_types = 0
        type_entropy = 0
        
    features.extend([unique_types / max(1, len(event_types)), type_entropy])

    # Metadata features
    mouse_speeds = [e.event_metadata.get('mouse_speed', 0) for e in events if isinstance(e.event_metadata, dict) and e.event_metadata.get('mouse_speed')]
    reaction_times = [e.event_metadata.get('reaction_time', 0) for e in events if isinstance(e.event_metadata, dict) and e.event_metadata.get('reaction_time')]

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
    if len(user_events) < sequence_length:
        # If not enough events, pad or just return one short sequence?
        # For training, we want consistent length. 
        # But for new data generator, we rely on this.
        pass
        
    for i in range(len(user_events) - sequence_length + 1):
        sequence_events = user_events[i:i + sequence_length]
        sequence_features = [extract_sequence_features([e]) for e in sequence_events]
        sequences.append(np.array(sequence_features))

    return sequences if sequences else []

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
    """Train a sequence model on realistic synthetic data"""
    from app.models.data_generator import DataGenerator
    
    generator = DataGenerator()
    
    # Generate data
    sequences_normal, labels_normal, raw_normal = generator.generate_dataset(n_normal=200, n_attack=0)
    sequences_attack, labels_attack, raw_attack = generator.generate_dataset(n_normal=0, n_attack=200)
    
    def process_raw_sessions(sessions):
        processed_seqs = []
        for session in sessions:
            if len(session) < 11: continue # Need at least sequence_length + 1?
            
            # Mock Event class
            class MockEvent:
                def __init__(self, data):
                    self.timestamp = data['timestamp']
                    self.event_type = data['event_type']
                    self.event_metadata = data.get('metadata', {})
            
            events = [MockEvent(e) for e in session]
            # Use chunks of 10
            seqs = create_sequences(events, sequence_length=10)
            processed_seqs.extend(seqs)
            
        return processed_seqs

    X_normal = process_raw_sessions(raw_normal)
    X_attack = process_raw_sessions(raw_attack)
    
    if not X_normal or not X_attack:
        print("Warning: Not enough data generated for sequence training")
        # Fallback to random if generator fails (shouldn't happen)
        return None

    X = np.array(X_normal + X_attack)
    y = np.array([0] * len(X_normal) + [1] * len(X_attack))
    
    print(f"Training Sequence Model on {len(X)} sequences ({len(X_normal)} normal, {len(X_attack)} attack)")

    # Train model
    input_size = 11
    model = LSTMSequenceModel(input_size, hidden_size=64, num_layers=2)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    dataset = EventDataset(X, y)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    for epoch in range(20): 
        model.train()
        epoch_loss = 0
        for sequences, labels in dataloader:
            optimizer.zero_grad()
            outputs = model(sequences.float())
            loss = criterion(outputs.squeeze(), labels.float())
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        if (epoch + 1) % 5 == 0:
            print(f"Sequence Model Epoch {epoch+1}/20, Loss: {epoch_loss/len(dataloader):.4f}")

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
    if not model: return 0.0

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