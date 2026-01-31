'use client';

import { memo, useMemo } from 'react';
import { Network, Radio, Globe, Wifi } from 'lucide-react';
import { DashboardMetrics } from '@/lib/api';
import { ThreatIndicator } from './ThreatIndicator';
import {
    THREAT_POSITIONS,
    THREAT_DISPLAY_LIMITS,
    getSeverityFromScore,
} from '@/lib/constants';

/**
 * Props for the ThreatIntelligenceMap component
 */
export interface ThreatIntelligenceMapProps {
    metrics: DashboardMetrics | null;
    lastUpdated: Date;
    className?: string;
}

/**
 * Premium threat intelligence visualization with animated radar
 */
export const ThreatIntelligenceMap = memo(function ThreatIntelligenceMap({
    metrics,
    lastUpdated,
    className = '',
}: ThreatIntelligenceMapProps) {
    const threatCounts = useMemo(() => {
        const threats = metrics?.recent_threats ?? [];
        return {
            critical: threats.filter(t => t.severity === 'critical' || t.risk_score > 0.8).length,
            high: threats.filter(t => t.severity === 'high' || (t.risk_score > 0.6 && t.risk_score <= 0.8)).length,
            medium: threats.filter(t => t.severity === 'medium' || (t.risk_score > 0.4 && t.risk_score <= 0.6)).length,
            low: threats.filter(t => t.severity === 'low' || t.risk_score <= 0.4).length,
        };
    }, [metrics?.recent_threats]);

    const threatIndicators = useMemo(() => {
        const threats = metrics?.recent_threats?.slice(0, THREAT_DISPLAY_LIMITS.map) ?? [];

        if (threats.length === 0) {
            return [
                { position: THREAT_POSITIONS[0], severity: 'high' as const, label: 'SQL Injection' },
                { position: THREAT_POSITIONS[1], severity: 'medium' as const, label: 'Rate Limit' },
                { position: THREAT_POSITIONS[2], severity: 'critical' as const, label: 'Account Takeover' },
                { position: THREAT_POSITIONS[3], severity: 'low' as const, label: 'Suspicious Login' },
            ];
        }

        return threats.map((threat, index) => ({
            position: THREAT_POSITIONS[index % THREAT_POSITIONS.length],
            severity: (threat.severity as 'critical' | 'high' | 'medium' | 'low') || getSeverityFromScore(threat.risk_score),
            label: threat.event_type || threat.description?.substring(0, 20) || 'Threat Detected',
        }));
    }, [metrics?.recent_threats]);

    const totalThreats = threatCounts.critical + threatCounts.high + threatCounts.medium + threatCounts.low;

    return (
        <div className={`glass-card-elevated overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-6 lg:p-8 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/20">
                                <Globe className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-overline">Real-time Analysis</span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                            Threat Intelligence Map
                        </h3>
                        <p className="text-caption mt-1 max-w-md">
                            Global threat monitoring with AI-powered anomaly detection
                        </p>
                    </div>

                    {/* Live indicator */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                                <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                Live
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-4 pb-6 border-b border-white/[0.06]">
                    <StatPill color="red" label="Critical" count={threatCounts.critical} />
                    <StatPill color="amber" label="High" count={threatCounts.high} />
                    <StatPill color="yellow" label="Medium" count={threatCounts.medium} />
                    <StatPill color="blue" label="Low" count={threatCounts.low} />
                    <div className="hidden sm:flex items-center gap-2 ml-auto text-sm text-slate-400">
                        <Wifi className="w-4 h-4" />
                        <span>{totalThreats} active threats detected</span>
                    </div>
                </div>
            </div>

            {/* Radar Visualization */}
            <div className="relative h-80 lg:h-96 bg-gradient-to-b from-slate-900/50 to-slate-950/80">
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '30px 30px',
                    }}
                    aria-hidden="true"
                />

                {/* Center radar */}
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    {/* Animated rings */}
                    <div className="absolute w-24 h-24 rounded-full border border-blue-500/30 animate-radar-ping" />
                    <div className="absolute w-40 h-40 rounded-full border border-purple-500/20 animate-radar-ping" style={{ animationDelay: '0.8s' }} />
                    <div className="absolute w-56 h-56 rounded-full border border-cyan-500/15 animate-radar-ping" style={{ animationDelay: '1.6s' }} />
                    <div className="absolute w-72 h-72 rounded-full border border-blue-500/10 animate-radar-ping" style={{ animationDelay: '2.4s' }} />

                    {/* Center icon */}
                    <div className="relative z-10 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm">
                        <Radio className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                {/* Threat Indicators */}
                {threatIndicators.map((indicator, index) => (
                    <ThreatIndicator
                        key={`threat-${index}`}
                        position={indicator.position}
                        severity={indicator.severity}
                        label={indicator.label}
                    />
                ))}

                {/* Timestamp */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
                    <time dateTime={lastUpdated.toISOString()}>
                        Updated {lastUpdated.toLocaleTimeString()}
                    </time>
                </div>
            </div>
        </div>
    );
});

/**
 * Stat pill component
 */
interface StatPillProps {
    color: 'red' | 'amber' | 'yellow' | 'blue';
    label: string;
    count: number;
}

const StatPill = memo(function StatPill({ color, label, count }: StatPillProps) {
    const config = {
        red: 'bg-red-500/15 border-red-500/25 text-red-400',
        amber: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
        yellow: 'bg-yellow-500/15 border-yellow-500/25 text-yellow-400',
        blue: 'bg-blue-500/15 border-blue-500/25 text-blue-400',
    }[color];

    const dotColor = {
        red: 'bg-red-500',
        amber: 'bg-amber-500',
        yellow: 'bg-yellow-500',
        blue: 'bg-blue-500',
    }[color];

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config}`}>
            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-xs font-bold ml-0.5">{count}</span>
        </div>
    );
});

ThreatIntelligenceMap.displayName = 'ThreatIntelligenceMap';
StatPill.displayName = 'StatPill';

export default ThreatIntelligenceMap;
