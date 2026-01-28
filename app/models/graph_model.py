import networkx as nx
from app.database.models import get_user_events

def compute_graph_risk(user_id: str) -> float:
    # Get all events for graph analysis (limit for performance)
    # In a real implementation, you'd get events from all users, but for demo we'll use user's events
    events = get_user_events(user_id, limit=100)

    if len(events) < 3:
        return 0.0

    # Build user-device-IP graph
    G = nx.Graph()

    for event in events:
        user = event.user_id
        device = event.event_metadata.get('device_id', 'unknown')
        ip = event.event_metadata.get('ip', 'unknown')

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