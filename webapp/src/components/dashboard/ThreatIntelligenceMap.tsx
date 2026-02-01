'use client';

import { memo, useMemo } from 'react';
import { Network, Radio, Globe, Wifi, Activity } from 'lucide-react';
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
        <div className={`flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 overflow-hidden hover:border-white/[0.12] transition-colors ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Threat Intelligence</h3>
                            <p className="text-xs text-slate-400">Global anomaly detection</p>
                        </div>
                    </div>

                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                        <div className="relative flex w-2 h-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wide">Live</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-2">
                    <StatPill color="red" label="Critical" count={threatCounts.critical} />
                    <StatPill color="amber" label="High" count={threatCounts.high} />
                    <StatPill color="blue" label="Total" count={totalThreats} />
                </div>
            </div>

            {/* Radar Visualization Area */}
            <div className="relative h-80 bg-[#030712]/20">
                {/* Minimal Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Radar Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Concentric Rings */}
                    <div className="absolute w-32 h-32 rounded-full border border-white/[0.03]" />
                    <div className="absolute w-56 h-56 rounded-full border border-white/[0.03]" />
                    <div className="absolute w-80 h-80 rounded-full border border-white/[0.03]" />

                    {/* Scanner Effect - Simplified */}
                    <div className="absolute w-80 h-80 rounded-full animate-[spin_4s_linear_infinite] opacity-20">
                        <div className="w-1/2 h-1/2 origin-bottom-right border-r border-b border-blue-500/50 bg-gradient-to-br from-transparent to-blue-500/10 rounded-tl-full" />
                    </div>

                    {/* Center Point */}
                    <div className="relative z-10 p-3 rounded-full bg-[#030712] border border-blue-500/20 shadow-lg shadow-blue-500/5">
                        <Activity className="w-5 h-5 text-blue-500" />
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

                {/* Footer / Timestamp */}
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono">
                    UPDATED: {lastUpdated.toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
});

/**
 * Minimal Stat pill component
 */
interface StatPillProps {
    color: 'red' | 'amber' | 'yellow' | 'blue';
    label: string;
    count: number;
}

const StatPill = memo(function StatPill({ color, label, count }: StatPillProps) {
    const config = {
        red: 'text-red-400 bg-red-500/10',
        amber: 'text-amber-400 bg-amber-500/10',
        yellow: 'text-yellow-400 bg-yellow-500/10',
        blue: 'text-blue-400 bg-blue-500/10',
    }[color];

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${config}`}>
            <span>{label}</span>
            <span className="opacity-60">|</span>
            <span>{count}</span>
        </div>
    );
});

ThreatIntelligenceMap.displayName = 'ThreatIntelligenceMap';
StatPill.displayName = 'StatPill';

export default ThreatIntelligenceMap;
