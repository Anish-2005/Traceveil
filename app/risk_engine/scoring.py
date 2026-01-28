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
    Categorize risk level
    """
    if risk_score < 0.4:
        return "safe"
    elif risk_score < 0.7:
        return "monitor"
    else:
        return "block"

def dynamic_threshold_adjustment(historical_performance: dict) -> dict:
    """
    Adjust thresholds based on performance
    Placeholder for dynamic threshold logic
    """
    # TODO: Implement threshold adjustment based on false positives, etc.
    return {
        'safe_threshold': 0.4,
        'monitor_threshold': 0.7
    }