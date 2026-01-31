'use client';

import { memo } from 'react';
import { Brain, TrendingUp, ArrowUpRight, Zap } from 'lucide-react';
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
 * Premium hero KPI card with animated visualizations
 * 
 * Features:
 * - Prominent detection rate display with gradient
 * - Animated circular progress ring
 * - Real-time stats with micro-animations
 * - Premium glassmorphism styling
 */
export const PrimaryKPICard = memo(function PrimaryKPICard({
    metrics,
    className = '',
}: PrimaryKPICardProps) {
    const detectionRate = metrics?.threat_detection_rate ?? DEFAULT_METRICS.threatDetectionRate;
    const percentage = Math.round(detectionRate * 100);
    const circumference = 2 * Math.PI * 54; // radius = 54
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`glass-card-elevated p-6 lg:p-8 overflow-hidden ${className}`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                {/* Circular Progress */}
                <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                    {/* Background glow */}
                    <div
                        className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse-glow"
                        aria-hidden="true"
                    />

                    <div className="relative w-36 h-36 lg:w-40 lg:h-40">
                        {/* SVG Progress Ring */}
                        <svg
                            className="w-full h-full -rotate-90 transform"
                            viewBox="0 0 120 120"
                            aria-hidden="true"
                        >
                            {/* Background ring */}
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="8"
                            />
                            {/* Progress ring */}
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                            {/* Gradient definition */}
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                                {percentage}%
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                accuracy
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                    {/* Header */}
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20">
                            <Brain className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-overline">AI Detection Engine</span>
                    </div>

                    {/* Main metric */}
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Threat Detection Rate
                    </h2>
                    <p className="text-body mb-6 max-w-md mx-auto lg:mx-0">
                        Our ML models are performing above industry standards with exceptional precision in identifying malicious patterns.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6">
                        <StatBadge
                            icon={<TrendingUp className="w-3.5 h-3.5" />}
                            label="+12.4%"
                            subtext="vs last hour"
                            positive
                        />
                        <StatBadge
                            icon={<Zap className="w-3.5 h-3.5" />}
                            label="4.2ms"
                            subtext="avg latency"
                        />
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group">
                            <span>View Details</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * Stat badge component
 */
interface StatBadgeProps {
    icon: React.ReactNode;
    label: string;
    subtext: string;
    positive?: boolean;
}

const StatBadge = memo(function StatBadge({ icon, label, subtext, positive }: StatBadgeProps) {
    return (
        <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-lg border
      ${positive
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-white/[0.04] border-white/10 text-slate-300'
            }
    `}>
            {icon}
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs text-slate-500">{subtext}</span>
        </div>
    );
});

PrimaryKPICard.displayName = 'PrimaryKPICard';
StatBadge.displayName = 'StatBadge';

export default PrimaryKPICard;
