from typing import Dict, Any
from app.models.feedback_loop import adaptive_thresholds

def calculate_risk_score(anomaly_score: float, sequence_risk: float, graph_risk: float) -> float:
    """
    Combine multiple risk signals into final score
    Weights based on the system philosophy
    """
    weights = {
        'anomaly': 0.35,
        'sequence': 0.40,
        'graph': 0.25
    }

    final_score = (
        weights['anomaly'] * anomaly_score +
        weights['sequence'] * sequence_risk +
        weights['graph'] * graph_risk
    )

    return min(1.0, max(0.0, final_score))

def get_risk_category(risk_score: float) -> str:
    """
    Categorize risk level using adaptive thresholds
    """
    thresholds = adaptive_thresholds.get_current_thresholds()

    if risk_score < thresholds['safe_threshold']:
        return "safe"
    elif risk_score < thresholds['monitor_threshold']:
        return "monitor"
    else:
        return "block"

def get_risk_assessment(risk_score: float) -> Dict[str, Any]:
    """
    Get comprehensive risk assessment with adaptive thresholds
    """
    category = get_risk_category(risk_score)
    thresholds = adaptive_thresholds.get_current_thresholds()

    return {
        'score': risk_score,
        'category': category,
        'thresholds': thresholds,
        'confidence': calculate_confidence(risk_score, category, thresholds),
        'recommendation': get_recommendation(category)
    }

def calculate_confidence(risk_score: float, category: str, thresholds: Dict[str, float]) -> float:
    """
    Calculate confidence in the risk assessment
    """
    if category == "safe":
        # Distance from monitor threshold
        if risk_score < thresholds['safe_threshold']:
            distance = thresholds['safe_threshold'] - risk_score
            return min(1.0, distance * 2.5)  # Scale to 0-1
        else:
            return 0.5  # Borderline
    elif category == "monitor":
        # Distance from both thresholds
        safe_dist = risk_score - thresholds['safe_threshold']
        block_dist = thresholds['monitor_threshold'] - risk_score
        return min(1.0, min(safe_dist, block_dist) * 5)  # Scale to 0-1
    else:  # block
        if risk_score > thresholds['monitor_threshold']:
            distance = risk_score - thresholds['monitor_threshold']
            return min(1.0, distance * 2.5)  # Scale to 0-1
        else:
            return 0.5  # Borderline

def get_recommendation(category: str) -> str:
    """
    Get action recommendation based on risk category
    """
    recommendations = {
        "safe": "Allow transaction with normal processing",
        "monitor": "Allow transaction but flag for additional review",
        "block": "Block transaction and require additional verification"
    }
    return recommendations.get(category, "Review manually")

def update_thresholds_based_on_performance(metrics: Dict[str, Any]):
    """
    Update adaptive thresholds based on model performance
    """
    new_thresholds = adaptive_thresholds.adjust_thresholds(metrics)
    print(f"Updated thresholds: {new_thresholds}")
    return new_thresholds