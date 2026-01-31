'use client';

import { memo } from 'react';
import { DashboardMetrics } from '@/lib/api';
import { SystemStatus } from './SystemStatus';
import { DEFAULT_SYSTEM_HEALTH } from '@/lib/constants';

/**
 * Props for the SystemHealthPanel component
 */
export interface SystemHealthPanelProps {
    /** Dashboard metrics containing system health data */
    metrics: DashboardMetrics | null;
    /** Optional custom class names */
    className?: string;
}

/**
 * System health monitoring panel showing status of all infrastructure components
 * 
 * Features:
 * - Individual status indicators for each service
 * - Overall system status summary
 * - Color-coded status (operational, degraded, offline)
 * - Automatic fallback to default values
 */
export const SystemHealthPanel = memo(function SystemHealthPanel({
    metrics,
    className = '',
}: SystemHealthPanelProps) {
    const systemHealth = metrics?.system_health;

    // Determine overall system status
    const allOperational = !systemHealth || Object.values(systemHealth).every(
        (service) => service.status === 'operational'
    );

    return (
        <div className={`relative group ${className}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-6">
                    System Status
                </h3>

                {/* Status List */}
                <div
                    className="space-y-4"
                    role="list"
                    aria-label="System component status"
                >
                    <SystemStatus
                        label="API Gateway"
                        status={systemHealth?.api_gateway?.status ?? DEFAULT_SYSTEM_HEALTH.apiGateway.status}
                        value={systemHealth?.api_gateway?.value ?? DEFAULT_SYSTEM_HEALTH.apiGateway.value}
                    />
                    <SystemStatus
                        label="ML Inference Engine"
                        status={systemHealth?.ml_inference_engine?.status ?? DEFAULT_SYSTEM_HEALTH.mlInferenceEngine.status}
                        value={systemHealth?.ml_inference_engine?.value ?? DEFAULT_SYSTEM_HEALTH.mlInferenceEngine.value}
                    />
                    <SystemStatus
                        label="Data Pipeline"
                        status={systemHealth?.data_pipeline?.status ?? DEFAULT_SYSTEM_HEALTH.dataPipeline.status}
                        value={systemHealth?.data_pipeline?.value ?? DEFAULT_SYSTEM_HEALTH.dataPipeline.value}
                    />
                    <SystemStatus
                        label="Redis Cache"
                        status={systemHealth?.redis_cache?.status ?? DEFAULT_SYSTEM_HEALTH.redisCache.status}
                        value={systemHealth?.redis_cache?.value ?? DEFAULT_SYSTEM_HEALTH.redisCache.value}
                    />
                    <SystemStatus
                        label="Graph Database"
                        status={systemHealth?.graph_database?.status ?? DEFAULT_SYSTEM_HEALTH.graphDatabase.status}
                        value={systemHealth?.graph_database?.value ?? DEFAULT_SYSTEM_HEALTH.graphDatabase.value}
                    />
                </div>

                {/* Overall Status */}
                <div className="mt-6 pt-6 border-t border-white/5">
                    <div
                        className="flex items-center justify-between text-sm"
                        role="status"
                        aria-label={`Overall system status: ${allOperational ? 'All systems operational' : 'Some systems degraded'}`}
                    >
                        <span className="text-gray-400">System Status</span>
                        <span className={`font-semibold ${allOperational ? 'text-green-400' : 'text-amber-400'}`}>
                            {allOperational ? 'All Systems Operational' : 'Systems Degraded'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

SystemHealthPanel.displayName = 'SystemHealthPanel';

export default SystemHealthPanel;
