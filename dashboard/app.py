import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime, timedelta
import requests
import numpy as np

# Configuration
API_BASE_URL = "http://localhost:8000"

st.set_page_config(page_title="Traceveil Dashboard", page_icon="🛡️", layout="wide")

st.title("🛡️ Traceveil - Fraud & Cheating Detection Dashboard")

# Sidebar
st.sidebar.header("Navigation")
page = st.sidebar.radio("Go to", ["Overview", "Risk Analysis", "Model Performance", "Feedback & Learning", "System Health"])

if page == "Overview":
    st.header("System Overview")

    # Fetch real data from API
    try:
        feedback_response = requests.get(f"{API_BASE_URL}/feedback/stats")
        feedback_data = feedback_response.json() if feedback_response.status_code == 200 else {}

        model_response = requests.get(f"{API_BASE_URL}/models/status")
        model_data = model_response.json() if model_response.status_code == 200 else {}
    except:
        feedback_data = {}
        model_data = {}

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        total_feedback = feedback_data.get('total_feedback', 0)
        st.metric("Total Feedback", f"{total_feedback}", f"+{feedback_data.get('recent_feedback', 0)} today")

    with col2:
        high_risk = "23"  # Placeholder - would come from API
        st.metric("High Risk Users", high_risk, "-5%")

    with col3:
        avg_response = "45ms"  # Placeholder
        st.metric("Average Response Time", avg_response, "-10ms")

    with col4:
        model_versions = len(model_data.get('model_versions', {}))
        st.metric("Active Models", model_versions)

    # Risk distribution with adaptive thresholds
    st.subheader("Risk Score Distribution")
    risk_data = pd.DataFrame({
        'Risk Category': ['Safe', 'Monitor', 'Block'],
        'Count': [850, 234, 23]
    })
    fig = px.pie(risk_data, values='Count', names='Risk Category', color_discrete_sequence=['green', 'orange', 'red'])
    st.plotly_chart(fig)

    # Model versions
    if model_data:
        st.subheader("Model Versions")
        versions_df = pd.DataFrame(list(model_data.get('model_versions', {}).items()),
                                  columns=['Model', 'Version'])
        st.dataframe(versions_df)

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
                    risk_assessment = data.get('risk_assessment', {})

                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Risk Score", f"{risk_assessment.get('score', 0):.3f}")
                    with col2:
                        st.write(f"**Category:** {risk_assessment.get('category', 'Unknown')}")
                    with col3:
                        st.write(f"**Confidence:** {risk_assessment.get('confidence', 0):.2f}")

                    st.info(f"**Recommendation:** {risk_assessment.get('recommendation', 'N/A')}")
                    st.write(f"**Explanation:** {data.get('explanation', 'N/A')}")
                    st.metric("Recent Events", data.get('recent_events', 0))

                    # Thresholds info
                    thresholds = risk_assessment.get('thresholds', {})
                    st.write("**Current Thresholds:**")
                    st.write(f"- Safe: < {thresholds.get('safe_threshold', 0.4):.2f}")
                    st.write(f"- Monitor: {thresholds.get('safe_threshold', 0.4):.2f} - {thresholds.get('monitor_threshold', 0.7):.2f}")
                    st.write(f"- Block: > {thresholds.get('monitor_threshold', 0.7):.2f}")
                else:
                    st.error("User not found")
            except Exception as e:
                st.error(f"API connection failed: {str(e)}")

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

    # Performance metrics
    try:
        # This would ideally come from the model training API
        from app.models.model_training import evaluator
        perf_summary = evaluator.get_performance_summary()
    except:
        perf_summary = {'message': 'No performance data available'}

    if 'message' not in perf_summary:
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric("Precision", f"{perf_summary.get('avg_precision', 0):.3f}")

        with col2:
            st.metric("Recall", f"{perf_summary.get('avg_recall', 0):.3f}")

        with col3:
            st.metric("F1 Score", f"{perf_summary.get('avg_f1', 0):.3f}")

        with col4:
            st.metric("AUC", f"{perf_summary.get('avg_auc', 0):.3f}")

        st.info(f"Performance Trend: {perf_summary.get('trend', 'unknown').title()}")
    else:
        st.info(perf_summary['message'])

    # Performance over time (placeholder)
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

elif page == "Feedback & Learning":
    st.header("Feedback & Learning System")

    # Feedback statistics
    try:
        feedback_response = requests.get(f"{API_BASE_URL}/feedback/stats")
        if feedback_response.status_code == 200:
            feedback_stats = feedback_response.json()

            col1, col2, col3, col4 = st.columns(4)

            with col1:
                st.metric("Total Feedback", feedback_stats.get('total_feedback', 0))

            with col2:
                st.metric("Recent Feedback", feedback_stats.get('recent_feedback', 0))

            with col3:
                fpr = feedback_stats.get('false_positive_rate', 0)
                st.metric("False Positive Rate", f"{fpr:.2%}")

            with col4:
                fnr = feedback_stats.get('false_negative_rate', 0)
                st.metric("False Negative Rate", f"{fnr:.2%}")

            # Feedback submission
            st.subheader("Submit Feedback")
            with st.form("feedback_form"):
                event_id = st.text_input("Event ID")
                actual_label = st.selectbox("Actual Label", [0, 1], format_func=lambda x: "Normal" if x == 0 else "Suspicious")
                user_feedback = st.text_area("Additional Feedback (optional)")

                submitted = st.form_submit_button("Submit Feedback")
                if submitted and event_id:
                    try:
                        feedback_data = {
                            "event_id": event_id,
                            "actual_label": actual_label,
                            "user_feedback": user_feedback
                        }
                        response = requests.post(f"{API_BASE_URL}/feedback", json=feedback_data)
                        if response.status_code == 200:
                            st.success("Feedback submitted successfully!")
                        else:
                            st.error("Failed to submit feedback")
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
        else:
            st.error("Could not fetch feedback statistics")
    except Exception as e:
        st.error(f"API connection failed: {str(e)}")

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
st.sidebar.markdown("**Features:** Adaptive Thresholds | Feedback Loop | Model Versioning")