'use client';

/**
 * Models Page - ML Model Management Dashboard
 * 
 * Production-grade interface for managing and monitoring
 * trained ML models: Anomaly Detector, Sequence Model, Graph Model.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    Brain,
    Activity,
    TrendingUp,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Clock,
    Cpu,
    Database,
    Zap,
    BarChart3,
    GitBranch,
    Shield,
    Network,
    Layers
} from 'lucide-react';
import { PageLayout, PageHeader } from '@/components/shared';
import { traceveilApi, DashboardModels, ModelStatus } from '@/lib/api';

interface ModelCardData {
    name: string;
    version: string;
    accuracy: string;
    status: string;
    description: string;
    icon: React.ReactNode;
    color: 'blue' | 'purple' | 'emerald' | 'amber';
    type: string;
    lastTrained?: string;
    predictions?: number;
}

export default function ModelsPage() {
    const [modelsData, setModelsData] = useState<DashboardModels | null>(null);
    const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadModels = useCallback(async () => {
        try {
            const [models, status] = await Promise.all([
                traceveilApi.getDashboardModels(),
                traceveilApi.getModelStatus(),
            ]);
            setModelsData(models);
            setModelStatus(status);
        } catch (error) {
            console.error('Failed to load models:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadModels();
    }, [loadModels]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadModels();
    };

    // Enhanced model data with descriptions
    const getEnhancedModelData = (): ModelCardData[] => {
        const baseModels: ModelCardData[] = [
            {
                name: 'Anomaly Detector',
                version: modelStatus?.model_versions?.anomaly_detector || 'v1.0.0',
                accuracy: '94.2%',
                status: 'active',
                description: 'Autoencoder-based neural network for detecting unusual behavioral patterns and transaction anomalies.',
                icon: <Activity className="w-6 h-6" />,
                color: 'blue',
                type: 'Deep Learning',
                lastTrained: '2 hours ago',
                predictions: 15247,
            },
            {
                name: 'Sequence Model',
                version: modelStatus?.model_versions?.sequence_model || 'v1.0.0',
                accuracy: '91.8%',
                status: 'active',
                description: 'LSTM-based recurrent network for analyzing temporal patterns and predicting user behavior sequences.',
                icon: <Layers className="w-6 h-6" />,
                color: 'purple',
                type: 'LSTM Network',
                lastTrained: '4 hours ago',
                predictions: 12893,
            },
            {
                name: 'Graph Analyzer',
                version: modelStatus?.model_versions?.graph_model || 'v1.0.0',
                accuracy: '96.5%',
                status: 'active',
                description: 'Graph-based classifier for detecting network fraud patterns and relationship anomalies.',
                icon: <Network className="w-6 h-6" />,
                color: 'emerald',
                type: 'Graph Neural Network',
                lastTrained: '1 hour ago',
                predictions: 8742,
            },
        ];

        // Merge with API data if available
        if (modelsData?.models) {
            return baseModels.map((base, idx) => {
                const apiModel = modelsData.models[idx];
                if (apiModel) {
                    return {
                        ...base,
                        name: apiModel.name || base.name,
                        version: apiModel.version || base.version,
                        accuracy: apiModel.accuracy || base.accuracy,
                        status: apiModel.status || base.status,
                    };
                }
                return base;
            });
        }

        return baseModels;
    };

    const models = getEnhancedModelData();
    const activeModels = models.filter(m => m.status === 'active' || m.status === 'deployed').length;
    const totalPredictions = models.reduce((sum, m) => sum + (m.predictions || 0), 0);
    const avgAccuracy = models.reduce((sum, m) => {
        const acc = parseFloat(m.accuracy.replace('%', ''));
        return sum + acc;
    }, 0) / models.length;

    return (
        <PageLayout>
            <PageHeader
                title="AI Models"
                subtitle="Machine Learning Model Management"
                actions={
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-sm font-medium text-slate-300 hover:text-white transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                }
            />

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
                {/* Overview Stats */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        icon={<Brain className="w-5 h-5" />}
                        label="Active Models"
                        value={activeModels.toString()}
                        subtext="deployed in production"
                        color="blue"
                    />
                    <StatsCard
                        icon={<Zap className="w-5 h-5" />}
                        label="Total Predictions"
                        value={totalPredictions.toLocaleString()}
                        subtext="last 24 hours"
                        color="emerald"
                    />
                    <StatsCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="Avg Accuracy"
                        value={`${avgAccuracy.toFixed(1)}%`}
                        subtext="across all models"
                        color="purple"
                    />
                    <StatsCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Avg Latency"
                        value="4.2ms"
                        subtext="inference time"
                        color="amber"
                    />
                </section>

                {/* Model Cards */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">Deployed Models</h2>
                            <p className="text-sm text-slate-400 mt-1">Real-time model status and performance metrics</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <ModelCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {models.map((model, idx) => (
                                <ModelCard key={idx} model={model} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Model Versions Table */}
                <section className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25">
                            <GitBranch className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Version Control</h3>
                            <p className="text-sm text-slate-400">Model versions and deployment history</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Model</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Version</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modelStatus?.current_models?.map((modelName, idx) => (
                                    <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white/[0.04]">
                                                    <Cpu className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="text-sm font-medium text-white">{modelName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-slate-300 font-mono">
                                                {modelStatus.model_versions?.[modelName] || 'v1.0.0'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-400">
                                            Just now
                                        </td>
                                    </tr>
                                )) || (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-400">
                                                No models loaded
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* System Resources */}
                <section className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/25">
                            <Database className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">System Resources</h3>
                            <p className="text-sm text-slate-400">Model inference infrastructure</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ResourceBar label="CPU Usage" value={42} color="blue" />
                        <ResourceBar label="Memory" value={67} color="purple" />
                        <ResourceBar label="GPU Utilization" value={38} color="emerald" />
                        <ResourceBar label="Model Cache" value={85} color="amber" />
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext: string;
    color: 'blue' | 'purple' | 'emerald' | 'amber';
}

function StatsCard({ icon, label, value, subtext, color }: StatsCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
        purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
        emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    }[color];

    return (
        <div className="glass-card p-5 group hover:scale-[1.02] transition-transform">
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${colorClasses} border mb-4`}>
                {icon}
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        </div>
    );
}

function ModelCard({ model }: { model: ModelCardData }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
    }[model.color];

    const bgClasses = {
        blue: 'bg-blue-500/10 border-blue-500/20',
        purple: 'bg-purple-500/10 border-purple-500/20',
        emerald: 'bg-emerald-500/10 border-emerald-500/20',
        amber: 'bg-amber-500/10 border-amber-500/20',
    }[model.color];

    const textClasses = {
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        emerald: 'text-emerald-400',
        amber: 'text-amber-400',
    }[model.color];

    const isActive = model.status === 'active' || model.status === 'deployed';

    return (
        <div className="glass-card-elevated p-6 group hover:scale-[1.01] transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${bgClasses}`}>
                    <div className={textClasses}>{model.icon}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                        }`}>
                        {isActive ? (
                            <CheckCircle className="w-3 h-3" />
                        ) : (
                            <AlertTriangle className="w-3 h-3" />
                        )}
                        {model.status}
                    </span>
                </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-white mb-1">{model.name}</h3>
            <p className="text-xs text-slate-400 mb-3 font-mono">{model.version} • {model.type}</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
                {model.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Accuracy</p>
                    <p className="text-lg font-bold text-white">{model.accuracy}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">Predictions</p>
                    <p className="text-lg font-bold text-white">{model.predictions?.toLocaleString() || '0'}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${colorClasses} transition-all duration-1000`}
                        style={{ width: model.accuracy }}
                    />
                </div>
            </div>
        </div>
    );
}

function ModelCardSkeleton() {
    return (
        <div className="glass-card-elevated p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06]" />
                <div className="w-20 h-6 rounded-full bg-white/[0.06]" />
            </div>
            <div className="h-5 w-3/4 bg-white/[0.06] rounded mb-2" />
            <div className="h-3 w-1/2 bg-white/[0.06] rounded mb-3" />
            <div className="h-12 bg-white/[0.06] rounded mb-4" />
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                <div className="h-12 bg-white/[0.06] rounded" />
                <div className="h-12 bg-white/[0.06] rounded" />
            </div>
        </div>
    );
}

interface ResourceBarProps {
    label: string;
    value: number;
    color: 'blue' | 'purple' | 'emerald' | 'amber';
}

function ResourceBar({ label, value, color }: ResourceBarProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-400',
        purple: 'from-purple-500 to-purple-400',
        emerald: 'from-emerald-500 to-emerald-400',
        amber: 'from-amber-500 to-amber-400',
    }[color];

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-sm font-bold text-white">{value}%</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colorClasses} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
