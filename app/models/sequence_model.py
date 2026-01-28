import numpy as np
from sqlalchemy.orm import Session
from app.database.models import Event

def predict_sequence_risk(user_id: str, db: Session) -> float:
    # Get recent events for sequence
    events = db.query(Event).filter(Event.user_id == user_id).order_by(Event.timestamp.desc()).limit(50).all()

    if len(events) < 5:
        return 0.0  # Not enough data

    # Simple sequence analysis: check for suspicious patterns
    event_types = [e.event_type for e in reversed(events)]  # chronological order

    # Example: rapid tab switching might indicate cheating
    tab_switches = sum(1 for et in event_types if et == 'tab_switch')
    rapid_switches = tab_switches / len(event_types)

    # IP changes
    ips = [e.event_metadata.get('ip', '') for e in events]
    unique_ips = len(set(ips))
    ip_change_rate = unique_ips / len(events)

    # Combine into risk score
    risk_score = min(1.0, (rapid_switches * 0.6) + (ip_change_rate * 0.4))

    return risk_score

# Placeholder for actual LSTM model
# In production, would train on sequences of events
def train_sequence_model():
    # TODO: Implement LSTM training
    pass