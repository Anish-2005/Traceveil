'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import {
    Zap,
    FileSearch,
    Users,
    Shield,
    Settings,
    AlertTriangle,
    ChevronRight,
    Play
} from 'lucide-react';
import { QUICK_ACTIONS } from '@/lib/constants';
import { EventSimulator } from './EventSimulator';

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
    Play: <Play className="w-4 h-4" />,
};

/**
 * Premium quick actions panel with hover effects
 */
export const QuickActionsPanel = memo(function QuickActionsPanel({
    className = '',
}: QuickActionsPanelProps) {
    const [showSimulator, setShowSimulator] = useState(false);

    return (
        <>
            <div className={`flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 overflow-hidden hover:border-white/[0.12] transition-colors ${className}`}>
                {/* Header */}
                <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-white">Quick Actions</h3>
                        <p className="text-xs text-slate-400">Common tasks</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.04]">
                        <Zap className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                {/* Actions grid */}
                <div className="grid grid-cols-2 gap-2 p-4" role="list" aria-label="Quick actions">
                    {QUICK_ACTIONS.map((action, index) => (
                        <QuickActionCard
                            key={action.label}
                            label={action.label}
                            icon={ICON_MAP[action.icon] || <Zap className="w-4 h-4" />}
                            href={action.href}
                            count={'count' in action ? action.count : undefined}
                            index={index}
                            onClick={action.href === '#simulate' ? (e) => {
                                e.preventDefault();
                                setShowSimulator(true);
                            } : undefined}
                        />
                    ))}
                </div>
            </div>

            <EventSimulator
                isOpen={showSimulator}
                onClose={() => setShowSimulator(false)}
            />
        </>
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
    onClick?: (e: React.MouseEvent) => void;
}

const QuickActionCard = memo(function QuickActionCard({
    label,
    icon,
    href,
    count,
    index,
    onClick
}: QuickActionCardProps) {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="group flex flex-col p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200 scroll-reveal text-left w-full h-full"
                style={{ transitionDelay: `${index * 30}ms` }}
            >
                <div className="flex items-start justify-between mb-2 w-full">
                    <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                        {icon}
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>

                <div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors block truncate">
                        {label}
                    </span>
                    {count !== undefined && (
                        <span className="text-[10px] text-slate-500">{count} items</span>
                    )}
                </div>
            </button>
        );
    }

    return (
        <Link
            href={href}
            className="group flex flex-col p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200 scroll-reveal"
            style={{ transitionDelay: `${index * 30}ms` }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                    {icon}
                </div>
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>

            <div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors block truncate">
                    {label}
                </span>
                {count !== undefined && (
                    <span className="text-[10px] text-slate-500">{count} items</span>
                )}
            </div>
        </Link>
    );
});

QuickActionsPanel.displayName = 'QuickActionsPanel';
QuickActionCard.displayName = 'QuickActionCard';

export default QuickActionsPanel;
