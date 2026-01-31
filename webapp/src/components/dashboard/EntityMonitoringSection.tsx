'use client';

import { memo, useMemo } from 'react';
import { DashboardMetrics } from '@/lib/api';
import { EntityCard } from './EntityCard';
import {
    THREAT_DISPLAY_LIMITS,
    getStatusFromSeverity,
    DEFAULT_HIGH_RISK_ENTITIES,
} from '@/lib/constants';

/**
 * Props for the EntityMonitoringSection component
 */
export interface EntityMonitoringSectionProps {
    /** Dashboard metrics containing entity data */
    metrics: DashboardMetrics | null;
    /** Callback when "View All" is clicked */
    onViewAll?: () => void;
    /** Optional custom class names */
    className?: string;
}

/**
 * High-risk entities monitoring section
 * 
 * Features:
 * - Grid of high-risk entity cards
 * - Risk score visualization
 * - Status-based styling (blocked, monitoring, review)
 * - Flag indicators for threat types
 * - View All navigation
 */
export const EntityMonitoringSection = memo(function EntityMonitoringSection({
    metrics,
    onViewAll,
    className = '',
}: EntityMonitoringSectionProps) {
    // Memoize entity data
    const entities = useMemo(() => {
        const highRiskEntities = metrics?.high_risk_entities?.slice(0, THREAT_DISPLAY_LIMITS.entities);

        if (!highRiskEntities || highRiskEntities.length === 0) {
            return DEFAULT_HIGH_RISK_ENTITIES;
        }

        return highRiskEntities.map((entity) => {
            const riskScore = Math.round((entity.risk_score ?? 0) * 100);
            const status = getStatusFromSeverity(entity.severity ?? 'medium');
            const flags = entity.flags ?? [`Risk: ${riskScore}%`];

            return {
                id: entity.user_id ?? entity.id ?? 'Unknown',
                type: entity.event_type ?? 'User',
                riskScore,
                flags,
                status,
            };
        });
    }, [metrics?.high_risk_entities]);

    return (
        <section className={`relative group ${className}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            High-Risk Entities
                        </h3>
                        <p className="text-sm text-gray-400">
                            Entities requiring immediate attention
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onViewAll}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                    >
                        View All Entities
                    </button>
                </div>

                {/* Entity Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    role="list"
                    aria-label="High-risk entities requiring attention"
                >
                    {entities.map((entity, index) => (
                        <EntityCard
                            key={`entity-${entity.id}-${index}`}
                            id={entity.id}
                            type={entity.type}
                            riskScore={entity.riskScore}
                            flags={[...entity.flags]}
                            status={entity.status}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
});

EntityMonitoringSection.displayName = 'EntityMonitoringSection';

export default EntityMonitoringSection;
