import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime, timedelta
import requests

# Configuration
API_BASE_URL = "http://localhost:8000"

st.set_page_config(page_title="Traceveil Dashboard", page_icon="🛡️", layout="wide")

st.title("🛡️ Traceveil - Fraud & Cheating Detection Dashboard")

# Sidebar
st.sidebar.header("Navigation")
page = st.sidebar.radio("Go to", ["Overview", "Risk Analysis", "Model Performance", "Alerts"])

if page == "Overview":
    st.header("System Overview")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Total Events Today", "1,234", "+12%")

    with col2:
        st.metric("High Risk Users", "23", "-5%")

    with col3:
        st.metric("Average Response Time", "45ms", "-10ms")

    # Risk distribution
    st.subheader("Risk Score Distribution")
    risk_data = pd.DataFrame({
        'Risk Category': ['Safe', 'Monitor', 'Block'],
        'Count': [850, 234, 23]
    })
    fig = px.pie(risk_data, values='Count', names='Risk Category', color_discrete_sequence=['green', 'orange', 'red'])
    st.plotly_chart(fig)

elif page == "Risk Analysis":
    st.header("Risk Analysis")

    # User risk lookup
    user_id = st.text_input("Enter User ID to analyze:")
    if user_id:
        if st.button("Analyze User"):
            try:
                response = requests.get(f"{API_BASE_URL}/user/{user_id}/risk")
                if response.status_code == 200:
                    data = response.json()
                    st.success(f"Risk Score: {data['risk_score']:.3f}")
                    st.info(f"Explanation: {data['explanation']}")
                    st.metric("Recent Events", data['recent_events'])
                else:
                    st.error("User not found")
            except:
                st.error("API connection failed")

    # Risk heatmap (placeholder)
    st.subheader("Risk Heatmap")
    heatmap_data = pd.DataFrame(
        np.random.rand(10, 10),
        columns=[f'User_{i}' for i in range(10)],
        index=[f'Hour_{i}' for i in range(10)]
    )
    fig = px.imshow(heatmap_data, color_continuous_scale='RdYlGn_r')
    st.plotly_chart(fig)

elif page == "Model Performance":
    st.header("Model Performance")

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Precision@HighRisk")
        st.metric("Current", "92.3%", "+2.1%")

    with col2:
        st.subheader("False Positive Rate")
        st.metric("Current", "3.2%", "-0.5%")

    # Performance over time
    st.subheader("Performance Trends")
    perf_data = pd.DataFrame({
        'Date': pd.date_range(start='2024-01-01', periods=30),
        'Precision': np.random.uniform(85, 95, 30),
        'FPR': np.random.uniform(2, 5, 30)
    })
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=perf_data['Date'], y=perf_data['Precision'], name='Precision'))
    fig.add_trace(go.Scatter(x=perf_data['Date'], y=perf_data['FPR'], name='False Positive Rate'))
    st.plotly_chart(fig)

elif page == "Alerts":
    st.header("Active Alerts")

    alerts = [
        {"user": "user_123", "risk": 0.85, "reason": "Unusual IP change + abnormal answer speed", "time": "2 min ago"},
        {"user": "user_456", "risk": 0.78, "reason": "Shared device with flagged user", "time": "5 min ago"},
        {"user": "user_789", "risk": 0.92, "reason": "Rapid tab switching + device change", "time": "1 min ago"}
    ]

    for alert in alerts:
        with st.container():
            col1, col2, col3 = st.columns([2, 3, 1])
            with col1:
                st.write(f"**{alert['user']}**")
                st.write(f"Risk: {alert['risk']}")
            with col2:
                st.write(alert['reason'])
            with col3:
                st.write(alert['time'])
            st.divider()

st.sidebar.markdown("---")
st.sidebar.markdown("Built with ❤️ using Behavioral ML")