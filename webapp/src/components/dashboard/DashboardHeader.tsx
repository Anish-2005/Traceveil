'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    Sparkles,
    Bell,
    Search,
    ChevronDown,
    Settings,
    Command,
    Slash,
    Menu,
    X,
    Plus
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

/**
 * Props for the DashboardHeader component
 */
export interface DashboardHeaderProps {
    /** Number of active alerts to display in badge */
    alertCount?: number;
    /** Callback when deploy model button is clicked */
    onDeployModel?: () => void;
    /** Currently active navigation item */
    activeNavItem?: string;
}

/**
 * Premium dashboard header with navigation, search, and action buttons
 * 
 * Features:
 * - Ultra-minimal developer aesthetic
 * - High-density information layout
 * - Context-aware navigation
 */
export const DashboardHeader = memo(function DashboardHeader({
    alertCount = 1,
    onDeployModel,
    activeNavItem = 'Overview',
}: DashboardHeaderProps) {
    return (
        <header
            className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030712]/80 backdrop-blur-md"
            role="banner"
        >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="h-14 flex items-center justify-between gap-4">

                    {/* Left: Brand & Context */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        <Link href="/" className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt=""
                                    aria-hidden="true"
                                    className="relative w-6 h-6 lg:w-7 lg:h-7"
                                />
                            </div>
                            <span className="font-semibold text-sm text-white tracking-tight">Traceveil</span>
                        </Link>

                        <div className="hidden lg:flex items-center text-slate-600">
                            <Slash className="w-4 h-4 -rotate-12" />
                        </div>

                        {/* Workspace / Context Selector */}
                        <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1 -ml-2 rounded-md hover:bg-white/[0.04]">
                            <span>Production</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                    </div>

                    {/* Center: Minimal Navigation */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.label === activeNavItem;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`
                                        px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'text-white bg-white/[0.06]'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                                        }
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search */}
                        <div className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] text-xs text-slate-500 hover:border-white/[0.12] transition-colors cursor-text min-w-[180px]">
                            <Search className="w-3.5 h-3.5" />
                            <span>Search...</span>
                            <div className="ml-auto flex gap-1">
                                <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.05]">Ctrl</kbd>
                                <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.05]">K</kbd>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-white/[0.08] hidden lg:block" />

                        {/* Settings */}
                        <button
                            type="button"
                            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                            aria-label="Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        {/* Notifications */}
                        <button
                            type="button"
                            className="relative p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                            aria-label={`View notifications (${alertCount} new)`}
                        >
                            <Bell className="w-4 h-4" />
                            {alertCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#030712]" />
                            )}
                        </button>

                        {/* Deploy Model Action */}
                        {onDeployModel && (
                            <button
                                type="button"
                                onClick={onDeployModel}
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-md text-xs font-semibold hover:bg-slate-200 transition-colors"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Deploy</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
