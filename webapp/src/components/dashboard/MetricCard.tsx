'use client';

import { memo } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { MetricCardProps, COLORS, CARD_STYLES, TYPOGRAPHY } from '@/types/dashboard';

/**
 * Premium metric card with sophisticated animations and visual hierarchy
 * 
 * Features:
 * - Gradient icon backgrounds with glow effects
 * - Animated trend indicators
 * - Progress bar with shimmer effect
 * - Hover micro-interactions
 * - Accessibility-first design
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
      gradient: 'from-emerald-500 to-green-400',
      bgLight: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'rgba(16, 185, 129, 0.2)',
      progress: 'from-emerald-500 via-green-400 to-emerald-500',
    },
    red: {
      gradient: 'from-red-500 to-rose-400',
      bgLight: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      glow: 'rgba(239, 68, 68, 0.2)',
      progress: 'from-red-500 via-rose-400 to-red-500',
    },
    amber: {
      gradient: 'from-amber-500 to-yellow-400',
      bgLight: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'rgba(245, 158, 11, 0.2)',
      progress: 'from-amber-500 via-yellow-400 to-amber-500',
    },
  }[color];

  return (
    <article
      className="glass-card p-5 lg:p-6 hover:scale-[1.02] hover-lift group cursor-pointer"
      role="region"
      aria-label={`${label}: ${value}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ backgroundColor: colorConfig.glow }}
            aria-hidden="true"
          />
          <div className={`
            relative p-3 rounded-xl ${colorConfig.bgLight} ${colorConfig.border} border
            transition-transform duration-300 group-hover:scale-110
          `}>
            <div className={colorConfig.text}>
              {icon}
            </div>
          </div>
        </div>

        {/* Trend & Pulse */}
        <div className="flex items-center gap-2">
          {pulse && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
          )}
          <span className={`
            flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold
            ${trendUp
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/15 text-red-400 border border-red-500/20'
            }
          `}>
            {trendUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1 mb-4">
        <p className="text-overline">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {value}
          </span>
        </div>
        <p className="text-caption">{subtext}</p>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className={`progress-bar-fill bg-gradient-to-r ${colorConfig.progress}`}
          style={{ width: trendUp ? '78%' : '42%' }}
          role="progressbar"
          aria-valuenow={trendUp ? 78 : 42}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Bottom link - appears on hover */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <span>View details</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
});

MetricCard.displayName = 'MetricCard';

export { MetricCard as default };