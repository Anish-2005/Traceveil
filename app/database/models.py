from app.database.firebase_config import get_firestore_client
from datetime import datetime
import uuid

try:
    from firebase_admin import firestore
except ImportError:
    firestore = None

class Event:
    def __init__(self, user_id, event_type, event_metadata, timestamp=None, risk_score=None):
        self.id = str(uuid.uuid4())
        self.user_id = user_id
        self.event_type = event_type
        self.event_metadata = event_metadata
        self.timestamp = timestamp or datetime.now()
        self.risk_score = risk_score

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_type': self.event_type,
            'event_metadata': self.event_metadata,
            'timestamp': self.timestamp,
            'risk_score': self.risk_score
        }

    @classmethod
    def from_dict(cls, data):
        event = cls(
            user_id=data['user_id'],
            event_type=data['event_type'],
            event_metadata=data['event_metadata'],
            timestamp=data['timestamp'],
            risk_score=data.get('risk_score')
        )
        event.id = data['id']
        return event

class UserProfile:
    def __init__(self, user_id, behavioral_fingerprint=None, last_updated=None):
        self.user_id = user_id
        self.behavioral_fingerprint = behavioral_fingerprint or {}
        self.last_updated = last_updated or datetime.now()

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'behavioral_fingerprint': self.behavioral_fingerprint,
            'last_updated': self.last_updated
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data['user_id'],
            behavioral_fingerprint=data.get('behavioral_fingerprint', {}),
            last_updated=data.get('last_updated')
        )

# In-memory storage for development/demo without Firebase
_IN_MEMORY_EVENTS = []

# Firestore operations
def save_event(event):
    db = get_firestore_client()
    if db is None:
        print(f"Mock: Event saved to in-memory store ({event.id})")
        _IN_MEMORY_EVENTS.append(event)
        return
    doc_ref = db.collection('events').document(event.id)
    doc_ref.set(event.to_dict())

def get_user_events(user_id, limit=1000):
    db = get_firestore_client()
    if db is None:
        # Filter in-memory events
        events = [e for e in _IN_MEMORY_EVENTS if e.user_id == user_id]
        events.sort(key=lambda x: x.timestamp, reverse=True)
        return events[:limit]
        
    events_ref = db.collection('events').where('user_id', '==', user_id).order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit)
    docs = events_ref.stream()
    return [Event.from_dict(doc.to_dict()) for doc in docs]

def save_user_profile(profile):
    db = get_firestore_client()
    if db is None:
        print("Mock: Profile saved (not really)")
        return
    doc_ref = db.collection('user_profiles').document(profile.user_id)
    doc_ref.set(profile.to_dict())

def get_user_profile(user_id):
    db = get_firestore_client()
    if db is None:
        print("Mock: Returning None profile")
        return None
    doc = db.collection('user_profiles').document(user_id).get()
    if doc.exists:
        return UserProfile.from_dict(doc.to_dict())
    return None

def get_total_events_count():
    """Get total number of events in the system"""
    db = get_firestore_client()
    if db is None:
        return len(_IN_MEMORY_EVENTS)

    try:
        # Optimized count using aggregation query
        events_ref = db.collection('events')
        if hasattr(events_ref, 'count'):
             aggregate_query = events_ref.count()
             results = aggregate_query.get()
             return results[0][0].value
        
        docs = events_ref.select([]).stream()
        count = sum(1 for _ in docs)
        return max(count, 1)
    except Exception as e:
        print(f"Error getting events count: {e}")
        return 0

def get_recent_high_risk_events(limit=10):
    """Get recent high-risk events"""
    db = get_firestore_client()
    if db is None:
        # Return in-memory high risk events, or empty list if none
        high_risk = [e for e in _IN_MEMORY_EVENTS if (e.risk_score or 0) > 0.7]
        high_risk.sort(key=lambda x: x.timestamp, reverse=True)
        
        result = []
        for e in high_risk[:limit]:
            result.append({
                "id": e.id,
                "user_id": e.user_id,
                "event_type": e.event_type,
                "risk_score": e.risk_score,
                "timestamp": e.timestamp,
                "description": f"High risk {e.event_type} detected",
                "severity": "critical" if (e.risk_score or 0) > 0.9 else "high",
                "flags": ["simulated"]
            })
            
        return result

    try:
        # Get recent events with high risk scores
        events_ref = db.collection('events') \
            .where('risk_score', '>', 0.7) \
            .order_by('risk_score', direction=firestore.Query.DESCENDING) \
            .order_by('timestamp', direction=firestore.Query.DESCENDING) \
            .limit(limit)

        docs = events_ref.stream()
        high_risk_events = []

        for doc in docs:
            event_data = doc.to_dict()
            high_risk_events.append({
                "id": event_data.get('id'),
                "user_id": event_data.get('user_id'),
                "event_type": event_data.get('event_type'),
                "risk_score": event_data.get('risk_score', 0),
                "timestamp": event_data.get('timestamp'),
                "description": f"{event_data.get('event_type', 'Unknown')} event",
                "severity": "critical" if event_data.get('risk_score', 0) > 0.9 else "high",
                "flags": ["high_risk"]
            })

        return high_risk_events
    except Exception as e:
        print(f"Error getting high-risk events: {e}")
        return []