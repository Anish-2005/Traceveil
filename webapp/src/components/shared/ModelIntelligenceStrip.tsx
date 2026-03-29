'use client';

import { Activity, Brain, Cpu, Gauge, ShieldCheck } from 'lucide-react';
import { ModelIntelligenceSnapshot } from '@/lib/api';

interface ModelIntelligenceStripProps {
  snapshot: ModelIntelligenceSnapshot | null;
  loading?: boolean;
  compact?: boolean;
}

function formatPercent(value: number): string {
  return `${Math.max(0, Math.round(value * 100))}%`;
}

function formatLatency(seconds: number): string {
  const ms = seconds * 1000;
  return `${ms.toFixed(1)}ms`;
}

export function ModelIntelligenceStrip({
  snapshot,
  loading = false,
  compact = false,
}: ModelIntelligenceStripProps) {
  const metrics = snapshot?.metrics;
  const models = snapshot?.models;
  const modelStatus = snapshot?.modelStatus;
  const feedback = snapshot?.feedback;

  const cards = [
    {
      label: 'Detection Rate',
      value: metrics ? formatPercent(metrics.threat_detection_rate) : '0%',
      icon: ShieldCheck,
      tone: 'text-blue-300',
    },
    {
      label: 'Inference Latency',
      value: metrics ? formatLatency(metrics.avg_response_time) : '0.0ms',
      icon: Gauge,
      tone: 'text-emerald-300',
    },
    {
      label: 'Deployed Models',
      value: String(modelStatus?.current_models?.length || models?.models?.length || 0),
      icon: Brain,
      tone: 'text-violet-300',
    },
    {
      label: 'Feedback Signals',
      value: String(feedback?.total_feedback ?? 0),
      icon: Activity,
      tone: 'text-amber-300',
    },
  ];

  return (
    <section className={`glass-card border border-white/[0.08] ${compact ? 'p-4' : 'p-5 lg:p-6'}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-300" />
          <p className="text-sm font-semibold text-slate-200">Model Intelligence</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${
          snapshot?.source === 'live'
            ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
            : 'text-amber-300 border-amber-500/30 bg-amber-500/10'
        }`}>
          {snapshot?.source === 'live' ? 'Live' : 'Fallback'}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">{card.label}</p>
              <card.icon className={`w-3.5 h-3.5 ${card.tone}`} />
            </div>
            {loading ? (
              <div className="h-5 w-16 bg-white/[0.08] rounded animate-pulse" />
            ) : (
              <p className="text-lg font-bold text-white">{card.value}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ModelIntelligenceStrip;

