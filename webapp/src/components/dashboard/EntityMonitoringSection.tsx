'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { Users, ArrowUpRight, AlertTriangle, Shield } from 'lucide-react';
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
        const highRiskEntities = metrics?.high_risk_entities ?? [];

        return highRiskEntities.slice(0, 4).map((entity) => {
            const severity = getSeverityFromScore(entity.risk_score);
            const status = getStatusFromSeverity(severity);

            return {
                id: entity.id,
                type: entity.event_type || 'Entity',
                riskScore: Math.round(entity.risk_score * 100),
                flags: [...(entity.flags || [])].slice(0, 3),
                status,
                explanation: entity.explanation,
            };
        });
    }, [metrics?.high_risk_entities]);

    const criticalCount = entities.filter(e => e.riskScore >= 90).length;
    const highRiskCount = entities.filter(e => e.riskScore >= 75 && e.riskScore < 90).length;

    return (
        <div className={`flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 overflow-hidden hover:border-white/[0.12] transition-colors ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-overline">Risk Assessment</span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            Real-Time Entity Monitoring
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {criticalCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                <span className="text-xs font-bold text-red-400">
                                    {criticalCount} Critical
                                </span>
                            </div>
                        )}
                        <Link
                            href="/entities"
                            className="btn-ghost text-sm flex items-center gap-1.5"
                        >
                            <span>View All</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Stats bar - Minimal */}
                <div className="flex items-center gap-8 text-sm">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white">{entities.length}</span>
                        <span className="text-xs text-slate-500">Active</span>
                    </div>
                    <div className="w-px h-8 bg-white/[0.06]" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-red-400">{criticalCount}</span>
                        <span className="text-xs text-slate-500">Critical</span>
                    </div>
                    <div className="w-px h-8 bg-white/[0.06]" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-amber-400">{highRiskCount}</span>
                        <span className="text-xs text-slate-500">High Risk</span>
                    </div>
                </div>
            </div>

            {/* Entity Grid */}
            <div className="p-6 bg-[#030712]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {entities.length > 0 ? (
                        entities.map((entity, index) => (
                            <div
                                key={entity.id}
                                className="scroll-reveal"
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <EntityCard
                                    id={entity.id}
                                    type={entity.type}
                                    riskScore={entity.riskScore}
                                    flags={entity.flags}
                                    status={entity.status}
                                    explanation={entity.explanation}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                <Shield className="w-8 h-8 opacity-50" />
                                <span className="text-sm font-medium">No entities detected yet</span>
                                <span className="text-xs opacity-60 max-w-xs">Values will appear here when traffic is detected by the system.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

EntityMonitoringSection.displayName = 'EntityMonitoringSection';

export default EntityMonitoringSection;
