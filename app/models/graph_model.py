import networkx as nx
from node2vec import Node2Vec
import numpy as np
import joblib
import os
from typing import Dict, List, Tuple
from app.database.models import get_user_events
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

MODEL_DIR = "app/models"
GRAPH_MODEL_PATH = os.path.join(MODEL_DIR, "graph_classifier.pkl")
GRAPH_SCALER_PATH = os.path.join(MODEL_DIR, "graph_scaler.pkl")
NODE_EMBEDDINGS_PATH = os.path.join(MODEL_DIR, "node_embeddings.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

def build_user_graph(all_events: List, max_nodes: int = 1000) -> nx.Graph:
    """Build a graph of user-device-IP relationships"""
    G = nx.Graph()

    # Limit events for performance
    events = all_events[:max_nodes] if len(all_events) > max_nodes else all_events

    nodes_added = set()

    for event in events:
        # Handle both Event objects and dictionaries
        if isinstance(event, dict):
            user = event.get('user_id')
            metadata = event.get('metadata', {})
            device = metadata.get('device_id', 'unknown')
            ip = metadata.get('ip', 'unknown')
        else:
            user = event.user_id
            metadata = event.event_metadata
            device = metadata.get('device_id', 'unknown')
            ip = metadata.get('ip', 'unknown')

        # Add nodes
        for node in [user, device, ip]:
            if node not in nodes_added:
                node_type = 'user' if node.startswith('user_') else ('device' if node.startswith('dev_') else 'ip')
                G.add_node(node, type=node_type)
                nodes_added.add(node)

        # Add edges with weights
        G.add_edge(user, device, weight=1.0, type='user_device')
        G.add_edge(user, ip, weight=1.0, type='user_ip')

        # Add device-IP connections (suspicious if same device used from different IPs)
        if G.has_edge(device, ip):
            G[device][ip]['weight'] += 0.5
        else:
            G.add_edge(device, ip, weight=0.5, type='device_ip')

    return G

# ... (omitted)

def compute_graph_risk(user_id: str) -> Tuple[float, Dict[str, float]]:
    """Compute graph-based risk score and features for a user"""
    # Get all events for graph construction (in production, this would be cached)
    # For demo, we'll use the user's events and simulate some global context
    user_events = get_user_events(user_id, limit=100)

    if len(user_events) < 3:
        return 0.0, {}

    # Build graph from user's events
    G = build_user_graph(user_events)

    # Compute graph features
    features = compute_graph_features(G, user_id)
    feature_values = np.array(list(features.values())).reshape(1, -1)

    # Load model and predict
    classifier, scaler = load_graph_model()

    try:
        feature_scaled = scaler.transform(feature_values)
        risk_score = classifier.predict_proba(feature_scaled)[0][1]  # Probability of suspicious
    except:
        # Fallback to rule-based scoring
        risk_score = min(1.0, (
            features['shared_devices'] * 0.2 +
            features['shared_ips'] * 0.15 +
            features['degree_centrality'] * 0.3 +
            features['is_bridge'] * 0.2
        ))

    # Additional heuristics
    if features['shared_devices'] > 5 or features['shared_ips'] > 7:
        risk_score = min(1.0, risk_score + 0.3)  # Boost for highly connected suspicious users

    return min(1.0, max(0.0, risk_score)), features

def compute_graph_features(G: nx.Graph, user_id: str) -> Dict[str, float]:
    """Compute graph-based features for a user"""
    if user_id not in G:
        return {
            'degree_centrality': 0,
            'betweenness_centrality': 0,
            'clustering_coefficient': 0,
            'shared_devices': 0,
            'shared_ips': 0,
            'community_size': 1,
            'is_bridge': 0
        }

    # Basic centrality measures
    degree_cent = nx.degree_centrality(G)[user_id]
    betweenness_cent = nx.betweenness_centrality(G, k=min(100, len(G)))[user_id]  # Approximate for large graphs
    clustering = nx.clustering(G)[user_id]

    # Neighbors analysis
    neighbors = list(G.neighbors(user_id))
    devices = [n for n in neighbors if G.nodes[n]['type'] == 'device']
    ips = [n for n in neighbors if G.nodes[n]['type'] == 'ip']

    # Count shared connections
    shared_devices = sum(1 for d in devices if G.degree(d) > 2)  # Device used by multiple users
    shared_ips = sum(1 for ip in ips if G.degree(ip) > 3)       # IP used by multiple users

    # Community detection
    if len(G) > 1:
        communities = list(nx.community.greedy_modularity_communities(G))
        user_community = next((comm for comm in communities if user_id in comm), set())
        community_size = len(user_community)
    else:
        community_size = 1

    # Bridge detection (user connecting different communities)
    is_bridge = 1 if len(neighbors) > 0 and community_size > 1 else 0

    return {
        'degree_centrality': degree_cent,
        'betweenness_centrality': betweenness_cent,
        'clustering_coefficient': clustering,
        'shared_devices': shared_devices,
        'shared_ips': shared_ips,
        'community_size': community_size,
        'is_bridge': is_bridge
    }

def generate_node_embeddings(G: nx.Graph) -> Dict[str, np.ndarray]:
    """Generate Node2Vec embeddings for graph nodes"""
    if len(G) < 2:
        # Return zero embeddings for small graphs
        return {node: np.zeros(128) for node in G.nodes()}

    # Node2Vec parameters
    node2vec = Node2Vec(G, dimensions=128, walk_length=30, num_walks=200, workers=4, quiet=True)
    model = node2vec.fit(window=10, min_count=1, batch_words=4)

    embeddings = {}
    for node in G.nodes():
        if node in model.wv:
            embeddings[node] = model.wv[node]
        else:
            embeddings[node] = np.zeros(128)

    return embeddings

def load_graph_model():
    """Load trained graph classification model"""
    if os.path.exists(GRAPH_MODEL_PATH) and os.path.exists(GRAPH_SCALER_PATH):
        try:
            classifier = joblib.load(GRAPH_MODEL_PATH)
            scaler = joblib.load(GRAPH_SCALER_PATH)
            return classifier, scaler
        except Exception as e:
            print(f"Error loading graph model: {e}")

    # Train default model
    print("Training default graph classification model...")
    classifier, scaler = train_default_graph_model()
    return classifier, scaler

def train_default_graph_model():
    """Train a classifier on realistic network graph features"""
    from app.models.data_generator import DataGenerator
    
    print("Generating network graph data...")
    generator = DataGenerator()
    events = generator.generate_network_dataset(n_users=200, n_attackers=50)
    
    # Build full graph
    G = build_user_graph(events, max_nodes=5000)
    
    # Extract features for all users in the graph
    print(f"Graph built: {len(G.nodes)} nodes, {len(G.edges)} edges")
    
    X = []
    y = []
    
    # Users are nodes starting with 'user_' (normal) or 'bot_'/'attacker_' (suspicious)
    for node in G.nodes():
        if node.startswith('user_'):
            # Normal
            features = compute_graph_features(G, node)
            X.append(list(features.values()))
            y.append(0)
        elif node.startswith('bot_') or node.startswith('attacker_'):
            # Suspicious
            features = compute_graph_features(G, node)
            X.append(list(features.values()))
            y.append(1)
            
    X = np.array(X)
    y = np.array(y)
    
    print(f"Training Graph Model on {len(X)} users ({sum(y==0)} normal, {sum(y==1)} suspicious)")

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train classifier
    classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    classifier.fit(X_scaled, y)

    # Save models
    joblib.dump(classifier, GRAPH_MODEL_PATH)
    joblib.dump(scaler, GRAPH_SCALER_PATH)

    return classifier, scaler



# Placeholder for Node2Vec embeddings
def train_graph_embeddings():
    # TODO: Implement Node2Vec training
    pass

def train_graph_model(X_train, X_test, y_train, y_test, adjacency=None):
    """Train graph-based classifier for fraud detection"""
    # For now, use a simple Random Forest on graph features
    # In a real implementation, this would use Node2Vec + GNN
    
    # Generate synthetic graph features if adjacency not provided
    if adjacency is None:
        # Create synthetic features based on connectivity patterns
        n_samples = len(X_train)
        graph_features = np.random.rand(n_samples, 10)  # 10 graph-based features
        X_train_with_graph = np.hstack([X_train, graph_features])
        
        n_test_samples = len(X_test)
        test_graph_features = np.random.rand(n_test_samples, 10)
        X_test_with_graph = np.hstack([X_test, test_graph_features])
    else:
        # Use actual graph features
        X_train_with_graph = X_train
        X_test_with_graph = X_test
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_with_graph)
    X_test_scaled = scaler.transform(X_test_with_graph)
    
    # Train classifier
    classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    classifier.fit(X_train_scaled, y_train)
    
    # Save models
    joblib.dump(classifier, GRAPH_MODEL_PATH)
    joblib.dump(scaler, GRAPH_SCALER_PATH)
    
    return classifier