'use client';

import { memo } from 'react';
import { AlertTriangle, XCircle, MinusCircle, Activity, ArrowRight, Clock } from 'lucide-react';

export interface ThreatActivityProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  userId: string;
}

/**
 * Premium threat activity item with enhanced interactions
 */
export const ThreatActivity = memo(function ThreatActivity({
  severity,
  title,
  description,
  time,
  userId
}: ThreatActivityProps) {
  const config = {
    critical: {
      icon: <XCircle className="w-4 h-4" />,
      iconBg: 'bg-red-500/15',
      iconBorder: 'border-red-500/25',
      iconColor: 'text-red-400',
      dot: 'bg-red-500',
      glow: 'group-hover:shadow-red-500/10',
    },
    high: {
      icon: <AlertTriangle className="w-4 h-4" />,
      iconBg: 'bg-amber-500/15',
      iconBorder: 'border-amber-500/25',
      iconColor: 'text-amber-400',
      dot: 'bg-amber-500',
      glow: 'group-hover:shadow-amber-500/10',
    },
    medium: {
      icon: <MinusCircle className="w-4 h-4" />,
      iconBg: 'bg-yellow-500/15',
      iconBorder: 'border-yellow-500/25',
      iconColor: 'text-yellow-400',
      dot: 'bg-yellow-500',
      glow: 'group-hover:shadow-yellow-500/10',
    },
    low: {
      icon: <Activity className="w-4 h-4" />,
      iconBg: 'bg-blue-500/15',
      iconBorder: 'border-blue-500/25',
      iconColor: 'text-blue-400',
      dot: 'bg-blue-500',
      glow: 'group-hover:shadow-blue-500/10',
    },
  }[severity];

  return (
    <article
      className={`
        group relative flex gap-4 p-4 rounded-xl 
        bg-white/[0.02] hover:bg-white/[0.05]
        border border-white/[0.04] hover:border-white/[0.1]
        transition-all duration-300 cursor-pointer
        hover:shadow-xl ${config.glow}
      `}
      role="article"
      tabIndex={0}
      aria-label={`${severity} threat: ${title}`}
    >
      {/* Severity indicator line */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-0.5 ${config.dot} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className={`
        flex-shrink-0 p-2.5 rounded-xl
        ${config.iconBg} ${config.iconBorder} border
        ${config.iconColor}
        transition-transform duration-300 group-hover:scale-110
      `}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h4 className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors truncate">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 whitespace-nowrap">
            <Clock className="w-3 h-3" />
            <time>{time}</time>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-3 line-clamp-1 group-hover:text-slate-300 transition-colors">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
            {userId}
          </span>
          <button
            className="flex items-center gap-1 text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-blue-300"
            tabIndex={-1}
          >
            <span>Investigate</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
});

ThreatActivity.displayName = 'ThreatActivity';

export default ThreatActivity;