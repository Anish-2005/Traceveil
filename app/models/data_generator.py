import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import random

class DataGenerator:
    """
    Generates realistic synthetic data for training ML models.
    Simulates user sessions, normal behavior patterns, and various attack scenarios.
    """
    
    def __init__(self, seed: int = 42):
        np.random.seed(seed)
        random.seed(seed)
        
    def generate_normal_session(self, user_id: str, duration_minutes: int = 60) -> List[Dict]:
        """Generate a sequence of events representing a normal user session"""
        events = []
        base_time = datetime.now() - timedelta(days=random.randint(0, 30))
        
        # Normal behavior parameters
        avg_actions_per_min = np.random.normal(5, 2)  # ~5 actions/min
        avg_mouse_speed = np.random.normal(500, 100)
        avg_reaction_time = np.random.normal(0.5, 0.1)
        
        current_time = base_time
        
        # Login event
        events.append({
            'user_id': user_id,
            'timestamp': current_time,
            'event_type': 'login',
            'metadata': {
                'device_id': f"dev_{user_id}_1",
                'ip': f"192.168.1.{random.randint(2, 254)}",
                'location': 'US',
                'reaction_time': avg_reaction_time
            }
        })
        
        # Session loop
        num_actions = int(duration_minutes * avg_actions_per_min)
        for _ in range(num_actions):
            # Time gap between actions (exponential distribution for realistic inter-arrival times)
            time_gap = np.random.exponential(60 / avg_actions_per_min)
            current_time += timedelta(seconds=time_gap)
            
            event_type = random.choices(
                ['view_page', 'click', 'input', 'scroll'],
                weights=[0.4, 0.3, 0.1, 0.2]
            )[0]
            
            events.append({
                'user_id': user_id,
                'timestamp': current_time,
                'event_type': event_type,
                'metadata': {
                    'mouse_speed': max(0, np.random.normal(avg_mouse_speed, 50)),
                    'reaction_time': max(0.1, np.random.normal(avg_reaction_time, 0.05)),
                    'session_id': f"sess_{user_id}_{base_time.strftime('%Y%m%d')}"
                }
            })
            
        # Logout event
        current_time += timedelta(seconds=np.random.randint(5, 60))
        events.append({
            'user_id': user_id,
            'timestamp': current_time,
            'event_type': 'logout',
            'metadata': {'reason': 'user_initiated'}
        })
        
        return events

    def generate_attack_session(self, user_id: str, attack_type: str = 'brute_force') -> List[Dict]:
        """Generate a sequence of events representing an attack"""
        events = []
        base_time = datetime.now()
        current_time = base_time
        
        if attack_type == 'brute_force':
            # Rapid login attempts
            for i in range(random.randint(10, 50)):
                current_time += timedelta(milliseconds=random.randint(50, 200)) # Very fast
                events.append({
                    'user_id': user_id,
                    'timestamp': current_time,
                    'event_type': 'login_failed',
                    'metadata': {
                        'ip': f"10.0.0.{random.randint(1, 255)}",
                        'user_agent': 'python-requests/2.25.1'
                    }
                })
                
        elif attack_type == 'account_takeover':
            # Impossible travel & weird behavior
            # First login normal
            events.append({
                'user_id': user_id,
                'timestamp': current_time - timedelta(hours=2),
                'event_type': 'login',
                'metadata': {'location': 'US', 'ip': '1.2.3.4'}
            })
            
            # Second login from different country instantly
            events.append({
                'user_id': user_id,
                'timestamp': current_time,
                'event_type': 'login',
                'metadata': {'location': 'CN', 'ip': '203.0.113.1'}
            })
            
            # Anomalous actions
            for _ in range(20):
                current_time += timedelta(seconds=random.randint(1, 3))
                events.append({
                    'user_id': user_id,
                    'timestamp': current_time,
                    'event_type': 'download_export', # Sensitive action
                    'metadata': {
                        'mouse_speed': 2000, # Bot-like speed
                        'reaction_time': 0.01
                    }
                })

        elif attack_type == 'crawling':
            # High frequency page views
            for _ in range(100):
                current_time += timedelta(milliseconds=300)
                events.append({
                    'user_id': user_id,
                    'timestamp': current_time,
                    'event_type': 'view_page',
                    'metadata': {
                        'mouse_speed': 0, # No mouse movement
                        'reaction_time': 0
                    }
                })
                
        return events

    def generate_dataset(self, n_normal: int = 200, n_attack: int = 50) -> Tuple[np.ndarray, np.ndarray, List]:
        """
        Generate a full labeled dataset for training.
        Returns: (X_features, y_labels, raw_sequences)
        """
        all_sequences = []
        labels = []
        
        print(f"Generating {n_normal} normal sessions...")
        for i in range(n_normal):
            user_id = f"user_norm_{i}"
            seq = self.generate_normal_session(user_id)
            all_sequences.append(seq)
            labels.append(0) # 0 = Normal
            
        print(f"Generating {n_attack} attack sessions...")
        attack_types = ['brute_force', 'account_takeover', 'crawling']
        for i in range(n_attack):
            user_id = f"user_attack_{i}"
            attack_type = random.choice(attack_types)
            seq = self.generate_attack_session(user_id, attack_type)
            all_sequences.append(seq)
            labels.append(1) # 1 = Attack
            
        # Extract features (using existing feature extraction logic)
        # We need to import the feature extractor from the app, 
        # or reimplement a simple one here for the generator's purpose
        # For tight integration, let's assume we pass these sequences 
        # to the training pipeline which handles extraction.
        
        return all_sequences, np.array(labels), all_sequences

    def extract_features_from_sequence(self, events: List[Dict]) -> List[float]:
        """Helper to extract features matching feature_engineering.py structure"""
        # Simplified version of what's in feature_engineering.py for internal use/testing
        if not events:
            return [0]*11
            
        df = pd.DataFrame([{
            'timestamp': e['timestamp'],
            'event_type': e['event_type'],
            'metadata': e.get('metadata', {})
        } for e in events])
        
        # Calculate features
        duration_hours = (df['timestamp'].max() - df['timestamp'].min()).total_seconds() / 3600
        duration_hours = max(duration_hours, 0.01) # Avoid div/0
        
        action_frequency = len(df) / duration_hours
        
        mouse_speeds = [m.get('mouse_speed', 0) for m in df['metadata']]
        avg_mouse_speed = np.mean(mouse_speeds) if mouse_speeds else 0
        
        is_bot = 1 if avg_mouse_speed == 0 or avg_mouse_speed > 1500 else 0
        
        return [
            action_frequency,  # 1. Action Freq
            0, # Burstiness (placeholder)
            0, # Reaction entropy
            0, # Session variance
            avg_mouse_speed, # 5. Mouse Speed
            0, # Working hours
            0, # Decision latency
            0, # Device stability
            0, # Baseline dev
            0, # Cohort dev
            is_bot # 11. Pattern shift/Bot flag
        ]

    def generate_network_dataset(self, n_users: int = 100, n_attackers: int = 20) -> List[Dict]:
        """
        Generate a dataset with network relationships (IP/Device sharing).
        Returns a flat list of events from all users to build a graph.
        """
        events = []
        
        # 1. Normal Users: Mostly unique IPs and Devices
        # Occasional sharing (e.g. 2 users on same IP - corporate/home)
        shared_ips = [f"192.168.1.{i}" for i in range(5)] # Small pool of shared IPs
        
        for i in range(n_users):
            user_id = f"user_{i}"
            # 80% chance of unique IP, 20% chance of shared
            if random.random() < 0.2:
                ip = random.choice(shared_ips)
            else:
                ip = f"10.0.{i}.1"
                
            device_id = f"dev_{i}" # Unique device mostly
            
            # Generate a few events for this user context
            session = self.generate_normal_session(user_id)
            for e in session:
                e['metadata']['ip'] = ip
                e['metadata']['device_id'] = device_id
                events.append(e)
                
        # 2. Attackers (Botnet): Many users -> Same IP
        # "Botnet A": 10 attackers sharing 1 IP
        botnet_ip = "185.100.1.66"
        for i in range(10):
            attacker_id = f"bot_{i}"
            session = self.generate_attack_session(attacker_id, 'brute_force')
            for e in session:
                e['metadata']['ip'] = botnet_ip
                e['metadata']['device_id'] = f"dev_bot_{i}" # Unique devices
                events.append(e)
                
        # 3. Attackers (Sybil): One user -> Many devices
        # "Sybil B": 1 attacker using 10 devices
        sybil_user = "attacker_sybil"
        for i in range(10):
            session = self.generate_attack_session(sybil_user, 'crawling')
            for e in session:
                e['metadata']['ip'] = "200.1.1.1" # Static IP
                e['metadata']['device_id'] = f"dev_sybil_{i}" # Rotating devices
                events.append(e)
                
        random.shuffle(events)
        return events
