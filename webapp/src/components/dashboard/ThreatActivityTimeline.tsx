'use client';

import { memo, useMemo } from 'react';
import { AlertTriangle, ChevronRight, Clock, Filter, Activity } from 'lucide-react';
import { DashboardMetrics } from '@/lib/api';
import { ThreatActivity } from './ThreatActivity';
import {
    THREAT_DISPLAY_LIMITS,
    getSeverityFromScore,
    DEFAULT_THREAT_EVENTS,
} from '@/lib/constants';

/**
 * Props for the ThreatActivityTimeline component
 */
export interface ThreatActivityTimelineProps {
    metrics: DashboardMetrics | null;
    onViewAll?: () => void;
    className?: string;
}

/**
 * Premium threat activity timeline with enhanced UX
 */
export const ThreatActivityTimeline = memo(function ThreatActivityTimeline({
    metrics,
    onViewAll,
    className = '',
}: ThreatActivityTimelineProps) {
    const threatEvents = useMemo(() => {
        const threats = metrics?.recent_threats?.slice(0, THREAT_DISPLAY_LIMITS.timeline);

        if (!threats || threats.length === 0) {
            return DEFAULT_THREAT_EVENTS;
        }

        return threats.map((event) => {
            const severity = (event.severity as 'critical' | 'high' | 'medium' | 'low') ||
                getSeverityFromScore(event.risk_score);
            const timeAgo = formatTimeAgo(new Date(event.timestamp));

            return {
                severity,
                title: `${event.event_type || 'Threat'} detected`,
                description: `Risk score: ${(event.risk_score * 100).toFixed(1)}% • ${event.description || 'Anomalous activity detected'}`,
                time: timeAgo,
                userId: event.user_id || event.id || 'Unknown',
            };
        });
    }, [metrics?.recent_threats]);

    const threatCount = threatEvents.length;

    return (
        <div className={`flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 overflow-hidden hover:border-white/[0.12] transition-colors ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Activity Log</h3>
                            <p className="text-xs text-slate-400">Recent security events</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 p-0 overflow-hidden">
                <div
                    className="max-h-[400px] overflow-y-auto px-6 py-4 space-y-4"
                    role="feed"
                    aria-label="Recent threat activity feed"
                >
                    {threatEvents.map((event, index) => (
                        <div
                            key={`threat-activity-${index}`}
                            className="scroll-reveal"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <ThreatActivity
                                severity={event.severity}
                                title={event.title}
                                description={event.description}
                                time={event.time}
                                userId={event.userId}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer stats */}
            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                        LIVE FEED
                    </span>
                </div>
                <button
                    onClick={onViewAll}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    VIEW ALL events <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
});

/**
 * Format timestamp to relative time
 */
function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

ThreatActivityTimeline.displayName = 'ThreatActivityTimeline';

export default ThreatActivityTimeline;
