import sys
import os
import torch
import numpy as np

# Add project root to path
sys.path.append(os.getcwd())

from app.models.anomaly_detector import train_default_models
from app.models.sequence_model import train_default_sequence_model

def diagnose_fitting():
    print("="*60)
    print("DIAGNOSING MODEL FITTING (Underfitting vs Overfitting)")
    print("="*60)
    
    print("\n1. CHECKING ANOMALY DETECTOR (Deep Autoencoder)")
    print("-" * 50)
    # The training function already prints Train vs Val loss
    # We will capture it.
    try:
        train_default_models()
        print("\nAnalysis:")
        print(" > If Val Loss is much higher than Train Loss (> 0.02 gap) -> Overfitting")
        print(" > If both losses are high (> 0.2) -> Underfitting")
        print(" > If both are low (~0.05) and close -> Good Fit")
    except Exception as e:
        print(f"Error: {e}")

    print("\n2. CHECKING SEQUENCE MODEL (BiLSTM)")
    print("-" * 50)
    try:
        train_default_sequence_model()
        print("\nAnalysis:")
        print(" > If Val Acc is high (> 0.90) and stable -> Good Fit")
        print(" > If Val Loss increases while Train Loss decreases -> Overfitting")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diagnose_fitting()
