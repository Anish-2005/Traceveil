'use client';

import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface EntityCardProps {
  id: string;
  type: string;
  riskScore: number;
  flags: readonly string[] | string[];
  status: string;
  explanation?: string;
}

/**
 * Premium entity card with risk visualization
 */
export const EntityCard = memo(function EntityCard({
  id,
  type,
  riskScore,
  flags,
  status,
  explanation
}: EntityCardProps) {
  const riskConfig = getRiskConfig(riskScore);
  const statusConfig = getStatusConfig(status);

  return (
    <article
      className={`
        glass-card p-5 cursor-pointer
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl
        ${riskConfig.hoverGlow}
        group
        relative overflow-hidden
      `}
      tabIndex={0}
      role="listitem"
      aria-label={`${type}: ${id}, Risk score ${riskScore}%`}
    >
      {/* Heavy Risk Gradient Background for Critical Items */}
      {riskScore >= 90 && (
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-overline mb-1">{type}</p>
          <h4 className="text-base font-bold text-white truncate group-hover:text-blue-200 transition-colors">
            {id}
          </h4>
        </div>
        <span className={`
          px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
          ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border
        `}>
          {statusConfig.label}
        </span>
      </div>

      {/* Risk Score */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Risk Score</span>
          <span className={`text-lg font-black ${riskConfig.text}`}>
            {riskScore}%
          </span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${riskConfig.progressBg}`}
            style={{ width: `${riskScore}%` }}
            role="progressbar"
            aria-valuenow={riskScore}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Explanation / Flags */}
      <div className="mb-4 relative z-10">
        {explanation ? (
          <div className="mb-2 p-2 rounded bg-white/[0.04] border border-white/[0.05]">
            <p className="text-[10px] text-slate-300 leading-relaxed italic">
              "{explanation}"
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          {[...flags].slice(0, 3).map((flag) => (
            <span
              key={flag}
              className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              {flag}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] rounded-lg border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200 relative z-10"
        tabIndex={-1}
      >
        <span>View Analysis</span>
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </article>
  );
});

function getRiskConfig(score: number) {
  if (score >= 90) return {
    text: 'text-red-400',
    progressBg: 'bg-gradient-to-r from-red-500 to-rose-400',
    hoverGlow: 'hover:shadow-red-500/10',
  };
  if (score >= 75) return {
    text: 'text-amber-400',
    progressBg: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    hoverGlow: 'hover:shadow-amber-500/10',
  };
  if (score >= 50) return {
    text: 'text-yellow-400',
    progressBg: 'bg-gradient-to-r from-yellow-500 to-lime-400',
    hoverGlow: 'hover:shadow-yellow-500/10',
  };
  return {
    text: 'text-blue-400',
    progressBg: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    hoverGlow: 'hover:shadow-blue-500/10',
  };
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'critical':
      return {
        label: 'Critical',
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        border: 'border-red-500/25',
      };
    case 'investigating':
      return {
        label: 'Investigating',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/25',
      };
    case 'monitoring':
      return {
        label: 'Monitoring',
        bg: 'bg-blue-500/15',
        text: 'text-blue-400',
        border: 'border-blue-500/25',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/25',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500/25',
      };
  }
}

EntityCard.displayName = 'EntityCard';

export default EntityCard;