from fastapi import APIRouter, HTTPException
from app.database.models import Event, save_event, get_user_events
from app.features.feature_engineering import compute_features
from app.models.anomaly_detector import detect_anomaly
from app.models.sequence_model import predict_sequence_risk
from app.models.graph_model import compute_graph_risk
from app.risk_engine.scoring import calculate_risk_score
from app.explainability.explanations import generate_explanation
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class EventData(BaseModel):
    user_id: str
    event_type: str
    metadata: dict
    timestamp: datetime

@router.post("/ingest")
async def ingest_event(event: EventData):
    # Create and save event
    db_event = Event(
        user_id=event.user_id,
        event_type=event.event_type,
        event_metadata=event.metadata,
        timestamp=event.timestamp
    )
    save_event(db_event)

    # Compute features
    features = compute_features(event.user_id)

    # Get risk scores from models
    anomaly_score = detect_anomaly(features)
    sequence_risk = predict_sequence_risk(event.user_id)
    graph_risk = compute_graph_risk(event.user_id)

    # Calculate final risk
    final_risk = calculate_risk_score(anomaly_score, sequence_risk, graph_risk)

    # Update event with risk score (in a real implementation, you'd update the document)
    db_event.risk_score = final_risk

    # Generate explanation
    explanation = generate_explanation(features, anomaly_score, sequence_risk, graph_risk)

    return {
        "event_id": db_event.id,
        "risk_score": final_risk,
        "explanation": explanation
    }

@router.get("/user/{user_id}/risk")
async def get_user_risk(user_id: str):
    # Get recent events
    events = get_user_events(user_id, limit=100)

    if not events:
        raise HTTPException(status_code=404, detail="User not found")

    # Compute current risk
    features = compute_features(user_id)
    anomaly_score = detect_anomaly(features)
    sequence_risk = predict_sequence_risk(user_id)
    graph_risk = compute_graph_risk(user_id)
    final_risk = calculate_risk_score(anomaly_score, sequence_risk, graph_risk)

    explanation = generate_explanation(features, anomaly_score, sequence_risk, graph_risk)

    return {
        "user_id": user_id,
        "risk_score": final_risk,
        "explanation": explanation,
        "recent_events": len(events)
    }