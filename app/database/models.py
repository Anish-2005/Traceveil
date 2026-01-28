from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from app.database.connection import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    event_type = Column(String, index=True)
    metadata = Column(JSON)
    timestamp = Column(DateTime)
    risk_score = Column(Float, nullable=True)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    behavioral_fingerprint = Column(JSON)
    last_updated = Column(DateTime)