'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
    Zap,
    FileSearch,
    Users,
    Shield,
    Settings,
    AlertTriangle,
    ChevronRight
} from 'lucide-react';
import { QUICK_ACTIONS } from '@/lib/constants';

/**
 * Props for the QuickActionsPanel component
 */
export interface QuickActionsPanelProps {
    className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-4 h-4" />,
    FileSearch: <FileSearch className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
    Shield: <Shield className="w-4 h-4" />,
    Settings: <Settings className="w-4 h-4" />,
    AlertTriangle: <AlertTriangle className="w-4 h-4" />,
};

/**
 * Premium quick actions panel with hover effects
 */
export const QuickActionsPanel = memo(function QuickActionsPanel({
    className = '',
}: QuickActionsPanelProps) {
    return (
        <div className={`glass-card p-5 lg:p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/25">
                        <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Quick Actions</h3>
                        <p className="text-xs text-slate-400">Common operations</p>
                    </div>
                </div>
            </div>

            {/* Actions grid */}
            <div className="grid grid-cols-2 gap-2" role="list" aria-label="Quick actions">
                {QUICK_ACTIONS.map((action, index) => (
                    <QuickActionCard
                        key={action.label}
                        label={action.label}
                        icon={ICON_MAP[action.icon] || <Zap className="w-4 h-4" />}
                        href={action.href}
                        count={'count' in action ? action.count : undefined}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
});

/**
 * Quick action card component
 */
interface QuickActionCardProps {
    label: string;
    icon: React.ReactNode;
    href: string;
    count?: number;
    index: number;
}

const QuickActionCard = memo(function QuickActionCard({
    label,
    icon,
    href,
    count,
    index
}: QuickActionCardProps) {
    return (
        <Link
            href={href}
            className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.12] transition-all duration-200 flex items-center gap-3"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <div className="p-2 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/15 transition-all duration-200">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors block truncate">
                    {label}
                </span>
                {count !== undefined && (
                    <span className="text-[10px] text-slate-500">{count} items</span>
                )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
    );
});

QuickActionsPanel.displayName = 'QuickActionsPanel';
QuickActionCard.displayName = 'QuickActionCard';

export default QuickActionsPanel;
