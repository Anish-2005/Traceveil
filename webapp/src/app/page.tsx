'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import {
  Shield,
  Activity,
  AlertTriangle,
  Users,
  BarChart3,
  Radar,
  TrendingUp,
  Zap,
  Lock,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Sparkles,
  Brain,
  Network,
} from "lucide-react";

// TypeScript Interfaces
interface DashboardMetrics {
  threat_detection_rate: number;
  active_monitoring: {
    count: number;
    trend: string;
    trend_up: boolean;
  };
  critical_threats: {
    count: number;
    trend: string;
    trend_up: boolean;
  };
  avg_response_time: {
    value: string;
    trend: string;
    trend_up: boolean;
  };
  recent_threat_events: ThreatEvent[];
  system_health: {
    api_gateway: { status: string; uptime: string };
    ml_engine: { status: string; latency: string };
    data_pipeline: { status: string; throughput: string };
    redis_cache: { status: string; latency: string };
    graph_db: { status: string; latency: string };
    overall_uptime: string;
  };
  high_risk_entities: HighRiskEntity[];
  quick_actions: {
    flagged_entities: number;
    access_restrictions: number;
  };
}

interface ThreatEvent {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time_ago: string;
  entity_id: string;
}

interface HighRiskEntity {
  id: string;
  type: string;
  risk_score: number;
  flags: string[];
  status: 'blocked' | 'monitoring' | 'review';
}

interface ModelInfo {
  name: string;
  version: string;
  accuracy: number;
  status: 'deployed' | 'training';
}

interface DashboardModels {
  active_models: ModelInfo[];
}

// Mock API (replace with actual API calls)
const traceveilApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      threat_detection_rate: 0.968,
      active_monitoring: {
        count: 2847,
        trend: "+8.2%",
        trend_up: true
      },
      critical_threats: {
        count: 17,
        trend: "-23.1%",
        trend_up: false
      },
      avg_response_time: {
        value: "0.3s",
        trend: "-41ms",
        trend_up: false
      },
      recent_threat_events: [
        {
          severity: 'critical',
          title: "Mass account enumeration detected",
          description: "15,000 requests from distributed IPs • Pattern: credential stuffing",
          time_ago: "38 seconds ago",
          entity_id: "Network: 142.251.x.x/16"
        },
        {
          severity: 'high',
          title: "Anomalous transaction velocity",
          description: "User exceeded baseline by 847% • Amount: $127,450",
          time_ago: "4 minutes ago",
          entity_id: "User #AX-47291"
        },
        {
          severity: 'medium',
          title: "New device fingerprint",
          description: "Login from unrecognized device • Location mismatch detected",
          time_ago: "12 minutes ago",
          entity_id: "User #KP-98163"
        },
        {
          severity: 'low',
          title: "Model confidence threshold crossed",
          description: "Risk score increased from 0.12 to 0.68 in 3 minutes",
          time_ago: "27 minutes ago",
          entity_id: "Detector: Behavioral-v2.4"
        }
      ],
      system_health: {
        api_gateway: { status: "operational", uptime: "99.97%" },
        ml_engine: { status: "operational", latency: "4.2ms" },
        data_pipeline: { status: "operational", throughput: "2.1M/min" },
        redis_cache: { status: "operational", latency: "0.8ms" },
        graph_db: { status: "operational", latency: "127ms" },
        overall_uptime: "99.94%"
      },
      high_risk_entities: [
        {
          id: "AX-47291",
          type: "User",
          risk_score: 94,
          flags: ["Velocity", "Geo-anomaly"],
          status: "blocked"
        },
        {
          id: "KP-98163",
          type: "User",
          risk_score: 87,
          flags: ["New device", "Pattern shift"],
          status: "monitoring"
        },
        {
          id: "142.251.x.x",
          type: "IP Range",
          risk_score: 91,
          flags: ["DDoS", "Enumeration"],
          status: "blocked"
        },
        {
          id: "TX-55892",
          type: "Transaction",
          risk_score: 78,
          flags: ["High value", "Off-hours"],
          status: "review"
        }
      ],
      quick_actions: {
        flagged_entities: 23,
        access_restrictions: 8
      }
    };
  },

  getDashboardModels: async (): Promise<DashboardModels> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      active_models: [
        {
          name: "Behavioral Analysis",
          version: "v2.4.1",
          accuracy: 0.968,
          status: "deployed"
        },
        {
          name: "Transaction Velocity",
          version: "v1.9.3",
          accuracy: 0.942,
          status: "deployed"
        },
        {
          name: "Device Fingerprinting",
          version: "v3.1.0",
          accuracy: 0.981,
          status: "training"
        }
      ]
    };
  }
};

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [models, setModels] = useState<DashboardModels | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [metricsData, modelsData] = await Promise.all([
        traceveilApi.getDashboardMetrics(),
        traceveilApi.getDashboardModels(),
      ]);

      setMetrics(metricsData);
      setModels(modelsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E13] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E13] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">Failed to load dashboard data</p>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E13] text-gray-100 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
      </div>

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0A0E13]/80 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-8 h-20">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition" />
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-white/10">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Traceveil
                </h1>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Fraud Intelligence
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Overview", active: true },
                { label: "Threat Feed", active: false },
                { label: "Analytics", active: false },
                { label: "Entities", active: false },
                { label: "Models", active: false },
              ].map((item) => (
                <Link
                  key={item.label}
                  href="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition group">
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <AlertTriangle className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
              </button>
              <button className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-medium text-sm transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                Deploy Model
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-[1920px] mx-auto px-8 py-8 space-y-8 relative z-10">
        {/* ================= HERO METRICS GRID ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Primary KPI */}
          <div className="lg:col-span-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.4%
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium mb-2">Threat Detection Rate</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {metrics ? `${(metrics.threat_detection_rate * 100).toFixed(1)}%` : "96.8%"}
                </h3>
                <span className="text-sm text-gray-500">accuracy</span>
              </div>
              <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000" 
                  style={{ width: metrics ? `${metrics.threat_detection_rate * 100}%` : '96.8%' }} 
                />
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard
              icon={<Activity />}
              label="Active Monitoring"
              value={metrics?.active_monitoring.count.toLocaleString() || "2,847"}
              subtext="real-time streams"
              trend={metrics?.active_monitoring.trend || "+8.2%"}
              trendUp={metrics?.active_monitoring.trend_up !== false}
              color="emerald"
            />
            <MetricCard
              icon={<AlertTriangle />}
              label="Critical Threats"
              value={metrics?.critical_threats.count.toString() || "17"}
              subtext="require action"
              trend={metrics?.critical_threats.trend || "-23.1%"}
              trendUp={metrics?.critical_threats.trend_up === true}
              color="red"
              pulse={metrics ? metrics.critical_threats.count > 0 : true}
            />
            <MetricCard
              icon={<Zap />}
              label="Avg Response Time"
              value={metrics?.avg_response_time.value || "0.3s"}
              subtext="detection latency"
              trend={metrics?.avg_response_time.trend || "-41ms"}
              trendUp={metrics?.avg_response_time.trend_up === true}
              color="amber"
            />
          </div>
        </section>

        {/* ================= COMMAND CENTER ================= */}
        <section className="grid lg:grid-cols-12 gap-6">
          {/* Live Threat Intelligence */}
          <div className="lg:col-span-8 space-y-6">
            {/* Threat Map Visualization */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Threat Intelligence Map</h3>
                    <p className="text-sm text-gray-400">Real-time anomaly detection & classification</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-green-400">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Radar Visualization */}
                <div className="relative h-80 rounded-xl bg-gradient-to-br from-blue-950/30 to-purple-950/30 border border-white/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Network className="w-32 h-32 text-blue-500/20" />
                  </div>
                  
                  {/* Animated Radar Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-48 h-48 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-64 h-64 rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
                    <div className="absolute w-80 h-80 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                  </div>

                  {/* Threat Indicators */}
                  <ThreatIndicator position="top-12 left-20" severity="high" label="SQL Injection" />
                  <ThreatIndicator position="top-32 right-16" severity="medium" label="Rate Limit" />
                  <ThreatIndicator position="bottom-24 left-32" severity="critical" label="Account Takeover" />
                  <ThreatIndicator position="bottom-16 right-24" severity="low" label="Suspicious Login" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-400">Critical</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-gray-400">High</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span className="text-gray-400">Medium</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-400">Low</span>
                      </div>
                    </div>
                    <span className="text-gray-500">Last updated: 2s ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Threat Activity</h3>
                  <button className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                    View All
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {metrics?.recent_threat_events.slice(0, 4).map((event, index) => (
                    <ThreatActivity
                      key={index}
                      severity={event.severity}
                      title={event.title}
                      description={event.description}
                      time={event.time_ago}
                      userId={event.entity_id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* System Health */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <h3 className="text-lg font-bold text-white mb-6">System Status</h3>
                
                <div className="space-y-4">
                  <SystemStatus 
                    label="API Gateway" 
                    status={metrics?.system_health.api_gateway.status || "operational"} 
                    value={metrics?.system_health.api_gateway.uptime || "99.97%"} 
                  />
                  <SystemStatus 
                    label="ML Inference Engine" 
                    status={metrics?.system_health.ml_engine.status || "operational"} 
                    value={metrics?.system_health.ml_engine.latency || "4.2ms"} 
                  />
                  <SystemStatus 
                    label="Data Pipeline" 
                    status={metrics?.system_health.data_pipeline.status || "operational"} 
                    value={metrics?.system_health.data_pipeline.throughput || "2.1M/min"} 
                  />
                  <SystemStatus 
                    label="Redis Cache" 
                    status={metrics?.system_health.redis_cache.status || "operational"} 
                    value={metrics?.system_health.redis_cache.latency || "0.8ms"} 
                  />
                  <SystemStatus 
                    label="Graph Database" 
                    status={metrics?.system_health.graph_db.status || "operational"} 
                    value={metrics?.system_health.graph_db.latency || "127ms"} 
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Uptime (30d)</span>
                    <span className="font-semibold text-green-400">{metrics?.system_health.overall_uptime || "99.94%"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Performance */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <h3 className="text-lg font-bold text-white mb-6">Active Models</h3>
                
                <div className="space-y-4">
                  {models?.active_models.map((model, index) => (
                    <ModelCard
                      key={index}
                      name={model.name}
                      version={model.version}
                      accuracy={`${(model.accuracy * 100).toFixed(1)}%`}
                      status={model.status}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                
                <div className="space-y-2">
                  <QuickAction icon={<Eye />} label="Review Flagged Entities" count={metrics?.quick_actions.flagged_entities || 23} />
                  <QuickAction icon={<Lock />} label="Apply Access Restrictions" count={metrics?.quick_actions.access_restrictions || 8} />
                  <QuickAction icon={<BarChart3 />} label="Generate Risk Report" />
                  <QuickAction icon={<Sparkles />} label="Retrain Models" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ENTITY MONITORING ================= */}
        <section className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">High-Risk Entities</h3>
                <p className="text-sm text-gray-400">Entities requiring immediate attention</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition">
                View All Entities
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics?.high_risk_entities.slice(0, 4).map((entity, index) => (
                <EntityCard
                  key={index}
                  id={entity.id}
                  type={entity.type}
                  riskScore={entity.risk_score}
                  flags={entity.flags}
                  status={entity.status}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= ADVANCED COMPONENTS ================= */

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: string;
  trendUp: boolean;
  color: 'emerald' | 'red' | 'amber';
  pulse?: boolean;
}

function MetricCard({ icon, label, value, subtext, trend, trendUp, color, pulse }: MetricCardProps) {
  const colorMap = {
    emerald: {
      bg: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    },
    red: {
      bg: "from-red-500/20 to-rose-500/20",
      border: "border-red-500/30",
      text: "text-red-400",
    },
    amber: {
      bg: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/30",
      text: "text-amber-400",
    },
  };

  const colorConfig = colorMap[color];

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorConfig.bg} border ${colorConfig.border}`}>
            <div className={colorConfig.text}>{icon}</div>
          </div>
          {pulse && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </div>
        <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{subtext}</p>
          <span className={`text-xs font-semibold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ThreatIndicatorProps {
  position: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  label: string;
}

function ThreatIndicator({ position, severity, label }: ThreatIndicatorProps) {
  const severityColors = {
    critical: "bg-red-500 border-red-400 shadow-red-500/50",
    high: "bg-amber-500 border-amber-400 shadow-amber-500/50",
    medium: "bg-yellow-500 border-yellow-400 shadow-yellow-500/50",
    low: "bg-blue-500 border-blue-400 shadow-blue-500/50",
  };

  return (
    <div className={`absolute ${position} group/indicator cursor-pointer`}>
      <div className={`w-3 h-3 ${severityColors[severity]} border rounded-full animate-pulse shadow-lg`} />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 backdrop-blur-sm border border-white/10 rounded text-xs whitespace-nowrap opacity-0 group-hover/indicator:opacity-100 transition pointer-events-none">
        {label}
      </div>
    </div>
  );
}

interface ThreatActivityProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  userId: string;
}

function ThreatActivity({ severity, title, description, time, userId }: ThreatActivityProps) {
  const severityConfig = {
    critical: { color: "red", icon: <XCircle className="w-4 h-4" /> },
    high: { color: "amber", icon: <AlertTriangle className="w-4 h-4" /> },
    medium: { color: "yellow", icon: <MinusCircle className="w-4 h-4" /> },
    low: { color: "blue", icon: <Activity className="w-4 h-4" /> },
  };

  const config = severityConfig[severity];

  return (
    <div className="group/activity p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm group-hover/activity:text-blue-400 transition">{title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{description}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{userId}</span>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium opacity-0 group-hover/activity:opacity-100 transition">
              Investigate →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SystemStatusProps {
  label: string;
  status: string;
  value: string;
}

function SystemStatus({ label, status, value }: SystemStatusProps) {
  const statusConfig: Record<string, { color: string; text: string }> = {
    operational: { color: "green", text: "Operational" },
    degraded: { color: "amber", text: "Degraded" },
    offline: { color: "red", text: "Offline" },
  };

  const config = statusConfig[status] || statusConfig.operational;

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-none group/status">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 bg-${config.color}-500 rounded-full ${status === 'operational' ? 'animate-pulse' : ''}`} />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">{value}</div>
      </div>
    </div>
  );
}

interface ModelCardProps {
  name: string;
  version: string;
  accuracy: string;
  status: 'deployed' | 'training';
}

function ModelCard({ name, version, accuracy, status }: ModelCardProps) {
  const statusConfig = {
    deployed: { color: "green", text: "Deployed", icon: <CheckCircle2 className="w-3 h-3" /> },
    training: { color: "blue", text: "Training", icon: <Activity className="w-3 h-3" /> },
  };

  const config = statusConfig[status];

  return (
    <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer group/model">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm mb-0.5">{name}</h4>
          <p className="text-xs text-gray-500">{version}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400`}>
          {config.icon}
          <span className="text-xs font-medium">{config.text}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Accuracy</span>
        <span className="text-sm font-bold text-white">{accuracy}</span>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function QuickAction({ icon, label, count }: QuickActionProps) {
  return (
    <button className="w-full p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 transition-all group/action text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-gray-400 group-hover/action:text-blue-400 transition">
            {icon}
          </div>
          <span className="text-sm text-gray-300 group-hover/action:text-white transition">{label}</span>
        </div>
        {count !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}

interface EntityCardProps {
  id: string;
  type: string;
  riskScore: number;
  flags: string[];
  status: 'blocked' | 'monitoring' | 'review';
}

function EntityCard({ id, type, riskScore, flags, status }: EntityCardProps) {
  const statusConfig = {
    blocked: { color: "red", text: "Blocked" },
    monitoring: { color: "amber", text: "Monitoring" },
    review: { color: "blue", text: "Review" },
  };

  const config = statusConfig[status];

  return (
    <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer group/entity">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{type}</p>
          <h4 className="font-semibold text-white text-sm">{id}</h4>
        </div>
        <div className={`px-2 py-0.5 rounded-full bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400 text-xs font-medium`}>
          {config.text}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Risk Score</span>
          <span className={`text-sm font-bold ${riskScore >= 90 ? 'text-red-400' : riskScore >= 75 ? 'text-amber-400' : 'text-yellow-400'}`}>
            {riskScore}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${riskScore >= 90 ? 'bg-red-500' : riskScore >= 75 ? 'bg-amber-500' : 'bg-yellow-500'}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {flags.map((flag: string) => (
          <span key={flag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-gray-400">
            {flag}
          </span>
        ))}
      </div>
    </div>
  );
}