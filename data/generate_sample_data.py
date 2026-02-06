#!/usr/bin/env python3
"""
Enhanced Sample Data Generation for Traceveil
Now uses industry-standard datasets and realistic patterns
"""

import requests
import json
import random
import numpy as np
from datetime import datetime, timedelta
import time
import pandas as pd
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.dataset_loader import dataset_loader

API_URL = "http://127.0.0.1:8000/events/submit"

# Enhanced event types based on industry datasets
EVENT_TYPES = [
    "mouse_move", "tab_switch", "camera_on", "camera_off",
    "answer_submit", "question_view", "window_focus", "window_blur",
    "transaction_attempt", "login_attempt", "device_change", "ip_change"
]

# Load industry datasets for realistic patterns
industry_data = None
try:
    datasets = dataset_loader.load_all_datasets()
    industry_data = datasets
    print("✅ Loaded industry datasets for realistic pattern generation")
except Exception as e:
    print(f"⚠️ Could not load industry datasets: {e}")
    print("Using enhanced synthetic patterns instead")

class RealisticDataGenerator:
    """Generate realistic data based on industry datasets"""

    def __init__(self):
        self.user_profiles = {}
        self.fraud_patterns = {}
        self.behavior_patterns = {}

        if industry_data:
            self._learn_patterns_from_industry_data()

    def _learn_patterns_from_industry_data(self):
        """Learn realistic patterns from industry datasets"""

        # Learn from credit card data
        if 'credit_card' in industry_data:
            cc_data = industry_data['credit_card']
            # Learn transaction amount distributions
            self.fraud_patterns['amount_dist'] = {
                'normal': cc_data[cc_data['Class'] == 0]['Amount'].values,
                'fraud': cc_data[cc_data['Class'] == 1]['Amount'].values
            }

        # Learn from exam behavior data
        if 'exam_behavior' in industry_data:
            exam_data = industry_data['exam_behavior']
            # Learn timing patterns
            self.behavior_patterns['timing'] = {
                'normal': exam_data[exam_data['is_cheater'] == False]['time_spent'].values,
                'cheater': exam_data[exam_data['is_cheater'] == True]['time_spent'].values
            }

        # Learn from IEEE-CIS data
        if 'ieee_cis' in industry_data:
            cis_data = industry_data['ieee_cis']
            # Learn transaction timing patterns
            if 'TransactionDT' in cis_data.columns:
                self.fraud_patterns['timing'] = cis_data['TransactionDT'].values

    def generate_user_profile(self, user_id: str) -> dict:
        """Generate a realistic user profile"""
        if user_id not in self.user_profiles:
            # Determine if user is suspicious (based on industry fraud rates)
            is_suspicious = np.random.random() < 0.05  # 5% suspicious users

            profile = {
                'is_suspicious': is_suspicious,
                'device_fingerprint': f"fp_{np.random.randint(10000, 99999)}",
                'ip_history': [f"192.168.{np.random.randint(1,255)}.{np.random.randint(1,255)}" for _ in range(np.random.randint(1, 5))],
                'behavior_baseline': {
                    'avg_mouse_speed': np.random.normal(800, 200),
                    'tab_switches_per_minute': np.random.normal(2, 1),
                    'session_duration': np.random.normal(1800, 600),  # 30 minutes
                    'question_time': np.random.normal(90, 30)  # 1.5 minutes per question
                },
                'last_activity': datetime.now(),
                'risk_score': 0.0
            }

            if is_suspicious:
                # Modify behavior for suspicious users
                profile['behavior_baseline']['tab_switches_per_minute'] *= 3
                profile['behavior_baseline']['question_time'] *= 0.3  # Much faster
                profile['ip_history'].extend([f"10.{np.random.randint(0,255)}.{np.random.randint(0,255)}.{np.random.randint(0,255)}" for _ in range(2)])

            self.user_profiles[user_id] = profile

        return self.user_profiles[user_id]

    def generate_realistic_event(self, user_id: str) -> dict:
        """Generate a realistic event based on user profile and industry patterns"""
        profile = self.generate_user_profile(user_id)
        timestamp = datetime.now()

        # Choose event type based on user behavior
        if profile['is_suspicious']:
            # Suspicious users have different behavior patterns
            weights = [0.1, 0.3, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1, 0.05, 0.02, 0.02, 0.01]
        else:
            weights = [0.2, 0.1, 0.05, 0.05, 0.15, 0.15, 0.1, 0.1, 0.02, 0.02, 0.02, 0.04]

        event_type = np.random.choice(EVENT_TYPES, p=weights)

        metadata = {}

        if event_type == "mouse_move":
            speed = np.random.normal(profile['behavior_baseline']['avg_mouse_speed'],
                                   profile['behavior_baseline']['avg_mouse_speed'] * 0.2)
            metadata = {
                "speed": max(100, int(speed)),
                "device_fingerprint": profile['device_fingerprint'],
                "ip": np.random.choice(profile['ip_history'])
            }

        elif event_type == "tab_switch":
            switches = np.random.poisson(profile['behavior_baseline']['tab_switches_per_minute'])
            metadata = {
                "from_tab": f"tab_{np.random.randint(1, 5)}",
                "to_tab": f"tab_{np.random.randint(1, 5)}",
                "switches_in_last_minute": switches,
                "device_fingerprint": profile['device_fingerprint']
            }

        elif event_type in ["camera_on", "camera_off"]:
            metadata = {
                "device_fingerprint": profile['device_fingerprint'],
                "duration": np.random.exponential(600)  # Exponential distribution
            }

        elif event_type == "answer_submit":
            # Use realistic timing from industry data
            if profile['is_suspicious'] and 'timing' in self.behavior_patterns:
                time_spent = np.random.choice(self.behavior_patterns['timing']['cheater'])
            elif 'timing' in self.behavior_patterns:
                time_spent = np.random.choice(self.behavior_patterns['timing']['normal'])
            else:
                time_spent = np.random.normal(profile['behavior_baseline']['question_time'],
                                            profile['behavior_baseline']['question_time'] * 0.3)

            metadata = {
                "question_id": f"q_{np.random.randint(1, 50)}",
                "time_spent": max(1, int(time_spent)),
                "decision_latency": np.random.exponential(5),
                "device_fingerprint": profile['device_fingerprint']
            }

        elif event_type == "question_view":
            time_spent = np.random.normal(profile['behavior_baseline']['question_time'],
                                        profile['behavior_baseline']['question_time'] * 0.5)
            metadata = {
                "question_id": f"q_{np.random.randint(1, 50)}",
                "time_spent": max(5, int(time_spent)),
                "scroll_events": np.random.poisson(10),
                "device_fingerprint": profile['device_fingerprint']
            }

        elif event_type in ["window_focus", "window_blur"]:
            metadata = {
                "device_fingerprint": profile['device_fingerprint'],
                "session_duration": int(profile['behavior_baseline']['session_duration']),
                "focus_changes": np.random.poisson(5)
            }

        elif event_type == "transaction_attempt":
            # Use realistic amounts from industry data
            if profile['is_suspicious'] and 'amount_dist' in self.fraud_patterns:
                amount = np.random.choice(self.fraud_patterns['amount_dist']['fraud'])
            elif 'amount_dist' in self.fraud_patterns:
                amount = np.random.choice(self.fraud_patterns['amount_dist']['normal'])
            else:
                amount = np.random.lognormal(3, 1)  # Default distribution

            metadata = {
                "amount": float(amount),
                "merchant_category": np.random.choice(['online', 'retail', 'service'], p=[0.5, 0.3, 0.2]),
                "device_fingerprint": profile['device_fingerprint'],
                "ip": np.random.choice(profile['ip_history'])
            }

        elif event_type == "login_attempt":
            metadata = {
                "device_fingerprint": profile['device_fingerprint'],
                "ip": np.random.choice(profile['ip_history']),
                "user_agent": f"Browser/{np.random.randint(80, 120)}.0",
                "login_method": np.random.choice(['password', 'oauth', 'sso'], p=[0.7, 0.2, 0.1])
            }

        elif event_type == "device_change":
            metadata = {
                "old_device": profile['device_fingerprint'],
                "new_device": f"fp_{np.random.randint(10000, 99999)}",
                "ip": np.random.choice(profile['ip_history']),
                "change_reason": np.random.choice(['upgrade', 'lost', 'stolen', 'shared'], p=[0.4, 0.3, 0.2, 0.1])
            }

        elif event_type == "ip_change":
            old_ip = np.random.choice(profile['ip_history'])
            new_ip = f"192.168.{np.random.randint(1,255)}.{np.random.randint(1,255)}"
            profile['ip_history'].append(new_ip)

            metadata = {
                "old_ip": old_ip,
                "new_ip": new_ip,
                "device_fingerprint": profile['device_fingerprint'],
                "location_change": np.random.choice([True, False], p=[0.3, 0.7])
            }

        return {
            "user_id": user_id,
            "event_type": event_type,
            "metadata": metadata,
            "timestamp": timestamp.isoformat()
        }

# Global generator instance
data_generator = RealisticDataGenerator()

def generate_random_event(user_id):
    """Backward compatibility - use the new realistic generator"""
    return data_generator.generate_realistic_event(user_id)

def send_event(event):
    try:
        response = requests.post(API_URL, json=event)
        if response.status_code == 200:
            data = response.json()
            risk_assessment = data.get('risk_assessment', {})
            print(f"Event sent for {event['user_id']} ({event['event_type']}): Risk = {risk_assessment.get('score', 0):.3f} [{risk_assessment.get('category', 'unknown')}]")
        else:
            print(f"Failed to send event: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending event: {e}")

def generate_bulk_events(n_events: int = 1000):
    """Generate bulk events for testing"""
    print(f"Generating {n_events} realistic events...")

    users = [f"user_{i}" for i in range(100)]  # 100 users

    for i in range(n_events):
        user_id = np.random.choice(users)
        event = generate_random_event(user_id)
        send_event(event)

        # Small delay to avoid overwhelming the API
        time.sleep(0.01)

        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1}/{n_events} events")

    print("✅ Bulk event generation completed")

def main():
    print("🎯 Traceveil Enhanced Data Generator")
    print("=" * 50)
    print("Now uses industry-standard datasets for realistic patterns!")
    print()

    if industry_data:
        print("📊 Industry datasets loaded:")
        for name, df in industry_data.items():
            print(f"  • {name}: {len(df):,} samples")
        print()

    print("Options:")
    print("1. Continuous generation (Ctrl+C to stop)")
    print("2. Bulk generation (specify number of events)")
    print("3. Simulate Critical Attack (Forces high-risk event)")
    print()

    try:
        choice = input("Choose mode (1-3) [1]: ").strip() or "1"

        if choice == "3":
            print("\n🚨 Simulating Critical Attack Scenario...")
            # Force a suspicious user
            attacker_id = f"attacker_{np.random.randint(1000, 9999)}"
            data_generator.user_profiles[attacker_id] = {
                'is_suspicious': True,
                'device_fingerprint': "kali-linux-tool",
                'ip_history': ["192.168.1.105", "10.0.0.5"],
                'behavior_baseline': {
                    'avg_mouse_speed': 2000,
                    'tab_switches_per_minute': 20,
                    'session_duration': 60,
                    'question_time': 5
                },
                'last_activity': datetime.now(),
                'risk_score': 0.95
            }
            
            # Generate a burst of high-risk events
            actions = ["fast_login", "ip_change", "transaction_attempt", "transaction_attempt"]
            
            for action_type in actions:
                if action_type == "fast_login":
                     event = {
                        "user_id": attacker_id,
                        "event_type": "login_attempt",
                        "metadata": {
                            "device_fingerprint": "kali-linux-tool", 
                            "ip": "10.0.0.5",
                            "login_method": "password",
                            "user_agent": "sqlmap/1.5.2"
                        },
                        "timestamp": datetime.now().isoformat()
                     }
                else:
                    event = data_generator.generate_realistic_event(attacker_id)
                
                send_event(event) # This will print the risk score
                time.sleep(0.5)
                
            print("✅ Attack simulation completed. Check dashboard High-Risk Entities.")

        elif choice == "2":
            n_events = int(input("Number of events to generate [1000]: ") or "1000")
            generate_bulk_events(n_events)
        else:
            print("Starting continuous realistic data generation...")
            print("Make sure Firebase is set up and the API is running!")
            print("Press Ctrl+C to stop")
            print()

            users = [f"user_{i}" for i in range(100)]

            while True:
                user_id = np.random.choice(users)
                event = generate_random_event(user_id)
                send_event(event)

                # Random delay between events (0.1 to 2 seconds)
                time.sleep(np.random.uniform(0.1, 2.0))

    except KeyboardInterrupt:
        print("\n🛑 Stopped data generation")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()