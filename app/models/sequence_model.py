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
SEQUENCE_MODEL_PATH = os.path.join(MODEL_DIR, "sequence_model_v2.pth")
SEQUENCE_SCALER_PATH = os.path.join(MODEL_DIR, "sequence_scaler_v2.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

class EventDataset(Dataset):
    def __init__(self, sequences, labels):
        self.sequences = sequences
        self.labels = labels

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        return self.sequences[idx], self.labels[idx]

class Attention(nn.Module):
    def __init__(self, hidden_dim):
        super(Attention, self).__init__()
        self.attention = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.Tanh(),
            nn.Linear(hidden_dim // 2, 1)
        )
        
    def forward(self, x):
        # x shape: (batch_size, seq_len, hidden_dim)
        attn_weights = self.attention(x) # (batch_size, seq_len, 1)
        attn_weights = torch.softmax(attn_weights, dim=1)
        # Apply weights and sum along seq_len
        context = torch.sum(attn_weights * x, dim=1) # (batch_size, hidden_dim)
        return context, attn_weights

class LSTMSequenceModel(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 128, num_layers: int = 3):
        super(LSTMSequenceModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        # Enhanced feature extraction module before LSTM
        self.feature_extractor = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.LayerNorm(hidden_size),
            nn.GELU(),
            nn.Dropout(0.2)
        )

        # Bidirectional LSTM for temporal dependencies
        self.lstm = nn.LSTM(hidden_size, hidden_size, num_layers, batch_first=True, dropout=0.3, bidirectional=True)
        
        # Self-Attention mechanism
        self.attention = Attention(hidden_size * 2)

        # Deeper classifier with batch normalization
        self.fc = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.BatchNorm1d(hidden_size),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_size, 32),
            nn.BatchNorm1d(32),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        # Initial feature extraction
        x = self.feature_extractor(x)

        # BiLSTM requires 2 * num_layers for initial states
        h0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(x.device)

        out, _ = self.lstm(x, (h0, c0))
        # out shape: (batch_size, seq_len, hidden_size * 2)
        
        # Apply Attention instead of basic mean
        out, _ = self.attention(out) 
        
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

    # Split into Train/Val
    indices = np.random.permutation(len(X))
    split_idx = int(len(X) * 0.8)
    train_idx, val_idx = indices[:split_idx], indices[split_idx:]
    
    X_train, X_val = X[train_idx], X[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]

    # Train model
    input_size = 11
    model = LSTMSequenceModel(input_size, hidden_size=128, num_layers=3)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    train_dataset = EventDataset(X_train, y_train)
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    
    val_dataset = EventDataset(X_val, y_val)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

    print(f"Split: {len(X_train)} Train, {len(X_val)} Validation")

    for epoch in range(30): # Increased epochs slightly
        model.train()
        train_loss = 0
        for sequences, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(sequences.float())
            loss = criterion(outputs.squeeze(), labels.float())
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            
        # Validation phase
        model.eval()
        val_loss = 0
        correct = 0
        total = 0
        with torch.no_grad():
            for sequences, labels in val_loader:
                outputs = model(sequences.float())
                loss = criterion(outputs.squeeze(), labels.float())
                val_loss += loss.item()
                
                predicted = (outputs.squeeze() > 0.5).float()
                total += labels.size(0)
                correct += (predicted == labels.float()).sum().item()

        avg_train_loss = train_loss / len(train_loader)
        avg_val_loss = val_loss / len(val_loader) if len(val_loader) > 0 else 0
        val_acc = correct / total if total > 0 else 0

        if (epoch + 1) % 5 == 0:
            print(f"Epoch {epoch+1}/30 | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val Acc: {val_acc:.4f}")
            
            # Simple early stopping check
            if val_acc > 0.99 and avg_train_loss < 0.1:
                print("Reached high accuracy, stopping early to prevent overfitting.")
                break

    # Save model
    torch.save({
        'input_size': input_size,
        'hidden_size': 128,
        'num_layers': 3,
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