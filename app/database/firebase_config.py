import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_firestore_client():
    return db