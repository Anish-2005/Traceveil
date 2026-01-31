'use client';

import { memo, useMemo } from 'react';
import { DashboardMetrics } from '@/lib/api';
import { ThreatActivity } from './ThreatActivity';
import {
    THREAT_DISPLAY_LIMITS,
    getSeverityFromScore,
    DEFAULT_THREAT_EVENTS,
    SCROLLBAR_CLASSES,
} from '@/lib/constants';

/**
 * Props for the ThreatActivityTimeline component
 */
export interface ThreatActivityTimelineProps {
    /** Dashboard metrics containing threat data */
    metrics: DashboardMetrics | null;
    /** Callback when "View All" is clicked */
    onViewAll?: () => void;
    /** Optional custom class names */
    className?: string;
}

/**
 * Timeline of recent threat activity events
 * 
 * Features:
 * - Scrollable list of recent threats
 * - Severity-based styling for each event
 * - View All navigation button
 * - Graceful fallback for demo data
 * - Smooth scroll with custom scrollbar
 */
export const ThreatActivityTimeline = memo(function ThreatActivityTimeline({
    metrics,
    onViewAll,
    className = '',
}: ThreatActivityTimelineProps) {
    // Memoize threat events
    const threatEvents = useMemo(() => {
        const threats = metrics?.recent_threats?.slice(0, THREAT_DISPLAY_LIMITS.timeline);

        if (!threats || threats.length === 0) {
            return DEFAULT_THREAT_EVENTS;
        }

        return threats.map((event) => {
            const severity = (event.severity as 'critical' | 'high' | 'medium' | 'low') ||
                getSeverityFromScore(event.risk_score);
            const timeAgo = new Date(event.timestamp).toLocaleTimeString();

            return {
                severity,
                title: `${event.event_type || 'Threat'} detected`,
                description: `Risk score: ${(event.risk_score * 100).toFixed(1)}% • ${event.description || 'Anomalous activity detected'}`,
                time: timeAgo,
                userId: event.user_id || event.id || 'Unknown',
            };
        });
    }, [metrics?.recent_threats]);

    return (
        <div className={`relative group ${className}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 hover:border-white/25 transition-all duration-500 shadow-2xl shadow-black/30 hover:shadow-black/40">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            Recent Threat Activity
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Latest security events and anomaly detections
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onViewAll}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                    >
                        View All
                    </button>
                </div>

                {/* Threat List */}
                <div
                    className={`space-y-4 max-h-96 overflow-y-auto ${SCROLLBAR_CLASSES}`}
                    role="feed"
                    aria-label="Recent threat activity feed"
                >
                    {threatEvents.map((event, index) => (
                        <ThreatActivity
                            key={`threat-activity-${index}`}
                            severity={event.severity}
                            title={event.title}
                            description={event.description}
                            time={event.time}
                            userId={event.userId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

ThreatActivityTimeline.displayName = 'ThreatActivityTimeline';

export default ThreatActivityTimeline;
