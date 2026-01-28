from app.database.models import get_user_events
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

def compute_features(user_id: str):
    # Get user's events from last 24 hours
    yesterday = datetime.now() - timedelta(days=1)
    events = get_user_events(user_id, limit=1000)

    # Filter by time
    recent_events = [e for e in events if e.timestamp >= yesterday]

    if not recent_events:
        return {
            'action_frequency': 0,
            'burstiness_score': 0,
            'reaction_time_entropy': 0,
            'session_duration_variance': 0,
            'mouse_speed': 0,
            'working_hours': 0,
            'decision_latency': 0,
            'device_stability': 0,
            'baseline_deviation': 0,
            'cohort_deviation': 0,
            'pattern_shift': 0
        }

    # Convert to DataFrame for easier processing
    df = pd.DataFrame([{
        'timestamp': e.timestamp,
        'event_type': e.event_type,
        'metadata': e.event_metadata
    } for e in recent_events])

    # Temporal Features
    action_frequency = len(df) / 24  # actions per hour

    # Burstiness: coefficient of variation of inter-event times
    if len(df) > 1:
        inter_times = df['timestamp'].diff().dt.total_seconds().dropna()
        burstiness_score = inter_times.std() / inter_times.mean() if inter_times.mean() > 0 else 0
    else:
        burstiness_score = 0

    # Reaction time entropy (simplified)
    reaction_times = [e['metadata'].get('reaction_time', 1) for e in recent_events if 'reaction_time' in e['metadata']]
    if reaction_times:
        reaction_time_entropy = -sum((np.array(reaction_times) / sum(reaction_times)) * np.log(np.array(reaction_times) / sum(reaction_times)))
    else:
        reaction_time_entropy = 0

    # Session duration variance (simplified)
    session_durations = [e['metadata'].get('session_duration', 0) for e in recent_events if 'session_duration' in e['metadata']]
    session_duration_variance = np.var(session_durations) if session_durations else 0

    # Behavioral Fingerprints
    mouse_speeds = [e['metadata'].get('mouse_speed', 0) for e in recent_events if 'mouse_speed' in e['metadata']]
    mouse_speed = np.mean(mouse_speeds) if mouse_speeds else 0

    # Working hours (simplified: hour of day)
    hours = df['timestamp'].dt.hour
    working_hours = hours.between(9, 17).sum() / len(hours) if len(hours) > 0 else 0

    decision_latencies = [e['metadata'].get('decision_latency', 0) for e in recent_events if 'decision_latency' in e['metadata']]
    decision_latency = np.mean(decision_latencies) if decision_latencies else 0

    # Device stability (count unique devices)
    devices = [e['metadata'].get('device_id', 'unknown') for e in recent_events]
    device_stability = len(set(devices)) / len(devices) if devices else 0

    # Statistical Drift Features (simplified)
    # For now, placeholder - would need historical data
    baseline_deviation = 0  # deviation from user's historical average
    cohort_deviation = 0    # deviation from similar users
    pattern_shift = 0       # sudden changes

    return {
        'action_frequency': action_frequency,
        'burstiness_score': burstiness_score,
        'reaction_time_entropy': reaction_time_entropy,
        'session_duration_variance': session_duration_variance,
        'mouse_speed': mouse_speed,
        'working_hours': working_hours,
        'decision_latency': decision_latency,
        'device_stability': device_stability,
        'baseline_deviation': baseline_deviation,
        'cohort_deviation': cohort_deviation,
        'pattern_shift': pattern_shift
    }