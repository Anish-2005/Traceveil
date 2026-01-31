'use client';

import { memo } from 'react';
import { Eye, Lock, BarChart3, Sparkles, LucideIcon } from 'lucide-react';
import { QuickAction } from './QuickAction';
import { QUICK_ACTIONS } from '@/lib/constants';

/**
 * Props for the QuickActionsPanel component
 */
export interface QuickActionsPanelProps {
    /** Callback when an action is clicked */
    onActionClick?: (actionLabel: string) => void;
    /** Optional custom class names */
    className?: string;
}

/** Icon mapping for quick actions */
const ICON_MAP: Record<string, LucideIcon> = {
    Eye,
    Lock,
    BarChart3,
    Sparkles,
};

/**
 * Quick actions panel for common dashboard operations
 * 
 * Features:
 * - Common action shortcuts
 * - Badge counts for items requiring attention
 * - Keyboard accessible buttons
 * - Configurable via constants
 */
export const QuickActionsPanel = memo(function QuickActionsPanel({
    onActionClick,
    className = '',
}: QuickActionsPanelProps) {
    return (
        <div className={`relative group ${className}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
            />

            <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-4">
                    Quick Actions
                </h3>

                {/* Actions List */}
                <div
                    className="space-y-2"
                    role="list"
                    aria-label="Quick action shortcuts"
                >
                    {QUICK_ACTIONS.map((action) => {
                        const IconComponent = ICON_MAP[action.icon];
                        return (
                            <QuickAction
                                key={action.label}
                                icon={<IconComponent className="w-4 h-4" />}
                                label={action.label}
                                count={action.count}
                                onClick={() => onActionClick?.(action.label)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

QuickActionsPanel.displayName = 'QuickActionsPanel';

export default QuickActionsPanel;
