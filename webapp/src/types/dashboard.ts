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
      border: 'border-red-400',
      shadow: 'shadow-red-500/50',
      text: 'text-red-400',
      bgLight: 'bg-red-500/10',
      borderLight: 'border-red-500/20',
    },
    high: {
      bg: 'bg-amber-500',
      border: 'border-amber-400',
      shadow: 'shadow-amber-500/50',
      text: 'text-amber-400',
      bgLight: 'bg-amber-500/10',
      borderLight: 'border-amber-500/20',
    },
    medium: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-400',
      shadow: 'shadow-yellow-500/50',
      text: 'text-yellow-400',
      bgLight: 'bg-yellow-500/10',
      borderLight: 'border-yellow-500/20',
    },
    low: {
      bg: 'bg-blue-500',
      border: 'border-blue-400',
      shadow: 'shadow-blue-500/50',
      text: 'text-blue-400',
      bgLight: 'bg-blue-500/10',
      borderLight: 'border-blue-500/20',
    },
  },
  status: {
    operational: { color: 'green', text: 'Operational' },
    degraded: { color: 'amber', text: 'Degraded' },
    offline: { color: 'red', text: 'Offline' },
    deployed: { color: 'green', text: 'Deployed' },
    training: { color: 'blue', text: 'Training' },
    blocked: { color: 'red', text: 'Blocked' },
    monitoring: { color: 'amber', text: 'Monitoring' },
    review: { color: 'blue', text: 'Review' },
  },
} as const;

export const CARD_STYLES = {
  base: 'relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all',
  glow: 'absolute inset-0 bg-gradient-to-br rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500',
} as const;