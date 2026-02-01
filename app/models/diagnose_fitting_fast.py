import sys
import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torch.utils.data import DataLoader

# Add project root to path
sys.path.append(os.getcwd())

from app.models.data_generator import DataGenerator
from app.models.anomaly_detector import Autoencoder
from app.models.sequence_model import LSTMSequenceModel, EventDataset

def diagnose_fast():
    print("="*60)
    print("FAST FITTING DIAGNOSIS")
    print("="*60)
    
    generator = DataGenerator(seed=42)
    device = torch.device('cpu')

    # --- 1. ANOMALY DETECTOR ---
    print("\n[Anomaly Detector]")
    # Generate small data
    seqs, _, _ = generator.generate_dataset(n_normal=100, n_attack=0)
    features = np.array([generator.extract_features_from_sequence(s) for s in seqs])
    
    # Scale (simple manual scaling for test)
    mean = features.mean(axis=0)
    std = features.std(axis=0) + 1e-6
    X = (features - mean) / std
    
    # Split
    split = int(len(X) * 0.8)
    X_train = torch.FloatTensor(X[:split])
    X_val = torch.FloatTensor(X[split:])
    
    print(f"Data: {len(X_train)} Train, {len(X_val)} Val")
    
    model = Autoencoder(input_dim=X.shape[1])
    optimizer = optim.Adam(model.parameters(), lr=0.005)
    criterion = nn.MSELoss()
    
    for epoch in range(20):
        model.train()
        optimizer.zero_grad()
        out = model(X_train)
        loss = criterion(out, X_train)
        loss.backward()
        optimizer.step()
        
        if (epoch+1) % 10 == 0:
            model.eval()
            with torch.no_grad():
                val_out = model(X_val)
                val_loss = criterion(val_out, X_val).item()
            print(f"Epoch {epoch+1}: Train Loss {loss.item():.4f} | Val Loss {val_loss:.4f}")
            
    # --- 2. SEQUENCE MODEL ---
    print("\n[Sequence Model]")
    # Generate small data
    # Need to process raw sessions to sequences manually as per train_default_sequence_model logic
    # We'll simplified it here
    from app.models.sequence_model import create_sequences, extract_sequence_features
    
    # Generate raw
    _, _, raw_normal = generator.generate_dataset(n_normal=50, n_attack=0)
    _, _, raw_attack = generator.generate_dataset(n_normal=0, n_attack=50)
    
    def to_seqs(sessions):
        res = []
        for s in sessions:
            # Mock objects
            class M:
                def __init__(self, d): 
                    self.timestamp=d['timestamp']; self.event_type=d['event_type']; self.event_metadata=d.get('metadata',{})
            events = [M(e) for e in s]
            sq = create_sequences(events, 10)
            res.extend(sq)
        return res

    seq_norm = to_seqs(raw_normal)
    seq_att = to_seqs(raw_attack)
    
    X_s = np.array(seq_norm + seq_att)
    y_s = np.array([0]*len(seq_norm) + [1]*len(seq_att))
    
    # Split
    indices = np.random.permutation(len(X_s))
    sp = int(len(X_s) * 0.8)
    tr_idx, val_idx = indices[:sp], indices[sp:]
    X_tr, X_v = X_s[tr_idx], X_s[val_idx]
    y_tr, y_v = y_s[tr_idx], y_s[val_idx]
    
    print(f"Data: {len(X_tr)} Train, {len(X_v)} Val")
    
    model_seq = LSTMSequenceModel(11, 64, 2)
    opt_seq = optim.Adam(model_seq.parameters(), lr=0.005)
    crit_seq = nn.BCELoss()
    
    ds_tr = EventDataset(X_tr, y_tr)
    dl_tr = DataLoader(ds_tr, batch_size=16, shuffle=True)
    ds_v = EventDataset(X_v, y_v)
    dl_v = DataLoader(ds_v, batch_size=16, shuffle=False)
    
    for epoch in range(15):
        model_seq.train()
        tr_loss = 0
        for x, y in dl_tr:
            opt_seq.zero_grad()
            o = model_seq(x.float())
            l = crit_seq(o.squeeze(), y.float())
            l.backward()
            opt_seq.step()
            tr_loss += l.item()
            
        if (epoch+1) % 5 == 0:
            model_seq.eval()
            v_loss = 0
            corr = 0
            tot = 0
            with torch.no_grad():
                for x, y in dl_v:
                    o = model_seq(x.float())
                    v_loss += crit_seq(o.squeeze(), y.float()).item()
                    pred = (o.squeeze() > 0.5).float()
                    corr += (pred == y.float()).sum().item()
                    tot += y.size(0)
            
            print(f"Epoch {epoch+1}: Train Loss {tr_loss/len(dl_tr):.4f} | Val Loss {v_loss/len(dl_v):.4f} | Val Acc {corr/tot:.4f}")

if __name__ == "__main__":
    diagnose_fast()
