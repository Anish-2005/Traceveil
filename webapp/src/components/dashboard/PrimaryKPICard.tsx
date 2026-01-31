'use client';

import { memo } from 'react';
import { Brain, TrendingUp } from 'lucide-react';
import { DashboardMetrics } from '@/lib/api';
import { formatRiskScore, DEFAULT_METRICS } from '@/lib/constants';

/**
 * Props for the PrimaryKPICard component
 */
export interface PrimaryKPICardProps {
    /** Dashboard metrics data */
    metrics: DashboardMetrics | null;
    /** Optional custom class names */
    className?: string;
}

/**
 * Hero KPI card displaying the primary threat detection rate metric
 * 
 * Features:
 * - Large, prominent metric display
 * - Live indicator with pulse animation
 * - Visual progress bar
 * - Trend indicator with percentage change
 * - Graceful fallback when data is unavailable
 */
export const PrimaryKPICard = memo(function PrimaryKPICard({
    metrics,
    className = '',
}: PrimaryKPICardProps) {
    const detectionRate = metrics?.threat_detection_rate ?? DEFAULT_METRICS.threatDetectionRate;
    const formattedRate = formatRiskScore(detectionRate);

    return (
        <div className={`relative group ${className}`}>
            {/* Glow effect on hover */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/90 to-blue-50 dark:from-slate-900/80 dark:to-slate-800/80 border border-slate-200/40 dark:border-white/10 rounded-2xl p-7 shadow-md hover:shadow-lg transition-all duration-300">
                {/* Header with icon and live indicator */}
                <div className="flex items-center justify-between mb-6">
                    <span
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30"
                        aria-hidden="true"
                    >
                        <Brain className="w-7 h-7 text-blue-500 dark:text-blue-300" />
                    </span>

                    <div
                        className="flex items-center gap-2"
                        role="status"
                        aria-label="Live data indicator"
                    >
                        <span
                            className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"
                            aria-hidden="true"
                        />
                        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                            Live
                        </span>
                    </div>
                </div>

                {/* Metric display */}
                <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase">
                        Threat Detection Rate
                    </p>
                    <div className="flex items-end gap-3">
                        <span
                            className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                            aria-label={`${formattedRate} accuracy`}
                        >
                            {formattedRate}
                        </span>
                        <span className="text-base text-slate-400 font-medium pb-1">
                            accuracy
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    className="h-2 bg-slate-200/60 dark:bg-slate-700/40 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={Math.round(detectionRate * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Detection rate progress"
                >
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${detectionRate * 100}%` }}
                    />
                </div>

                {/* Trend indicator */}
                <div className="flex items-center gap-2 text-xs mt-4">
                    <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-500 font-semibold">
                        +12.4% from last hour
                    </span>
                </div>
            </div>
        </div>
    );
});

PrimaryKPICard.displayName = 'PrimaryKPICard';

export default PrimaryKPICard;
