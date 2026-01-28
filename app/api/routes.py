from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Event
from app.features.feature_engineering import compute_features
from app.models.anomaly_detector import detect_anomaly
from app.models.sequence_model import predict_sequence_risk
from app.models.graph_model import compute_graph_risk
from app.risk_engine.scoring import calculate_risk_score
from app.explainability.explanations import generate_explanation
from pydantic import BaseModel
from datetime import datetime
import json

router = APIRouter()

class EventData(BaseModel):
    user_id: str
    event_type: str
    metadata: dict
    timestamp: datetime

@router.post("/ingest")
async def ingest_event(event: EventData, db: Session = Depends(get_db)):
    # Store event
    db_event = Event(
        user_id=event.user_id,
        event_type=event.event_type,
        event_metadata=event.metadata,
        timestamp=event.timestamp
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Compute features
    features = compute_features(event.user_id, db)

    # Get risk scores from models
    anomaly_score = detect_anomaly(features)
    sequence_risk = predict_sequence_risk(event.user_id, db)
    graph_risk = compute_graph_risk(event.user_id, db)

    # Calculate final risk
    final_risk = calculate_risk_score(anomaly_score, sequence_risk, graph_risk)

    # Update event with risk score
    db_event.risk_score = final_risk
    db.commit()

    # Generate explanation
    explanation = generate_explanation(features, anomaly_score, sequence_risk, graph_risk)

    return {
        "event_id": db_event.id,
        "risk_score": final_risk,
        "explanation": explanation
    }

@router.get("/user/{user_id}/risk")
async def get_user_risk(user_id: str, db: Session = Depends(get_db)):
    # Get recent events
    events = db.query(Event).filter(Event.user_id == user_id).order_by(Event.timestamp.desc()).limit(100).all()

    if not events:
        raise HTTPException(status_code=404, detail="User not found")

    # Compute current risk
    features = compute_features(user_id, db)
    anomaly_score = detect_anomaly(features)
    sequence_risk = predict_sequence_risk(user_id, db)
    graph_risk = compute_graph_risk(user_id, db)
    final_risk = calculate_risk_score(anomaly_score, sequence_risk, graph_risk)

    explanation = generate_explanation(features, anomaly_score, sequence_risk, graph_risk)

    return {
        "user_id": user_id,
        "risk_score": final_risk,
        "explanation": explanation,
        "recent_events": len(events)
    }