'use client';

import { memo } from 'react';
import { DashboardModels } from '@/lib/api';
import { ModelCard } from './ModelCard';
import { DEFAULT_MODELS } from '@/lib/constants';

/**
 * Props for the ActiveModelsPanel component
 */
export interface ActiveModelsPanelProps {
    /** Dashboard models data */
    models: DashboardModels | null;
    /** Optional custom class names */
    className?: string;
}

/**
 * Panel displaying active ML models and their status
 * 
 * Features:
 * - Model cards with version and accuracy
 * - Deployed vs training status indicators
 * - Automatic fallback to default demo models
 * - Smooth hover animations
 */
export const ActiveModelsPanel = memo(function ActiveModelsPanel({
    models,
    className = '',
}: ActiveModelsPanelProps) {
    const modelList = models?.models ?? DEFAULT_MODELS;

    return (
        <div className={`relative group ${className}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-6">
                    Active Models
                </h3>

                {/* Models List */}
                <div
                    className="space-y-4"
                    role="list"
                    aria-label="Active machine learning models"
                >
                    {modelList.map((model, index) => (
                        <ModelCard
                            key={`model-${model.name}-${index}`}
                            name={model.name}
                            version={model.version}
                            accuracy={model.accuracy}
                            status={model.status as 'deployed' | 'training'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

ActiveModelsPanel.displayName = 'ActiveModelsPanel';

export default ActiveModelsPanel;
