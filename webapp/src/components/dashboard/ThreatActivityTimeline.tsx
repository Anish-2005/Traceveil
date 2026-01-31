'use client';

import { memo, useMemo } from 'react';
import { AlertTriangle, ChevronRight, Clock, Filter } from 'lucide-react';
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
        <div className={`glass-card overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-6 lg:p-8 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/20">
                                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-overline">Event Log</span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                            Recent Threat Activity
                        </h3>
                        <p className="text-caption mt-1">
                            {threatCount} events in the last 24 hours
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="btn-ghost text-sm flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button
                            type="button"
                            onClick={onViewAll}
                            className="btn-primary text-sm flex items-center gap-1.5"
                        >
                            <span>View All</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                <div
                    className="space-y-3 max-h-[420px] overflow-y-auto pr-2"
                    role="feed"
                    aria-label="Recent threat activity feed"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.15) transparent',
                    }}
                >
                    {threatEvents.map((event, index) => (
                        <div
                            key={`threat-activity-${index}`}
                            className="animate-fade-up"
                            style={{ animationDelay: `${index * 50}ms` }}
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
            <div className="px-6 lg:px-8 py-4 bg-white/[0.02] border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>Auto-refreshing every 30s</span>
                        </div>
                    </div>
                    <span className="text-slate-500">
                        Showing {threatEvents.length} of {metrics?.recent_threats?.length ?? threatEvents.length} events
                    </span>
                </div>
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
