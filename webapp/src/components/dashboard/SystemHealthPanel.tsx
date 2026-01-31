'use client';

import { memo } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    XCircle,
    Cpu,
    Database,
    Wifi,
    HardDrive,
    Activity
} from 'lucide-react';
import { DashboardMetrics } from '@/lib/api';
import { DEFAULT_SYSTEM_HEALTH } from '@/lib/constants';

/**
 * Props for the SystemHealthPanel component
 */
export interface SystemHealthPanelProps {
    metrics: DashboardMetrics | null;
    className?: string;
}

/**
 * Premium system health monitoring panel
 */
export const SystemHealthPanel = memo(function SystemHealthPanel({
    metrics,
    className = '',
}: SystemHealthPanelProps) {
    const systemHealth = metrics?.system_health;

    const services = [
        {
            name: 'API Gateway',
            icon: <Wifi className="w-4 h-4" />,
            status: systemHealth?.api_gateway?.status ?? DEFAULT_SYSTEM_HEALTH.apiGateway.status,
            value: systemHealth?.api_gateway?.value ?? DEFAULT_SYSTEM_HEALTH.apiGateway.value,
        },
        {
            name: 'ML Inference',
            icon: <Cpu className="w-4 h-4" />,
            status: systemHealth?.ml_inference_engine?.status ?? DEFAULT_SYSTEM_HEALTH.mlInferenceEngine.status,
            value: systemHealth?.ml_inference_engine?.value ?? DEFAULT_SYSTEM_HEALTH.mlInferenceEngine.value,
        },
        {
            name: 'Data Pipeline',
            icon: <Activity className="w-4 h-4" />,
            status: systemHealth?.data_pipeline?.status ?? DEFAULT_SYSTEM_HEALTH.dataPipeline.status,
            value: systemHealth?.data_pipeline?.value ?? DEFAULT_SYSTEM_HEALTH.dataPipeline.value,
        },
        {
            name: 'Redis Cache',
            icon: <HardDrive className="w-4 h-4" />,
            status: systemHealth?.redis_cache?.status ?? DEFAULT_SYSTEM_HEALTH.redisCache.status,
            value: systemHealth?.redis_cache?.value ?? DEFAULT_SYSTEM_HEALTH.redisCache.value,
        },
        {
            name: 'Graph DB',
            icon: <Database className="w-4 h-4" />,
            status: systemHealth?.graph_database?.status ?? DEFAULT_SYSTEM_HEALTH.graphDatabase.status,
            value: systemHealth?.graph_database?.value ?? DEFAULT_SYSTEM_HEALTH.graphDatabase.value,
        },
    ];

    const allOperational = services.every(s => s.status === 'operational');
    const operationalCount = services.filter(s => s.status === 'operational').length;

    return (
        <div className={`glass-card p-5 lg:p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${allOperational ? 'bg-emerald-500/15 border-emerald-500/25' : 'bg-amber-500/15 border-amber-500/25'} border`}>
                        {allOperational ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">System Status</h3>
                        <p className="text-xs text-slate-400">
                            {operationalCount}/{services.length} services online
                        </p>
                    </div>
                </div>

                {/* Overall status badge */}
                <div className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${allOperational
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    }
        `}>
                    {allOperational ? 'All Healthy' : 'Degraded'}
                </div>
            </div>

            {/* Services list */}
            <div className="space-y-2" role="list" aria-label="System services status">
                {services.map((service, index) => (
                    <ServiceRow
                        key={service.name}
                        name={service.name}
                        icon={service.icon}
                        status={service.status}
                        value={service.value}
                        index={index}
                    />
                ))}
            </div>

            {/* Uptime stats */}
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">30-day Uptime</span>
                    <span className="font-bold text-emerald-400">99.97%</span>
                </div>
                <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                        style={{ width: '99.97%' }}
                    />
                </div>
            </div>
        </div>
    );
});

/**
 * Service row component
 */
interface ServiceRowProps {
    name: string;
    icon: React.ReactNode;
    status: string;
    value: string;
    index: number;
}

const ServiceRow = memo(function ServiceRow({ name, icon, status, value, index }: ServiceRowProps) {
    const isOperational = status === 'operational';

    const StatusIcon = isOperational ? CheckCircle2 : status === 'degraded' ? AlertCircle : XCircle;
    const statusColor = isOperational ? 'text-emerald-400' : status === 'degraded' ? 'text-amber-400' : 'text-red-400';

    return (
        <div
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group"
            role="listitem"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-slate-300 transition-colors">
                    {icon}
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {name}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">{value}</span>
                <StatusIcon className={`w-4 h-4 ${statusColor}`} />
            </div>
        </div>
    );
});

SystemHealthPanel.displayName = 'SystemHealthPanel';
ServiceRow.displayName = 'ServiceRow';

export default SystemHealthPanel;
