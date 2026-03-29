'use client';

import { ArrowUpRight } from 'lucide-react';
import { useModelIntelligence } from '@/hooks';

export function StatsSection() {
  const { data, isLoading } = useModelIntelligence({ refreshInterval: 30000 });
  const metrics = data?.metrics;

  const stats = [
    {
      label: 'Detection Accuracy',
      value: `${Math.round((metrics?.threat_detection_rate || 0) * 100)}%`,
      trend: 'Live',
      chart: [35, 48, 56, 64, 70, 74, 81, 88],
    },
    {
      label: 'Inference Latency',
      value: `${((metrics?.avg_response_time || 0) * 1000).toFixed(1)}ms`,
      trend: 'Pipeline',
      chart: [82, 75, 66, 61, 56, 49, 42, 38],
    },
    {
      label: 'Monitored Events',
      value: `${(metrics?.active_monitoring || 0).toLocaleString()}`,
      trend: 'Active',
      chart: [22, 30, 40, 47, 55, 63, 74, 85],
    },
    {
      label: 'Critical Threats',
      value: `${metrics?.critical_threats || 0}`,
      trend: 'Real-time',
      chart: [10, 22, 15, 30, 26, 32, 28, 20],
    },
  ];

  return (
    <section id="stats" className="py-24 border-y border-white/[0.05] bg-[#030712] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`scroll-reveal ${index > 0 ? `reveal-delay-${index}` : ''}`}>
              <StatItem
                label={stat.label}
                value={isLoading ? '...' : stat.value}
                trend={stat.trend}
                chart={stat.chart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  trend: string;
  chart: number[];
}

function StatItem({ label, value, trend, chart }: StatItemProps) {
  return (
    <div className="px-6 py-8 md:p-8 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors relative">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
          <span className="inline-flex items-center text-xs font-medium text-emerald-500">
            {trend}
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
        <div className="text-3xl lg:text-4xl font-semibold text-white mb-6 tracking-tight">{value}</div>
      </div>

      <div className="h-10 flex items-end justify-between gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
        {chart.map((point, i) => (
          <div key={i} className="w-full bg-blue-500/20 rounded-sm relative overflow-hidden" style={{ height: `${point}%` }}>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

