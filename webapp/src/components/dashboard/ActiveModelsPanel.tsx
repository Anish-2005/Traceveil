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
        <div className={`glass-card p-5 lg:p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/25">
                        <Brain className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">ML Models</h3>
                        <p className="text-xs text-slate-400">
                            {deployedCount} deployed, {modelsList.length - deployedCount} training
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 transition-all duration-200 group"
                    aria-label="Deploy new model"
                >
                    <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
                </button>
            </div>

            {/* Models list */}
            <div className="space-y-3" role="list" aria-label="Active ML models">
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
            <button
                type="button"
                className="w-full mt-4 py-3 text-sm font-semibold text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
            >
                Manage Models
            </button>
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
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group"
            role="listitem"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors truncate">
                    {name}
                </span>
                <span className={`
          flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
          ${isDeployed
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-violet-500/15 text-violet-400 border border-violet-500/25'
                    }
        `}>
                    {isDeployed ? (
                        <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Live</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-3 h-3" />
                            <span>Training</span>
                        </>
                    )}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${accuracy >= 95
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                            : accuracy >= 90
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            }`}
                        style={{ width: `${accuracy}%` }}
                    />
                </div>
                <span className="text-xs font-semibold text-slate-300 tabular-nums w-12 text-right">
                    {accuracy.toFixed(1)}%
                </span>
            </div>
        </div>
    );
});

ActiveModelsPanel.displayName = 'ActiveModelsPanel';
ModelCard.displayName = 'ModelCard';

export default ActiveModelsPanel;
