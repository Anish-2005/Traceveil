'use client';

import { memo } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { MetricCardProps } from '@/types/dashboard';

/**
 * Minimal metric card for high-density dashboard layouts
 */
export const MetricCard = memo(function MetricCard({
  icon,
  label,
  value,
  subtext,
  trend,
  trendUp,
  color,
  pulse
}: MetricCardProps) {
  const colorConfig = {
    emerald: {
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      trendText: 'text-emerald-500',
      bar: 'bg-emerald-500',
    },
    red: {
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      trendText: 'text-red-500',
      bar: 'bg-red-500',
    },
    amber: {
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      trendText: 'text-amber-500',
      bar: 'bg-amber-500',
    },
    blue: {
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      trendText: 'text-blue-500',
      bar: 'bg-blue-500',
    }
  }[color] || {
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-500',
    trendText: 'text-slate-500',
    bar: 'bg-slate-500',
  };

  return (
    <article
      className="relative flex flex-col p-5 rounded-xl border border-white/[0.08] bg-[#030712]/40 hover:bg-[#030712]/60 hover:border-white/[0.12] transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorConfig.iconBg} ${colorConfig.iconColor}`}>
          {icon}
        </div>

        {/* Trend Indicator */}
        {(trend || pulse) && (
          <div className="flex items-center gap-2">
            {pulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
            {trend && (
              <span className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-400 mb-1">{label}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        </div>
        {subtext && (
          <p className="text-xs text-slate-500">{subtext}</p>
        )}
      </div>

      {/* Footer / Interaction Hint */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colorConfig.bar}`}
            style={{ width: trendUp ? '75%' : '30%' }}
          />
        </div>
      </div>
    </article>
  );
});

MetricCard.displayName = 'MetricCard';

export { MetricCard as default };