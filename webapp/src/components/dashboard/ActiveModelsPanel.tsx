'use client';

import { memo } from 'react';
import { Brain, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { DashboardModels } from '@/lib/api';

/**
 * Props for the ActiveModelsPanel component
 */
export interface ActiveModelsPanelProps {
    models: DashboardModels | null;
    className?: string;
}

/**
 * Premium active models panel with enhanced visualizations
 */
export const ActiveModelsPanel = memo(function ActiveModelsPanel({
    models,
    className = '',
}: ActiveModelsPanelProps) {
    const modelsList = models?.models ?? [
        { name: 'Anomaly Detector v3', status: 'deployed', accuracy: 96.8 },
        { name: 'Behavior Profiler', status: 'deployed', accuracy: 94.2 },
        { name: 'Risk Scorer v2', status: 'training', accuracy: 91.5 },
    ];

    const deployedCount = modelsList.filter(m => m.status === 'deployed').length;

    return (
        <div className={`flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 overflow-hidden hover:border-white/[0.12] transition-colors ${className}`}>
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-white">ML Models</h3>
                    <p className="text-xs text-slate-400">{deployedCount} active, {modelsList.length - deployedCount} training</p>
                </div>
                <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
                    aria-label="Deploy new model"
                >
                    <Sparkles className="w-4 h-4" />
                </button>
            </div>

            {/* Models list */}
            <div className="p-4 space-y-3" role="list" aria-label="Active ML models">
                {modelsList.map((model, index) => (
                    <ModelCard
                        key={model.name}
                        name={model.name}
                        status={model.status}
                        accuracy={typeof model.accuracy === 'string' ? parseFloat(model.accuracy) : model.accuracy}
                        index={index}
                    />
                ))}
            </div>

            {/* View all link */}
            <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.04]">
                <button
                    type="button"
                    className="w-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    MANAGE MODELS
                </button>
            </div>
        </div>
    );
});

/**
 * Model card component
 */
interface ModelCardProps {
    name: string;
    status: string;
    accuracy: number;
    index: number;
}

const ModelCard = memo(function ModelCard({ name, status, accuracy, index }: ModelCardProps) {
    const isDeployed = status === 'deployed';

    return (
        <div
            className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group scroll-reveal"
            role="listitem"
            style={{ transitionDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                    {name}
                </span>
                <span className={`
                    flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
                    ${isDeployed ? 'text-emerald-500' : 'text-amber-500'}
                `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDeployed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    {isDeployed ? 'Live' : 'Training'}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${accuracy >= 95
                            ? 'bg-emerald-500'
                            : accuracy >= 90
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                        style={{ width: `${accuracy}%` }}
                    />
                </div>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {accuracy.toFixed(1)}%
                </span>
            </div>
        </div>
    );
});

ActiveModelsPanel.displayName = 'ActiveModelsPanel';
ModelCard.displayName = 'ModelCard';

export default ActiveModelsPanel;
