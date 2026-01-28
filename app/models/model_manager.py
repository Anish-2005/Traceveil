import os
import json
import pickle
from datetime import datetime
from typing import Dict, Any, List
import torch
from app.models.anomaly_detector import Autoencoder
from app.models.sequence_model import LSTMSequenceModel
# from app.models.graph_model import GraphFraudDetector  # Not implemented yet

MODEL_DIR = "app/models/saved_models"
os.makedirs(MODEL_DIR, exist_ok=True)

class ModelManager:
    def __init__(self):
        self.current_models = {}
        self.model_versions = {}
        self.load_model_registry()

    def save_model(self, model_name: str, model: Any, metadata: Dict[str, Any] = None):
        """Save a trained model with metadata"""
        version = self.get_next_version(model_name)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        model_path = os.path.join(MODEL_DIR, f"{model_name}_v{version}_{timestamp}")

        # Save model
        if hasattr(model, 'state_dict'):  # PyTorch model
            torch.save({
                'model_state_dict': model.state_dict(),
                'metadata': metadata or {},
                'version': version,
                'timestamp': timestamp
            }, f"{model_path}.pth")
        else:  # Scikit-learn model
            with open(f"{model_path}.pkl", 'wb') as f:
                pickle.dump({
                    'model': model,
                    'metadata': metadata or {},
                    'version': version,
                    'timestamp': timestamp
                }, f)

        # Update registry
        self.model_versions[model_name] = version
        self.current_models[model_name] = model_path
        self.save_model_registry()

        print(f"Saved {model_name} version {version} at {model_path}")
        return version

    def load_model(self, model_name: str, version: str = None):
        """Load a specific model version"""
        if version is None:
            version = self.model_versions.get(model_name, '1')

        # Find model file
        model_files = [f for f in os.listdir(MODEL_DIR) if f.startswith(f"{model_name}_v{version}")]

        if not model_files:
            print(f"No saved model found for {model_name} version {version}")
            return None

        model_file = sorted(model_files)[-1]  # Get latest timestamp
        model_path = os.path.join(MODEL_DIR, model_file)

        try:
            if model_file.endswith('.pth'):  # PyTorch model
                checkpoint = torch.load(model_path, map_location=torch.device('cpu'))

                # Reconstruct model based on name
                if model_name == 'autoencoder':
                    model = AutoencoderDetector(input_dim=50)  # Adjust dimensions as needed
                elif model_name == 'lstm':
                    model = LSTMSequenceModel(input_size=50, hidden_size=64, num_layers=2)
                elif model_name == 'graph':
                    model = GraphFraudDetector(embedding_dim=64)
                else:
                    return None

                model.load_state_dict(checkpoint['model_state_dict'])
                model.eval()

                return model

            elif model_file.endswith('.pkl'):  # Scikit-learn model
                with open(model_path, 'rb') as f:
                    data = pickle.load(f)
                    return data['model']

        except Exception as e:
            print(f"Error loading model {model_name} v{version}: {e}")
            return None

    def get_next_version(self, model_name: str) -> str:
        """Get next version number for a model"""
        current_version = self.model_versions.get(model_name, '0')
        try:
            version_num = int(current_version)
            return str(version_num + 1)
        except:
            return '1'

    def list_model_versions(self, model_name: str) -> List[str]:
        """List all available versions of a model"""
        versions = []
        for file in os.listdir(MODEL_DIR):
            if file.startswith(f"{model_name}_v"):
                # Extract version from filename
                parts = file.split('_v')[1].split('_')[0]
                if parts not in versions:
                    versions.append(parts)

        return sorted(versions, key=int)

    def get_model_metadata(self, model_name: str, version: str = None) -> Dict[str, Any]:
        """Get metadata for a specific model version"""
        if version is None:
            version = self.model_versions.get(model_name)

        model_files = [f for f in os.listdir(MODEL_DIR) if f.startswith(f"{model_name}_v{version}")]

        if not model_files:
            return {}

        model_file = sorted(model_files)[-1]
        model_path = os.path.join(MODEL_DIR, model_file)

        try:
            if model_file.endswith('.pth'):
                checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
                return checkpoint.get('metadata', {})
            elif model_file.endswith('.pkl'):
                with open(model_path, 'rb') as f:
                    data = pickle.load(f)
                    return data.get('metadata', {})
        except:
            return {}

    def save_model_registry(self):
        """Save model registry to file"""
        registry = {
            'current_models': self.current_models,
            'model_versions': self.model_versions,
            'last_updated': datetime.now().isoformat()
        }

        registry_path = os.path.join(MODEL_DIR, "model_registry.json")
        with open(registry_path, 'w') as f:
            json.dump(registry, f, indent=2)

    def load_model_registry(self):
        """Load model registry from file"""
        registry_path = os.path.join(MODEL_DIR, "model_registry.json")

        try:
            with open(registry_path, 'r') as f:
                registry = json.load(f)
                self.current_models = registry.get('current_models', {})
                self.model_versions = registry.get('model_versions', {})
        except:
            self.current_models = {}
            self.model_versions = {}

    def cleanup_old_versions(self, model_name: str, keep_versions: int = 3):
        """Clean up old model versions, keeping only the most recent ones"""
        versions = self.list_model_versions(model_name)

        if len(versions) <= keep_versions:
            return

        # Keep only the most recent versions
        versions_to_keep = versions[-keep_versions:]
        versions_to_delete = versions[:-keep_versions]

        for version in versions_to_delete:
            model_files = [f for f in os.listdir(MODEL_DIR) if f.startswith(f"{model_name}_v{version}")]
            for file in model_files:
                try:
                    os.remove(os.path.join(MODEL_DIR, file))
                    print(f"Deleted old model file: {file}")
                except Exception as e:
                    print(f"Error deleting {file}: {e}")

    def get_model_performance_history(self, model_name: str) -> List[Dict[str, Any]]:
        """Get performance history for a model across versions"""
        versions = self.list_model_versions(model_name)
        history = []

        for version in versions:
            metadata = self.get_model_metadata(model_name, version)
            if metadata:
                history.append({
                    'version': version,
                    'metrics': metadata.get('metrics', {}),
                    'training_date': metadata.get('training_date'),
                    'dataset_size': metadata.get('dataset_size')
                })

        return history

# Global model manager instance
model_manager = ModelManager()