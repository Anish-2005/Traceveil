import requests
import json
import random
from datetime import datetime, timedelta
import time

API_URL = "http://localhost:8000/ingest"

# Sample event types for EdTech cheating detection
EVENT_TYPES = [
    "mouse_move", "tab_switch", "camera_on", "camera_off",
    "answer_submit", "question_view", "window_focus", "window_blur"
]

# Sample users
USERS = [f"user_{i}" for i in range(100)]

def generate_random_event(user_id):
    event_type = random.choice(EVENT_TYPES)
    timestamp = datetime.now()

    metadata = {}

    if event_type == "mouse_move":
        metadata = {
            "speed": random.randint(500, 2000),
            "device_id": f"dev_{random.randint(1, 10)}",
            "ip": f"192.168.1.{random.randint(1, 255)}"
        }
    elif event_type == "tab_switch":
        metadata = {
            "from_tab": f"tab_{random.randint(1, 5)}",
            "to_tab": f"tab_{random.randint(1, 5)}",
            "device_id": f"dev_{random.randint(1, 10)}"
        }
    elif event_type in ["camera_on", "camera_off"]:
        metadata = {
            "device_id": f"dev_{random.randint(1, 10)}",
            "duration": random.randint(0, 3600)
        }
    elif event_type == "answer_submit":
        metadata = {
            "question_id": f"q_{random.randint(1, 50)}",
            "reaction_time": random.randint(5, 120),
            "decision_latency": random.randint(1, 30)
        }
    elif event_type == "question_view":
        metadata = {
            "question_id": f"q_{random.randint(1, 50)}",
            "time_spent": random.randint(10, 300)
        }
    elif event_type in ["window_focus", "window_blur"]:
        metadata = {
            "device_id": f"dev_{random.randint(1, 10)}",
            "session_duration": random.randint(60, 3600)
        }

    return {
        "user_id": user_id,
        "event_type": event_type,
        "metadata": metadata,
        "timestamp": timestamp.isoformat()
    }

def send_event(event):
    try:
        response = requests.post(API_URL, json=event)
        if response.status_code == 200:
            data = response.json()
            print(f"Event sent for {event['user_id']}: Risk Score = {data['risk_score']:.3f}")
        else:
            print(f"Failed to send event: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending event: {e}")

def main():
    print("Starting sample data generation...")
    print("Make sure Firebase is set up and the API is running!")
    print("Press Ctrl+C to stop")

    try:
        while True:
            user_id = random.choice(USERS)
            event = generate_random_event(user_id)
            send_event(event)

            # Random delay between events (0.1 to 2 seconds)
            time.sleep(random.uniform(0.1, 2.0))

    except KeyboardInterrupt:
        print("\nStopped data generation")

if __name__ == "__main__":
    main()