'use client';

import { memo, useMemo } from 'react';
import { Network } from 'lucide-react';
import { DashboardMetrics } from '@/lib/api';
import { ThreatIndicator } from './ThreatIndicator';
import {
    THREAT_POSITIONS,
    THREAT_DISPLAY_LIMITS,
    getSeverityFromScore,
    ANIMATION_DURATIONS,
} from '@/lib/constants';

/**
 * Props for the ThreatIntelligenceMap component
 */
export interface ThreatIntelligenceMapProps {
    /** Dashboard metrics containing threat data */
    metrics: DashboardMetrics | null;
    /** Last data update timestamp */
    lastUpdated: Date;
    /** Optional custom class names */
    className?: string;
}

/**
 * Real-time threat intelligence visualization with radar-style display
 * 
 * Features:
 * - Animated radar rings with staggered timing
 * - Dynamic threat indicators positioned around the radar
 * - Severity legend with live counts
 * - Last updated timestamp
 * - Graceful fallback for demo data
 */
export const ThreatIntelligenceMap = memo(function ThreatIntelligenceMap({
    metrics,
    lastUpdated,
    className = '',
}: ThreatIntelligenceMapProps) {
    // Memoize threat counts by severity
    const threatCounts = useMemo(() => {
        const threats = metrics?.recent_threats ?? [];
        return {
            critical: threats.filter(t =>
                t.severity === 'critical' || t.risk_score > 0.8
            ).length,
            high: threats.filter(t =>
                t.severity === 'high' || (t.risk_score > 0.6 && t.risk_score <= 0.8)
            ).length,
            medium: threats.filter(t =>
                t.severity === 'medium' || (t.risk_score > 0.4 && t.risk_score <= 0.6)
            ).length,
            low: threats.filter(t =>
                t.severity === 'low' || t.risk_score <= 0.4
            ).length,
        };
    }, [metrics?.recent_threats]);

    // Memoize threat indicators
    const threatIndicators = useMemo(() => {
        const threats = metrics?.recent_threats?.slice(0, THREAT_DISPLAY_LIMITS.map) ?? [];

        if (threats.length === 0) {
            // Return fallback demo data
            return [
                { position: THREAT_POSITIONS[0], severity: 'high' as const, label: 'SQL Injection' },
                { position: THREAT_POSITIONS[1], severity: 'medium' as const, label: 'Rate Limit' },
                { position: THREAT_POSITIONS[2], severity: 'critical' as const, label: 'Account Takeover' },
                { position: THREAT_POSITIONS[3], severity: 'low' as const, label: 'Suspicious Login' },
            ];
        }

        return threats.map((threat, index) => ({
            position: THREAT_POSITIONS[index % THREAT_POSITIONS.length],
            severity: (threat.severity as 'critical' | 'high' | 'medium' | 'low') ||
                getSeverityFromScore(threat.risk_score),
            label: threat.event_type || threat.description?.substring(0, 20) || 'Threat Detected',
        }));
    }, [metrics?.recent_threats]);

    return (
        <div className={`relative group ${className}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 hover:border-white/25 transition-all duration-500 shadow-2xl shadow-black/30 hover:shadow-black/40">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            Threat Intelligence Map
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Real-time anomaly detection & classification across global networks
                        </p>
                    </div>

                    {/* Live indicator */}
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500/15 border border-green-400/30 shadow-xl shadow-green-500/20"
                        role="status"
                        aria-label="Live data feed active"
                    >
                        <div
                            className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/60"
                            aria-hidden="true"
                        />
                        <span className="text-sm font-bold text-green-300 tracking-wide uppercase">
                            Live
                        </span>
                    </div>
                </div>

                {/* Radar Visualization */}
                <div
                    className="relative h-96 rounded-2xl bg-gradient-to-br from-blue-950/40 to-purple-950/40 border border-white/10 overflow-hidden shadow-2xl shadow-black/50"
                    role="img"
                    aria-label="Threat radar visualization showing current security threats"
                >
                    {/* Center Network Icon */}
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <div className="relative">
                            <Network className="w-40 h-40 text-blue-500/15 drop-shadow-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
                        </div>
                    </div>

                    {/* Animated Radar Rings */}
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <div
                            className="absolute w-56 h-56 rounded-full border-2 border-blue-500/30 animate-ping shadow-lg shadow-blue-500/20"
                            style={{ animationDuration: `${ANIMATION_DURATIONS.radar.ring1}ms` }}
                        />
                        <div
                            className="absolute w-72 h-72 rounded-full border-2 border-purple-500/25 animate-ping shadow-lg shadow-purple-500/20"
                            style={{ animationDuration: `${ANIMATION_DURATIONS.radar.ring2}ms`, animationDelay: '700ms' }}
                        />
                        <div
                            className="absolute w-88 h-88 rounded-full border-2 border-cyan-500/20 animate-ping shadow-lg shadow-cyan-500/20"
                            style={{ animationDuration: `${ANIMATION_DURATIONS.radar.ring3}ms`, animationDelay: '1400ms' }}
                        />
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

                    {/* Legend and Timestamp */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm">
                        <div
                            className="flex items-center gap-6"
                            role="list"
                            aria-label="Threat severity legend"
                        >
                            <LegendItem color="red" label="Critical" count={threatCounts.critical} />
                            <LegendItem color="amber" label="High" count={threatCounts.high} />
                            <LegendItem color="yellow" label="Medium" count={threatCounts.medium} />
                            <LegendItem color="blue" label="Low" count={threatCounts.low} />
                        </div>

                        <div className="flex items-center gap-2 text-slate-400 font-medium">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" aria-hidden="true" />
                            <time dateTime={lastUpdated.toISOString()}>
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </time>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * Legend item component for threat severity display
 */
interface LegendItemProps {
    color: 'red' | 'amber' | 'yellow' | 'blue';
    label: string;
    count: number;
}

const LegendItem = memo(function LegendItem({ color, label, count }: LegendItemProps) {
    const colorClasses = {
        red: 'bg-red-500 shadow-red-500/50',
        amber: 'bg-amber-500 shadow-amber-500/50',
        yellow: 'bg-yellow-500 shadow-yellow-500/50',
        blue: 'bg-blue-500 shadow-blue-500/50',
    };

    return (
        <div className="flex items-center gap-2" role="listitem">
            <div
                className={`w-3 h-3 rounded-full shadow-lg ${colorClasses[color]}`}
                aria-hidden="true"
            />
            <span className="text-slate-300 font-semibold">
                {label} ({count})
            </span>
        </div>
    );
});

ThreatIntelligenceMap.displayName = 'ThreatIntelligenceMap';
LegendItem.displayName = 'LegendItem';

export default ThreatIntelligenceMap;
