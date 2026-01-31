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
    Command
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
 * - Glassmorphism design with backdrop blur
 * - Keyboard shortcut hints
 * - Search command palette trigger
 * - Responsive navigation
 * - Premium animations
 */
export const DashboardHeader = memo(function DashboardHeader({
    alertCount = 1,
    onDeployModel,
    activeNavItem = 'Overview',
}: DashboardHeaderProps) {
    return (
        <header
            className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl backdrop-saturate-150"
            role="banner"
        >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="h-16 lg:h-[72px] flex items-center justify-between gap-4">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                            aria-label="Traceveil Home"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt=""
                                    aria-hidden="true"
                                    className="relative w-9 h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg lg:text-xl font-bold tracking-tight gradient-text-premium">
                                    Traceveil
                                </span>
                                <span className="hidden lg:block text-[10px] font-medium text-slate-500 uppercase tracking-wider -mt-0.5">
                                    Security Platform
                                </span>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav
                            className="hidden lg:flex items-center gap-1"
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
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      ${isActive
                                                ? 'text-white'
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                            }
                    `}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 lg:gap-3">
                        {/* Search Command */}
                        <button
                            type="button"
                            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 group"
                            aria-label="Open search (Ctrl+K)"
                        >
                            <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                            <span className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                                Search...
                            </span>
                            <kbd className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-medium text-slate-500">
                                <Command className="w-3 h-3" />
                                <span>K</span>
                            </kbd>
                        </button>

                        {/* Notifications */}
                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 group"
                            aria-label={`View notifications (${alertCount} new)`}
                        >
                            <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            {alertCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-[#030712]">
                                    {alertCount > 9 ? '9+' : alertCount}
                                </span>
                            )}
                        </button>

                        {/* Alert Button */}
                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30 transition-all duration-200 group"
                            aria-label={`View alerts (${alertCount} critical)`}
                        >
                            <AlertTriangle className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                            {alertCount > 0 && (
                                <span
                                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"
                                    aria-hidden="true"
                                />
                            )}
                        </button>

                        {/* Settings */}
                        <button
                            type="button"
                            className="hidden sm:flex p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 group"
                            aria-label="Settings"
                        >
                            <Settings className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </button>

                        {/* Deploy Model Button */}
                        <button
                            type="button"
                            onClick={onDeployModel}
                            className="hidden sm:flex btn-primary text-sm gap-2"
                        >
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                            <span>Deploy Model</span>
                        </button>

                        {/* Mobile Menu */}
                        <button
                            type="button"
                            className="lg:hidden p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200"
                            aria-label="Open menu"
                        >
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
