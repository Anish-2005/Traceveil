'use client';

import { memo } from 'react';
import Link from 'next/link';
import { AlertTriangle, Sparkles } from 'lucide-react';
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
 * Main dashboard header with navigation, branding, and action buttons
 * 
 * Features:
 * - Responsive navigation with active state
 * - Alert notification badge with pulse animation
 * - Deploy model CTA button
 * - Sticky positioning with backdrop blur
 * - Full keyboard accessibility
 */
export const DashboardHeader = memo(function DashboardHeader({
    alertCount = 1,
    onDeployModel,
    activeNavItem = 'Overview',
}: DashboardHeaderProps) {
    return (
        <header
            className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/10 dark:border-white/10 shadow-sm"
            role="banner"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo and Brand */}
                <Link
                    href="/"
                    className="flex items-center gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded-lg"
                    aria-label="Traceveil Home"
                >
                    <img
                        src="/traceveil-logo.svg"
                        alt=""
                        aria-hidden="true"
                        className="w-10 h-10 transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-400 to-slate-200 bg-clip-text text-transparent select-none">
                        Traceveil
                    </span>
                </Link>

                {/* Navigation */}
                <nav
                    className="hidden md:flex items-center gap-1"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.label === activeNavItem;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`
                  px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 
                  focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 
                  dark:focus-visible:ring-offset-slate-950/80
                  ${isActive
                                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-500/5 dark:hover:bg-blue-500/10'
                                    }
                `}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Alert Button */}
                    <button
                        type="button"
                        className="relative p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/30 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                        aria-label={`View alerts (${alertCount} active)`}
                    >
                        <AlertTriangle className="w-5 h-5 text-red-400" aria-hidden="true" />
                        {alertCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 flex items-center justify-center"
                                aria-hidden="true"
                            >
                                <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75" />
                                <span className="relative w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
                            </span>
                        )}
                    </button>

                    {/* Deploy Model Button */}
                    <button
                        type="button"
                        onClick={onDeployModel}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-md hover:from-blue-500 hover:to-cyan-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                            <span>Deploy Model</span>
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
