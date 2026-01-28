from app.database.firebase_config import get_firestore_client
from datetime import datetime
import uuid

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

# Firestore operations
def save_event(event):
    db = get_firestore_client()
    doc_ref = db.collection('events').document(event.id)
    doc_ref.set(event.to_dict())

def get_user_events(user_id, limit=1000):
    db = get_firestore_client()
    events_ref = db.collection('events').where('user_id', '==', user_id).order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit)
    docs = events_ref.stream()
    return [Event.from_dict(doc.to_dict()) for doc in docs]

def save_user_profile(profile):
    db = get_firestore_client()
    doc_ref = db.collection('user_profiles').document(profile.user_id)
    doc_ref.set(profile.to_dict())

def get_user_profile(user_id):
    db = get_firestore_client()
    doc = db.collection('user_profiles').document(user_id).get()
    if doc.exists:
        return UserProfile.from_dict(doc.to_dict())
    return None