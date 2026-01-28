import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
from typing import Dict, List, Any
from app.database.models import get_user_events
from app.features.feature_engineering import compute_features

MODEL_DIR = "app/models"
EVALUATION_DIR = "app/evaluation"

os.makedirs(EVALUATION_DIR, exist_ok=True)

class ModelEvaluator:
    def __init__(self):
        self.metrics_history = []

    def evaluate_models(self, test_users: List[str], true_labels: Dict[str, int]) -> Dict[str, Any]:
        """Evaluate all models on test data"""
        predictions = {}

        for user_id in test_users:
            features = compute_features(user_id)

            # Get model predictions
            from app.models.anomaly_detector import detect_anomaly
            from app.models.sequence_model import predict_sequence_risk
            from app.models.graph_model import compute_graph_risk
            from app.risk_engine.scoring import calculate_risk_score

            anomaly_score = detect_anomaly(features)
            sequence_risk = predict_sequence_risk(user_id)
            graph_risk = compute_graph_risk(user_id)
            final_risk = calculate_risk_score(anomaly_score, sequence_risk, graph_risk)

            predictions[user_id] = {
                'final_risk': final_risk,
                'anomaly_score': anomaly_score,
                'sequence_risk': sequence_risk,
                'graph_risk': graph_risk
            }

        # Calculate metrics
        y_true = [true_labels[user] for user in test_users]
        y_pred = [1 if predictions[user]['final_risk'] > 0.5 else 0 for user in test_users]
        y_scores = [predictions[user]['final_risk'] for user in test_users]

        metrics = {
            'precision': precision_score(y_true, y_pred, zero_division=0),
            'recall': recall_score(y_true, y_pred, zero_division=0),
            'f1_score': f1_score(y_true, y_pred, zero_division=0),
            'auc': roc_auc_score(y_true, y_scores) if len(set(y_true)) > 1 else 0,
            'timestamp': datetime.now(),
            'n_samples': len(test_users)
        }

        self.metrics_history.append(metrics)

        # Save evaluation results
        self.save_evaluation(metrics, predictions)

        return metrics

    def save_evaluation(self, metrics: Dict[str, Any], predictions: Dict[str, Any]):
        """Save evaluation results"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Save metrics
        metrics_file = os.path.join(EVALUATION_DIR, f"metrics_{timestamp}.json")
        with open(metrics_file, 'w') as f:
            import json
            json.dump(metrics, f, default=str, indent=2)

        # Save predictions
        pred_file = os.path.join(EVALUATION_DIR, f"predictions_{timestamp}.csv")
        pred_df = pd.DataFrame.from_dict(predictions, orient='index')
        pred_df.to_csv(pred_file)

    def get_performance_summary(self) -> Dict[str, Any]:
        """Get summary of model performance over time"""
        if not self.metrics_history:
            return {'message': 'No evaluations performed yet'}

        recent_metrics = self.metrics_history[-10:]  # Last 10 evaluations

        return {
            'latest_metrics': self.metrics_history[-1] if self.metrics_history else None,
            'avg_precision': np.mean([m['precision'] for m in recent_metrics]),
            'avg_recall': np.mean([m['recall'] for m in recent_metrics]),
            'avg_f1': np.mean([m['f1_score'] for m in recent_metrics]),
            'avg_auc': np.mean([m['auc'] for m in recent_metrics]),
            'trend': 'improving' if len(recent_metrics) > 1 and recent_metrics[-1]['f1_score'] > recent_metrics[0]['f1_score'] else 'stable'
        }

class ModelTrainer:
    def __init__(self):
        self.evaluator = ModelEvaluator()

    def retrain_models(self, training_data: Dict[str, Any] = None):
        """Retrain all models with new data"""
        print("Retraining anomaly detection model...")
        from app.models.anomaly_detector import train_default_models
        train_default_models()

        print("Retraining sequence model...")
        from app.models.sequence_model import train_default_sequence_model
        train_default_sequence_model()

        print("Retraining graph model...")
        from app.models.graph_model import train_default_graph_model
        train_default_graph_model()

        print("Model retraining completed")

    def validate_models(self) -> Dict[str, Any]:
        """Validate models on synthetic test data"""
        # Generate synthetic test users and labels
        np.random.seed(42)
        test_users = [f"test_user_{i}" for i in range(100)]

        # Simulate labels (0=normal, 1=suspicious)
        true_labels = {}
        for user in test_users:
            # Random labels with some correlation to user ID for consistency
            user_num = int(user.split('_')[-1])
            true_labels[user] = 1 if user_num % 10 == 0 else 0  # 10% suspicious users

        return self.evaluator.evaluate_models(test_users, true_labels)

def detect_model_drift(self, current_metrics: Dict[str, Any], threshold: float = 0.1) -> bool:
    """Detect if model performance has drifted"""
    if len(self.metrics_history) < 2:
        return False

    previous_metrics = self.metrics_history[-2]
    current_f1 = current_metrics.get('f1_score', 0)
    previous_f1 = previous_metrics.get('f1_score', 0)

    drift = abs(current_f1 - previous_f1) / previous_f1 if previous_f1 > 0 else 0

    return drift > threshold

# Global instances
evaluator = ModelEvaluator()
trainer = ModelTrainer()