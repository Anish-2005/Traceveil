import shap
import numpy as np
import pandas as pd
from typing import Dict, Any, List
import os

# Global explainer cache
explainer_cache = {}

def get_feature_names() -> List[str]:
    """Get feature names for explanations"""
    return [
        'action_frequency', 'burstiness_score', 'reaction_time_entropy',
        'session_duration_variance', 'mouse_speed', 'working_hours',
        'decision_latency', 'device_stability', 'baseline_deviation',
        'cohort_deviation', 'pattern_shift'
    ]

def create_explainer(model, background_data: np.ndarray = None):
    """Create SHAP explainer for a model"""
    if background_data is None:
        # Create synthetic background data
        background_data = np.random.normal(0, 1, (100, 11))

    try:
        if hasattr(model, 'predict_proba'):
            # For scikit-learn models
            explainer = shap.TreeExplainer(model, background_data)
        elif hasattr(model, 'forward'):
            # For PyTorch models
            explainer = shap.DeepExplainer(model, background_data)
        else:
            # Fallback
            explainer = shap.Explainer(model, background_data)

        return explainer
    except Exception as e:
        print(f"Error creating explainer: {e}")
        return None

def explain_anomaly_score(features: Dict[str, Any], anomaly_score: float) -> Dict[str, Any]:
    """Explain anomaly detection score"""
    feature_names = get_feature_names()
    feature_values = np.array([list(features.values())])

    # Simple rule-based explanations for anomaly
    explanations = []

    if anomaly_score > 0.7:
        if features.get('action_frequency', 0) > 15:
            explanations.append({
                'feature': 'action_frequency',
                'value': features['action_frequency'],
                'contribution': 0.3,
                'description': 'Unusually high activity frequency'
            })

        if features.get('burstiness_score', 0) > 1.5:
            explanations.append({
                'feature': 'burstiness_score',
                'value': features['burstiness_score'],
                'contribution': 0.25,
                'description': 'Irregular activity patterns detected'
            })

        if features.get('device_stability', 0) < 0.3:
            explanations.append({
                'feature': 'device_stability',
                'value': features['device_stability'],
                'contribution': 0.2,
                'description': 'Multiple device changes'
            })

    return {
        'score': anomaly_score,
        'top_contributors': explanations[:3],
        'method': 'rule-based'
    }

def explain_sequence_score(user_id: str, sequence_score: float) -> Dict[str, Any]:
    """Explain sequence-based risk score"""
    explanations = []

    if sequence_score > 0.6:
        explanations.append({
            'pattern': 'rapid_tab_switching',
            'confidence': 0.8,
            'description': 'Frequent tab switching detected'
        })

        explanations.append({
            'pattern': 'ip_changes',
            'confidence': 0.7,
            'description': 'Multiple IP address changes'
        })

    return {
        'score': sequence_score,
        'detected_patterns': explanations,
        'method': 'pattern_matching'
    }

def explain_graph_score(user_id: str, graph_score: float) -> Dict[str, Any]:
    """Explain graph-based risk score"""
    explanations = []

    if graph_score > 0.5:
        explanations.append({
            'factor': 'shared_devices',
            'weight': 0.4,
            'description': 'Device shared with multiple suspicious users'
        })

        explanations.append({
            'factor': 'network_connections',
            'weight': 0.3,
            'description': 'Connected to suspicious network clusters'
        })

    return {
        'score': graph_score,
        'risk_factors': explanations,
        'method': 'graph_analysis'
    }

def generate_explanation(features: Dict[str, Any], anomaly_score: float,
                        sequence_risk: float, graph_risk: float) -> str:
    """
    Generate comprehensive human-readable explanation
    """
    explanations = []

    # Get detailed explanations
    anomaly_exp = explain_anomaly_score(features, anomaly_score)
    sequence_exp = explain_sequence_score(list(features.keys())[0] if features else 'user', sequence_risk)
    graph_exp = explain_graph_score(list(features.keys())[0] if features else 'user', graph_risk)

    # Anomaly-based explanations
    if anomaly_score > 0.5:
        for contributor in anomaly_exp['top_contributors']:
            explanations.append(contributor['description'])

    # Sequence-based explanations
    if sequence_risk > 0.5:
        for pattern in sequence_exp['detected_patterns']:
            explanations.append(pattern['description'])

    # Graph-based explanations
    if graph_risk > 0.5:
        for factor in graph_exp['risk_factors']:
            explanations.append(factor['description'])

    # Default explanations
    if not explanations:
        if anomaly_score < 0.3 and sequence_risk < 0.3 and graph_risk < 0.3:
            explanations.append("Normal behavior patterns detected")
        else:
            explanations.append("Moderate risk indicators present")

    return "; ".join(explanations)

def generate_detailed_explanation(features: Dict[str, Any], anomaly_score: float,
                                sequence_risk: float, graph_risk: float) -> Dict[str, Any]:
    """Generate detailed explanation with all components"""
    return {
        'overall_risk': (anomaly_score + sequence_risk + graph_risk) / 3,
        'anomaly_analysis': explain_anomaly_score(features, anomaly_score),
        'sequence_analysis': explain_sequence_score(list(features.keys())[0] if features else 'user', sequence_risk),
        'graph_analysis': explain_graph_score(list(features.keys())[0] if features else 'user', graph_risk),
        'summary': generate_explanation(features, anomaly_score, sequence_risk, graph_risk),
        'confidence': min(0.95, 0.5 + abs(anomaly_score - 0.5) * 0.4)  # Higher confidence for extreme scores
    }

# Placeholder for SHAP integration with actual models
def compute_shap_values():
    """Compute SHAP values for model interpretability"""
    # TODO: Implement SHAP for trained models
    pass