import networkx as nx
from sqlalchemy.orm import Session
from app.database.models import Event

def compute_graph_risk(user_id: str, db: Session) -> float:
    # Build user-device-IP graph
    G = nx.Graph()

    # Get all events for graph analysis
    events = db.query(Event).limit(1000).all()  # Limit for performance

    for event in events:
        user = event.user_id
        device = event.metadata.get('device_id', 'unknown')
        ip = event.metadata.get('ip', 'unknown')

        # Add nodes
        G.add_node(f"user_{user}", type='user')
        G.add_node(f"device_{device}", type='device')
        G.add_node(f"ip_{ip}", type='ip')

        # Add edges
        G.add_edge(f"user_{user}", f"device_{device}")
        G.add_edge(f"user_{user}", f"ip_{ip}")

    # Find communities (simplified)
    if len(G.nodes) > 1:
        communities = list(nx.community.greedy_modularity_communities(G))
    else:
        communities = []

    # Check if user is in suspicious communities
    user_node = f"user_{user_id}"
    if user_node not in G:
        return 0.0

    # Simple heuristic: if user shares devices/IPs with many others, higher risk
    neighbors = list(G.neighbors(user_node))
    shared_connections = len([n for n in neighbors if G.degree(n) > 2])  # devices/IPs used by multiple users

    risk_score = min(1.0, shared_connections / 10.0)  # Normalize

    return risk_score

# Placeholder for Node2Vec embeddings
def train_graph_embeddings():
    # TODO: Implement Node2Vec training
    pass