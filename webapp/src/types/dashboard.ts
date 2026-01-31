import { ReactNode } from 'react';

// Dashboard Types
export interface DashboardMetrics {
  threat_detection_rate: number;
  active_monitoring: number;
  critical_threats: number;
  avg_response_time: number;
  recent_threats: ThreatEvent[];
  high_risk_entities: HighRiskEntity[];
  system_health: SystemHealth;
}

export interface DashboardModels {
  models: ModelInfo[];
}

export interface ThreatEvent {
  id: string;
  user_id?: string;
  event_type: string;
  risk_score: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  timestamp: string;
  flags?: string[];
}

export interface HighRiskEntity {
  id: string;
  user_id?: string;
  event_type?: string;
  risk_score: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  flags?: string[];
}

export interface SystemHealth {
  api_gateway: HealthStatus;
  ml_inference_engine: HealthStatus;
  data_pipeline: HealthStatus;
  redis_cache: HealthStatus;
  graph_database: HealthStatus;
}

export interface HealthStatus {
  status: 'operational' | 'degraded' | 'offline';
  value: string;
}

export interface ModelInfo {
  name: string;
  version: string;
  accuracy: string;
  status: 'deployed' | 'training';
}

// Component Props Types
export interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: string;
  trendUp: boolean;
  color: 'emerald' | 'red' | 'amber';
  pulse?: boolean;
}

export interface ThreatIndicatorProps {
  position: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  label: string;
}

export interface ThreatActivityProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  userId: string;
}

export interface SystemStatusProps {
  label: string;
  status: string;
  value: string;
}

export interface ModelCardProps {
  name: string;
  version: string;
  accuracy: string;
  status: 'deployed' | 'training';
}

export interface QuickActionProps {
  icon: ReactNode;
  label: string;
  count?: number;
}

export interface EntityCardProps {
  id: string;
  type: string;
  riskScore: number;
  flags: string[];
  status: 'blocked' | 'monitoring' | 'review';
}

// Color and Styling Constants
export const COLORS = {
  severity: {
    critical: {
      bg: 'bg-red-500',
      border: 'border-red-400/60',
      shadow: 'shadow-red-500/25',
      text: 'text-red-300',
      bgLight: 'bg-red-500/8',
      borderLight: 'border-red-400/20',
      glow: 'from-red-500/20 to-rose-500/20',
    },
    high: {
      bg: 'bg-amber-500',
      border: 'border-amber-400/60',
      shadow: 'shadow-amber-500/25',
      text: 'text-amber-300',
      bgLight: 'bg-amber-500/8',
      borderLight: 'border-amber-400/20',
      glow: 'from-amber-500/20 to-orange-500/20',
    },
    medium: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-400/60',
      shadow: 'shadow-yellow-500/25',
      text: 'text-yellow-300',
      bgLight: 'bg-yellow-500/8',
      borderLight: 'border-yellow-400/20',
      glow: 'from-yellow-500/20 to-amber-500/20',
    },
    low: {
      bg: 'bg-blue-500',
      border: 'border-blue-400/60',
      shadow: 'shadow-blue-500/25',
      text: 'text-blue-300',
      bgLight: 'bg-blue-500/8',
      borderLight: 'border-blue-400/20',
      glow: 'from-blue-500/20 to-cyan-500/20',
    },
  },
  status: {
    operational: { color: 'emerald', text: 'Operational', bg: 'bg-emerald-500/10', border: 'border-emerald-400/30' },
    degraded: { color: 'amber', text: 'Degraded', bg: 'bg-amber-500/10', border: 'border-amber-400/30' },
    offline: { color: 'red', text: 'Offline', bg: 'bg-red-500/10', border: 'border-red-400/30' },
    deployed: { color: 'emerald', text: 'Deployed', bg: 'bg-emerald-500/10', border: 'border-emerald-400/30' },
    training: { color: 'blue', text: 'Training', bg: 'bg-blue-500/10', border: 'border-blue-400/30' },
    blocked: { color: 'red', text: 'Blocked', bg: 'bg-red-500/10', border: 'border-red-400/30' },
    monitoring: { color: 'amber', text: 'Monitoring', bg: 'bg-amber-500/10', border: 'border-amber-400/30' },
    review: { color: 'blue', text: 'Review', bg: 'bg-blue-500/10', border: 'border-blue-400/30' },
  },
  gradients: {
    primary: 'from-slate-900 via-slate-800 to-slate-900',
    secondary: 'from-slate-800/50 to-slate-900/50',
    accent: 'from-blue-600/20 via-cyan-600/20 to-purple-600/20',
    card: 'from-white/[0.08] via-white/[0.05] to-white/[0.02]',
    cardHover: 'from-white/[0.12] via-white/[0.08] to-white/[0.04]',
  },
} as const;

export const CARD_STYLES = {
  base: 'relative bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/20',
  glow: 'absolute inset-0 bg-gradient-to-br rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500',
  innerGlow: 'absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl',
  header: 'flex items-center justify-between mb-6 pb-4 border-b border-white/5',
  content: 'space-y-4',
  professional: 'relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl hover:border-white/25 transition-all duration-500 shadow-2xl shadow-black/30 hover:shadow-black/40',
  enterprise: 'relative bg-gradient-to-br from-white/[0.15] via-white/[0.10] to-white/[0.06] backdrop-blur-3xl border border-white/20 rounded-3xl hover:border-white/30 transition-all duration-500 shadow-2xl shadow-black/40 hover:shadow-black/50',
} as const;

export const TYPOGRAPHY = {
  heading: {
    h1: 'text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent',
    h2: 'text-2xl font-bold tracking-tight text-white',
    h3: 'text-xl font-semibold text-white',
    h4: 'text-lg font-semibold text-white',
    h5: 'text-base font-semibold text-white',
    h6: 'text-sm font-semibold text-white uppercase tracking-wider',
  },
  body: {
    large: 'text-base text-slate-200 leading-relaxed',
    base: 'text-sm text-slate-300 leading-relaxed',
    small: 'text-xs text-slate-400 leading-normal',
    micro: 'text-xs text-slate-500 leading-tight',
  },
  label: 'text-xs font-medium text-slate-400 uppercase tracking-wider',
  display: {
    large: 'text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent',
    medium: 'text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent',
    small: 'text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent',
  },
  metric: {
    value: 'text-3xl font-black tracking-tight text-white',
    label: 'text-sm font-semibold text-slate-400 uppercase tracking-widest',
    subtext: 'text-xs text-slate-500 font-medium',
  },
} as const;