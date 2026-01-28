from datetime import datetime, timedelta
import json
import os
from typing import Dict, List, Any
from app.database.models import save_event, Event
from app.models.model_training import trainer, evaluator

FEEDBACK_DIR = "app/feedback"
os.makedirs(FEEDBACK_DIR, exist_ok=True)

class FeedbackLoop:
    def __init__(self):
        self.feedback_data = []
        self.load_feedback_history()

    def collect_feedback(self, event_id: str, actual_label: int, user_feedback: str = None):
        """Collect feedback on model predictions"""
        feedback = {
            'event_id': event_id,
            'actual_label': actual_label,  # 0=normal, 1=suspicious
            'user_feedback': user_feedback,
            'timestamp': datetime.now(),
            'model_version': self.get_current_model_version()
        }

        self.feedback_data.append(feedback)
        self.save_feedback(feedback)

        # Trigger retraining if enough feedback collected
        if len(self.feedback_data) % 50 == 0:  # Retrain every 50 feedback samples
            self.trigger_retraining()

    def save_feedback(self, feedback: Dict[str, Any]):
        """Save feedback to file"""
        feedback_file = os.path.join(FEEDBACK_DIR, f"feedback_{datetime.now().strftime('%Y%m%d')}.jsonl")

        with open(feedback_file, 'a') as f:
            f.write(json.dumps(feedback, default=str) + '\n')

    def load_feedback_history(self):
        """Load historical feedback data"""
        try:
            feedback_file = os.path.join(FEEDBACK_DIR, f"feedback_{datetime.now().strftime('%Y%m%d')}.jsonl")
            if os.path.exists(feedback_file):
                with open(feedback_file, 'r') as f:
                    for line in f:
                        self.feedback_data.append(json.loads(line))
        except Exception as e:
            print(f"Error loading feedback history: {e}")

    def trigger_retraining(self):
        """Trigger model retraining based on feedback"""
        print("Triggering model retraining based on feedback...")

        # Analyze feedback to identify areas for improvement
        recent_feedback = self.feedback_data[-100:]  # Last 100 feedback samples

        false_positives = sum(1 for f in recent_feedback if f['actual_label'] == 0)
        false_negatives = sum(1 for f in recent_feedback if f['actual_label'] == 1)

        print(f"False positives: {false_positives}, False negatives: {false_negatives}")

        # Retrain models
        trainer.retrain_models()

        # Evaluate after retraining
        metrics = trainer.validate_models()
        print(f"Post-retraining metrics: F1={metrics['f1_score']:.3f}, AUC={metrics['auc']:.3f}")

    def get_feedback_stats(self) -> Dict[str, Any]:
        """Get statistics about collected feedback"""
        if not self.feedback_data:
            return {'total_feedback': 0}

        recent_feedback = [f for f in self.feedback_data
                          if f['timestamp'] > datetime.now() - timedelta(days=7)]

        return {
            'total_feedback': len(self.feedback_data),
            'recent_feedback': len(recent_feedback),
            'false_positive_rate': sum(1 for f in recent_feedback if f['actual_label'] == 0) / len(recent_feedback) if recent_feedback else 0,
            'false_negative_rate': sum(1 for f in recent_feedback if f['actual_label'] == 1) / len(recent_feedback) if recent_feedback else 0,
            'avg_confidence': sum(f.get('confidence', 0) for f in recent_feedback) / len(recent_feedback) if recent_feedback else 0
        }

    def get_current_model_version(self) -> str:
        """Get current model version"""
        # Simple versioning based on retraining count
        version_file = os.path.join(FEEDBACK_DIR, "model_version.txt")

        try:
            with open(version_file, 'r') as f:
                version = int(f.read().strip())
        except:
            version = 1

        return f"v{version}"

    def update_model_version(self):
        """Update model version after retraining"""
        version_file = os.path.join(FEEDBACK_DIR, "model_version.txt")

        try:
            with open(version_file, 'r') as f:
                version = int(f.read().strip()) + 1
        except:
            version = 2

        with open(version_file, 'w') as f:
            f.write(str(version))

class AdaptiveThresholds:
    def __init__(self):
        self.threshold_history = []
        self.load_threshold_history()

    def adjust_thresholds(self, current_metrics: Dict[str, Any]):
        """Dynamically adjust risk thresholds based on performance"""
        # Simple threshold adjustment based on false positive rate
        fpr = 1 - current_metrics.get('precision', 0.5)  # Approximation

        # Adjust safe threshold
        if fpr > 0.1:  # High false positive rate
            safe_threshold = 0.5  # Raise threshold to reduce false positives
        elif fpr < 0.05:  # Low false positive rate
            safe_threshold = 0.3  # Lower threshold for more sensitivity
        else:
            safe_threshold = 0.4  # Default

        # Adjust monitor threshold
        monitor_threshold = safe_threshold + 0.3

        new_thresholds = {
            'safe_threshold': safe_threshold,
            'monitor_threshold': monitor_threshold,
            'timestamp': datetime.now(),
            'based_on_fpr': fpr
        }

        self.threshold_history.append(new_thresholds)
        self.save_thresholds(new_thresholds)

        return new_thresholds

    def get_current_thresholds(self) -> Dict[str, float]:
        """Get current risk thresholds"""
        if not self.threshold_history:
            return {'safe_threshold': 0.4, 'monitor_threshold': 0.7}

        return {
            'safe_threshold': self.threshold_history[-1]['safe_threshold'],
            'monitor_threshold': self.threshold_history[-1]['monitor_threshold']
        }

    def save_thresholds(self, thresholds: Dict[str, Any]):
        """Save threshold configuration"""
        threshold_file = os.path.join(FEEDBACK_DIR, "thresholds.json")

        with open(threshold_file, 'w') as f:
            json.dump(self.threshold_history, f, default=str, indent=2)

    def load_threshold_history(self):
        """Load threshold history"""
        threshold_file = os.path.join(FEEDBACK_DIR, "thresholds.json")

        try:
            with open(threshold_file, 'r') as f:
                self.threshold_history = json.load(f)
        except:
            self.threshold_history = []

# Global instances
feedback_loop = FeedbackLoop()
adaptive_thresholds = AdaptiveThresholds()