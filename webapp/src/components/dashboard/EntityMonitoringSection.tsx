'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { Users, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { DashboardMetrics } from '@/lib/api';
import { EntityCard } from './EntityCard';
import { getSeverityFromScore, getStatusFromSeverity, ENTITY_DISPLAY_LIMITS } from '@/lib/constants';

/**
 * Props for the EntityMonitoringSection component
 */
export interface EntityMonitoringSectionProps {
    metrics: DashboardMetrics | null;
    className?: string;
}

/**
 * Premium entity monitoring section
 */
export const EntityMonitoringSection = memo(function EntityMonitoringSection({
    metrics,
    className = '',
}: EntityMonitoringSectionProps) {
    const entities = useMemo(() => {
        const highRiskEntities = metrics?.high_risk_entities?.slice(0, ENTITY_DISPLAY_LIMITS.maxDisplay);

        if (!highRiskEntities || highRiskEntities.length === 0) {
            return [
                { id: 'user_4829', type: 'User Account', riskScore: 94, flags: ['Velocity', 'Geo'], status: 'critical' },
                { id: 'ip_192.168', type: 'IP Address', riskScore: 87, flags: ['Proxy', 'VPN'], status: 'investigating' },
                { id: 'device_a8f2', type: 'Device', riskScore: 76, flags: ['New', 'Multiple'], status: 'monitoring' },
                { id: 'session_9x7k', type: 'Session', riskScore: 68, flags: ['Duration'], status: 'monitoring' },
            ];
        }

        return highRiskEntities.map((entity) => {
            const severity = getSeverityFromScore(entity.risk_score);
            const status = getStatusFromSeverity(severity);

            return {
                id: entity.id,
                type: entity.event_type || 'Entity',
                riskScore: Math.round(entity.risk_score * 100),
                flags: [...(entity.flags || [])].slice(0, 3),
                status,
            };
        });
    }, [metrics?.high_risk_entities]);

    const criticalCount = entities.filter(e => e.riskScore >= 90).length;
    const highRiskCount = entities.filter(e => e.riskScore >= 75 && e.riskScore < 90).length;

    return (
        <div className={`glass-card-elevated overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-6 lg:p-8 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/20">
                                <Users className="w-4 h-4 text-rose-400" />
                            </div>
                            <span className="text-overline">Risk Assessment</span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                            High-Risk Entities
                        </h3>
                        <p className="text-caption mt-1 max-w-md">
                            Entities requiring immediate attention based on AI risk scoring
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {criticalCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/25">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                <span className="text-xs font-bold text-red-400">
                                    {criticalCount} Critical
                                </span>
                            </div>
                        )}
                        <Link
                            href="/entities"
                            className="btn-primary text-sm flex items-center gap-1.5"
                        >
                            <span>View All</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-6 pb-6 border-b border-white/[0.06]">
                    <div>
                        <p className="text-2xl font-bold text-white">{entities.length}</p>
                        <p className="text-xs text-slate-400">Total Flagged</p>
                    </div>
                    <div className="w-px bg-white/[0.06]" />
                    <div>
                        <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
                        <p className="text-xs text-slate-400">Critical</p>
                    </div>
                    <div className="w-px bg-white/[0.06]" />
                    <div>
                        <p className="text-2xl font-bold text-amber-400">{highRiskCount}</p>
                        <p className="text-xs text-slate-400">High Risk</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 ml-auto text-sm text-slate-400">
                        <span>Avg Risk Score:</span>
                        <span className="font-bold text-white">
                            {Math.round(entities.reduce((acc, e) => acc + e.riskScore, 0) / entities.length)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Entity Grid */}
            <div className="p-6 lg:p-8 pt-6">
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    role="list"
                    aria-label="High-risk entities"
                >
                    {entities.map((entity, index) => (
                        <div
                            key={entity.id}
                            className="animate-scale-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <EntityCard
                                id={entity.id}
                                type={entity.type}
                                riskScore={entity.riskScore}
                                flags={entity.flags}
                                status={entity.status}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

EntityMonitoringSection.displayName = 'EntityMonitoringSection';

export default EntityMonitoringSection;
