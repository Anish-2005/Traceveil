import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

# Firebase configuration for client-side (web) SDK
FIREBASE_CLIENT_CONFIG = {
    "apiKey": "AIzaSyBHErElHJCQ6Mfqwt2tYjaOtis4jtVICKE",
    "authDomain": "traceveil-core.firebaseapp.com",
    "projectId": "traceveil-core",
    "storageBucket": "traceveil-core.firebasestorage.app",
    "messagingSenderId": "835304134617",
    "appId": "1:835304134617:web:3443bef7eb340665d8ebc8",
    "measurementId": "G-ZZFPVSCH3J"
}

def get_firebase_credentials_from_env():
    """Get Firebase credentials from environment variables"""
    required_env_vars = [
        'FIREBASE_TYPE',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_CLIENT_ID',
        'FIREBASE_AUTH_URI',
        'FIREBASE_TOKEN_URI',
        'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
        'FIREBASE_CLIENT_X509_CERT_URL'
    ]

    # Check if all required environment variables are set
    env_data = {}
    for var in required_env_vars:
        value = os.getenv(var)
        if not value:
            return None
        # Remove FIREBASE_ prefix for the key
        key = var.replace('FIREBASE_', '').lower()
        env_data[key] = value

    return env_data

def create_credentials_from_env():
    """Create Firebase credentials from environment variables"""
    env_data = get_firebase_credentials_from_env()
    if not env_data:
        return None

    # Validate that it's not placeholder data
    if (env_data.get('private_key_id') == 'your-private-key-id' or
        'YOUR_PRIVATE_KEY_HERE' in env_data.get('private_key', '') or
        env_data.get('client_id') == 'your-client-id'):
        return None

    return credentials.Certificate(env_data)

# Check if we should skip Firebase entirely (for development)
USE_MOCK_FIREBASE = os.getenv("USE_MOCK_FIREBASE", "true").lower() == "true"

if USE_MOCK_FIREBASE:
    print("Using mock Firebase client for development")
    print("Set USE_MOCK_FIREBASE=false to enable real Firebase")
    firebase_admin.initialize_app()
else:
    try:
        if not firebase_admin._apps:
            # Try environment variables first
            cred = create_credentials_from_env()
            if cred:
                firebase_admin.initialize_app(cred)
                print("Firebase initialized successfully from environment variables")
            else:
                # Fallback to file-based credentials
                cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
                if os.path.exists(cred_path):
                    with open(cred_path, 'r') as f:
                        file_data = json.load(f)

                    # Validate file credentials
                    if (file_data.get('private_key_id') != 'your-private-key-id' and
                        'YOUR_PRIVATE_KEY_HERE' not in file_data.get('private_key', '') and
                        file_data.get('client_id') != 'your-client-id' and
                        len(file_data.get('private_key', '')) > 100):
                        cred = credentials.Certificate(cred_path)
                        firebase_admin.initialize_app(cred)
                        print("✅ Firebase initialized successfully from credentials file")
                    else:
                        print("Firebase credentials file contains invalid/placeholder data")
                        print("Using mock Firebase client for development")
                        firebase_admin.initialize_app()
                else:
                    print("No Firebase credentials found (file or environment variables)")
                    print("Using mock Firebase client for development")
                    print("To enable Firebase:")
                    print("   Option 1: Set environment variables (see .env.example)")
                    print("   Option 2: Place service account JSON at firebase-credentials.json")
                    print("   Then set USE_MOCK_FIREBASE=false")
                    firebase_admin.initialize_app()
    except Exception as e:
        print(f"Firebase initialization failed: {e}")
        print("Using mock Firebase client for development")
        try:
            if not firebase_admin._apps:
                firebase_admin.initialize_app()
        except:
            pass

def get_firestore_client():
    try:
        return firestore.client()
    except Exception as e:
        print(f"Failed to get Firestore client: {e}")
        print("Returning None - operations will fail gracefully")
        return None