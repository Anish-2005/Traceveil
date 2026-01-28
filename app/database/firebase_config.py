import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")

try:
    if not firebase_admin._apps:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("Firebase initialized successfully")
        else:
            print(f"Warning: Firebase credentials not found at {cred_path}")
            print("Using mock Firebase client for development")
            # For development without Firebase, we'll use a mock
            firebase_admin.initialize_app()
except Exception as e:
    print(f"Firebase initialization failed: {e}")
    print("Using mock Firebase client for development")

def get_firestore_client():
    try:
        return firestore.client()
    except Exception as e:
        print(f"Failed to get Firestore client: {e}")
        print("Returning None - operations will fail gracefully")
        return None