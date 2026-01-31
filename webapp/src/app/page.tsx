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

import { traceveilApi, DashboardMetrics, DashboardModels } from '@/lib/api';
import {
  MetricCard,
  ThreatIndicator,
  ThreatActivity,
  SystemStatus,
  ModelCard,
  QuickAction,
  EntityCard,
  DashboardSkeleton,
  ErrorBoundary,
} from '@/components';
import { ThreatEvent, HighRiskEntity } from '@/types/dashboard';

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [models, setModels] = useState<DashboardModels | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
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
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative p-6 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-red-400/20 shadow-2xl">
              <AlertTriangle className="h-16 w-16 text-red-300 mx-auto drop-shadow-lg" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-red-300 mb-6 leading-relaxed">Unable to load dashboard data from the server.</p>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">{error}</p>

          <button
            onClick={loadDashboardData}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 font-semibold text-white transition-all duration-200 shadow-xl shadow-red-500/30 hover:shadow-red-400/40 hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-3">
              <Activity className="w-5 h-5" />
              Retry Connection
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
        {/* Enhanced Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }} />
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }} />
          <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-emerald-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s', animationDuration: '9s' }} />
        </div>

        {/* Subtle Grid Pattern */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <DashboardHeader />
        <DashboardMain
          metrics={metrics}
          models={models}
          lastUpdated={lastUpdated}
        />
      </div>
    </ErrorBoundary>
  );
}

interface DashboardHeaderProps {}

function DashboardHeader({}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200/10 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <img
            src="/traceveil-logo.svg"
            alt="Traceveil"
            className="w-10 h-10 transition-transform duration-200 hover:scale-105 focus:scale-105 outline-none"
            tabIndex={0}
          />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-400 to-slate-200 bg-clip-text text-transparent select-none">
            Traceveil
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {["Overview", "Threat Feed", "Analytics", "Entities", "Models"].map((label, i) => (
            <button
              key={label}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 dark:focus-visible:ring-offset-slate-950/80 ${
                i === 0
                  ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-500/5 dark:hover:bg-blue-500/10'
              }`}
              aria-current={i === 0 ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/30 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
            aria-label="View alerts"
          >
            <span className="sr-only">View alerts</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-slate-950" />
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-md hover:from-blue-500 hover:to-cyan-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            aria-label="Deploy model"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Deploy Model
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

interface DashboardMainProps {
  metrics: DashboardMetrics | null;
  models: DashboardModels | null;
  lastUpdated: Date;
}

function DashboardMain({ metrics, models, lastUpdated }: DashboardMainProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 relative z-10">
      {/* HERO METRICS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Primary KPI */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="relative bg-gradient-to-br from-white/90 to-blue-50 dark:from-slate-900/80 dark:to-slate-800/80 border border-slate-200/40 dark:border-white/10 rounded-2xl p-7 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Brain className="w-7 h-7 text-blue-500 dark:text-blue-300" />
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-500">LIVE</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase">Threat Detection Rate</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {metrics ? `${(metrics.threat_detection_rate * 100).toFixed(1)}%` : "96.8%"}
                </span>
                <span className="text-base text-slate-400 font-medium">accuracy</span>
              </div>
            </div>
            <div className="h-2 bg-slate-200/60 dark:bg-slate-700/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: metrics ? `${metrics.threat_detection_rate * 100}%` : '96.8%' }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs mt-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-500 font-semibold">+12.4% from last hour</span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricCard
            icon={<Activity />}
            label="Active Monitoring"
            value={metrics?.active_monitoring?.toLocaleString() || "2,847"}
            subtext="real-time streams"
            trend="+8.2%"
            trendUp={true}
            color="emerald"
          />
          <MetricCard
            icon={<AlertTriangle />}
            label="Critical Threats"
            value={metrics?.critical_threats?.toString() || "17"}
            subtext="require action"
            trend="-23.1%"
            trendUp={false}
            color="red"
            pulse={metrics ? (metrics.critical_threats || 0) > 0 : true}
          />
          <MetricCard
            icon={<Zap />}
            label="Avg Response Time"
            value={metrics?.avg_response_time ? `${(metrics.avg_response_time * 1000).toFixed(1)}ms` : "0.3s"}
            subtext="detection latency"
            trend="-41ms"
            trendUp={false}
            color="amber"
          />
        </div>
      </section>

      {/* COMMAND CENTER */}
      <section className="grid lg:grid-cols-12 gap-10">
        {/* Live Threat Intelligence */}
        <div className="lg:col-span-8 space-y-8">
          <ThreatIntelligenceMap metrics={metrics} lastUpdated={lastUpdated} />
          <ThreatActivityTimeline metrics={metrics} />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <SystemHealthPanel metrics={metrics} />
          <ActiveModelsPanel models={models} />
          <QuickActionsPanel />
        </div>
      </section>

      {/* ENTITY MONITORING */}
      <EntityMonitoringSection metrics={metrics} />
    </main>
  );
}

interface ThreatIntelligenceMapProps {
  metrics: DashboardMetrics | null;
  lastUpdated: Date;
}

function ThreatIntelligenceMap({ metrics, lastUpdated }: ThreatIntelligenceMapProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 hover:border-white/25 transition-all duration-500 shadow-2xl shadow-black/30 hover:shadow-black/40">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Threat Intelligence Map</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">Real-time anomaly detection & classification across global networks</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500/15 border border-green-400/30 shadow-xl shadow-green-500/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/60" />
              <span className="text-sm font-bold text-green-300 tracking-wide">LIVE</span>
            </div>
          </div>
        </div>

        {/* Enhanced Radar Visualization */}
        <div className="relative h-96 rounded-2xl bg-gradient-to-br from-blue-950/40 to-purple-950/40 border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Network className="w-40 h-40 text-blue-500/15 drop-shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Enhanced Animated Radar Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-56 h-56 rounded-full border-2 border-blue-500/30 animate-ping shadow-lg shadow-blue-500/20" style={{ animationDuration: '4s' }} />
            <div className="absolute w-72 h-72 rounded-full border-2 border-purple-500/25 animate-ping shadow-lg shadow-purple-500/20" style={{ animationDuration: '5s', animationDelay: '0.7s' }} />
            <div className="absolute w-88 h-88 rounded-full border-2 border-cyan-500/20 animate-ping shadow-lg shadow-cyan-500/20" style={{ animationDuration: '6s', animationDelay: '1.4s' }} />
          </div>

          {/* Threat Indicators - Real Data */}
          {metrics?.recent_threats?.slice(0, 6).map((threat, index) => {
            // Generate random positions for threats
            const positions = [
              "top-16 left-24", "top-36 right-20", "bottom-28 left-36",
              "bottom-20 right-28", "top-1/2 left-1/5", "bottom-1/3 right-1/4",
              "top-20 left-1/2", "bottom-24 right-16", "top-28 left-36", "bottom-16 left-20"
            ];
            const severity = (threat.severity as 'critical' | 'high' | 'medium' | 'low') ||
                           (threat.risk_score > 0.8 ? 'critical' : threat.risk_score > 0.6 ? 'high' : threat.risk_score > 0.4 ? 'medium' : 'low');

            return (
              <ThreatIndicator
                key={index}
                position={positions[index % positions.length]}
                severity={severity}
                label={threat.event_type || threat.description?.substring(0, 20) || 'Threat Detected'}
              />
            );
          }) || (
            <>
              <ThreatIndicator position="top-16 left-24" severity="high" label="SQL Injection" />
              <ThreatIndicator position="top-36 right-20" severity="medium" label="Rate Limit" />
              <ThreatIndicator position="bottom-28 left-36" severity="critical" label="Account Takeover" />
              <ThreatIndicator position="bottom-20 right-28" severity="low" label="Suspicious Login" />
            </>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                <span className="text-slate-300 font-semibold">Critical ({metrics?.recent_threats?.filter(t => (t.severity as string) === 'critical' || t.risk_score > 0.8).length || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
                <span className="text-slate-300 font-semibold">High ({metrics?.recent_threats?.filter(t => (t.severity as string) === 'high' || (t.risk_score > 0.6 && t.risk_score <= 0.8)).length || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50" />
                <span className="text-slate-300 font-semibold">Medium ({metrics?.recent_threats?.filter(t => (t.severity as string) === 'medium' || (t.risk_score > 0.4 && t.risk_score <= 0.6)).length || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
                <span className="text-slate-300 font-semibold">Low ({metrics?.recent_threats?.filter(t => (t.severity as string) === 'low' || t.risk_score <= 0.4).length || 0})</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ThreatActivityTimelineProps {
  metrics: DashboardMetrics | null;
}

function ThreatActivityTimeline({ metrics }: ThreatActivityTimelineProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 hover:border-white/25 transition-all duration-500 shadow-2xl shadow-black/30 hover:shadow-black/40">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Recent Threat Activity</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">Latest security events and anomaly detections</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl">
              View All
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {metrics?.recent_threats?.slice(0, 8).map((event, index) => {
            const severity = (event.severity as 'critical' | 'high' | 'medium' | 'low') ||
                           (event.risk_score > 0.8 ? 'critical' : event.risk_score > 0.6 ? 'high' : event.risk_score > 0.4 ? 'medium' : 'low');
            const timeAgo = new Date(event.timestamp).toLocaleTimeString();

            return (
              <ThreatActivity
                key={index}
                severity={severity}
                title={`${event.event_type || 'Threat'} detected`}
                description={`Risk score: ${(event.risk_score * 100).toFixed(1)}% • ${event.description || 'Anomalous activity detected'}`}
                time={timeAgo}
                userId={event.user_id || event.id || 'Unknown'}
              />
            );
          }) || (
            <>
              <ThreatActivity
                severity="critical"
                title="Mass account enumeration detected"
                description="15,000 requests from distributed IPs • Pattern: credential stuffing"
                time="38 seconds ago"
                userId="Network: 142.251.x.x/16"
              />
              <ThreatActivity
                severity="high"
                title="Anomalous transaction velocity"
                description="User exceeded baseline by 847% • Amount: $127,450"
                time="4 minutes ago"
                userId="User #AX-47291"
              />
              <ThreatActivity
                severity="medium"
                title="New device fingerprint"
                description="Login from unrecognized device • Location mismatch detected"
                time="12 minutes ago"
                userId="User #KP-98163"
              />
              <ThreatActivity
                severity="low"
                title="Model confidence threshold crossed"
                description="Risk score increased from 0.12 to 0.68 in 3 minutes"
                time="27 minutes ago"
                userId="Detector: Behavioral-v2.4"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface SystemHealthPanelProps {
  metrics: DashboardMetrics | null;
}

interface SystemHealthPanelProps {
  metrics: DashboardMetrics | null;
}

function SystemHealthPanel({ metrics }: SystemHealthPanelProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
        <h3 className="text-lg font-bold text-white mb-6">System Status</h3>

        <div className="space-y-4">
          <SystemStatus
            label="API Gateway"
            status={metrics?.system_health?.api_gateway?.status || "operational"}
            value={metrics?.system_health?.api_gateway?.value || "99.97%"}
          />
          <SystemStatus
            label="ML Inference Engine"
            status={metrics?.system_health?.ml_inference_engine?.status || "operational"}
            value={metrics?.system_health?.ml_inference_engine?.value || "4.2ms"}
          />
          <SystemStatus
            label="Data Pipeline"
            status={metrics?.system_health?.data_pipeline?.status || "operational"}
            value={metrics?.system_health?.data_pipeline?.value || "2.1M/min"}
          />
          <SystemStatus
            label="Redis Cache"
            status={metrics?.system_health?.redis_cache?.status || "operational"}
            value={metrics?.system_health?.redis_cache?.value || "0.8ms"}
          />
          <SystemStatus
            label="Graph Database"
            status={metrics?.system_health?.graph_database?.status || "operational"}
            value={metrics?.system_health?.graph_database?.value || "127ms"}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">System Status</span>
            <span className="font-semibold text-green-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActiveModelsPanelProps {
  models: DashboardModels | null;
}

function ActiveModelsPanel({ models }: ActiveModelsPanelProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
        <h3 className="text-lg font-bold text-white mb-6">Active Models</h3>

        <div className="space-y-4">
          {models?.models?.map((model, index) => (
            <ModelCard
              key={index}
              name={model.name}
              version={model.version}
              accuracy={model.accuracy}
              status={model.status as 'deployed' | 'training'}
            />
          )) || (
            <>
              <ModelCard
                name="Behavioral Analysis"
                version="v2.4.1"
                accuracy="96.8%"
                status="deployed"
              />
              <ModelCard
                name="Transaction Velocity"
                version="v1.9.3"
                accuracy="94.2%"
                status="deployed"
              />
              <ModelCard
                name="Device Fingerprinting"
                version="v3.1.0"
                accuracy="98.1%"
                status="training"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionsPanel() {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

        <div className="space-y-2">
          <QuickAction icon={<Eye />} label="Review Flagged Entities" count={23} />
          <QuickAction icon={<Lock />} label="Apply Access Restrictions" count={8} />
          <QuickAction icon={<BarChart3 />} label="Generate Risk Report" />
          <QuickAction icon={<Sparkles />} label="Retrain Models" />
        </div>
      </div>
    </div>
  );
}

interface EntityMonitoringSectionProps {
  metrics: DashboardMetrics | null;
}

function EntityMonitoringSection({ metrics }: EntityMonitoringSectionProps) {
  return (
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
          {metrics?.high_risk_entities?.slice(0, 4).map((entity, index) => {
            const riskScore = Math.round((entity.risk_score || 0) * 100);
            const status = entity.severity === 'critical' ? 'blocked' :
                         entity.severity === 'high' ? 'monitoring' : 'review';
            const flags = entity.flags || [`Risk: ${riskScore}%`];

            return (
              <EntityCard
                key={index}
                id={entity.user_id || entity.id || `Entity-${index + 1}`}
                type={entity.event_type || 'User'}
                riskScore={riskScore}
                flags={flags}
                status={status}
              />
            );
          }) || (
            <>
              <EntityCard
                id="AX-47291"
                type="User"
                riskScore={94}
                flags={["Velocity", "Geo-anomaly"]}
                status="blocked"
              />
              <EntityCard
                id="KP-98163"
                type="User"
                riskScore={87}
                flags={["New device", "Pattern shift"]}
                status="monitoring"
              />
              <EntityCard
                id="142.251.x.x"
                type="IP Range"
                riskScore={91}
                flags={["DDoS", "Enumeration"]}
                status="blocked"
              />
              <EntityCard
                id="TX-55892"
                type="Transaction"
                riskScore={78}
                flags={["High value", "Off-hours"]}
                status="review"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}