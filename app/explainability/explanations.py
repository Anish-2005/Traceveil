def generate_explanation(features: dict, anomaly_score: float, sequence_risk: float, graph_risk: float) -> str:
    """
    Generate human-readable explanation for risk score
    """
    explanations = []

    # Anomaly-based explanations
    if anomaly_score > 0.5:
        if features.get('burstiness_score', 0) > 1.5:
            explanations.append("Unusual burst of activity detected")
        if features.get('device_stability', 0) > 0.8:
            explanations.append("Multiple device changes")

    # Sequence-based explanations
    if sequence_risk > 0.5:
        explanations.append("Suspicious sequence of actions detected")

    # Graph-based explanations
    if graph_risk > 0.5:
        explanations.append("Connection to suspicious network detected")

    # Feature contributions
    if features.get('action_frequency', 0) > 10:
        explanations.append("High frequency of actions")

    if not explanations:
        explanations.append("Normal behavior detected")

    return "; ".join(explanations)

# Placeholder for SHAP integration
def compute_shap_values():
    # TODO: Implement SHAP for model explainability
    pass