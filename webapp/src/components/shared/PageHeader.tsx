'use client';

/**
 * PageHeader - Shared navigation header for all pages
 * 
 * Matches the premium styling of the main dashboard header
 * with glassmorphism, responsive navigation, and mobile menu.
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    AlertTriangle,
    Bell,
    Search,
    ChevronDown,
    Settings,
    Command,
    X,
    Menu,
    Home,
    BarChart3,
    Brain,
    Users,
    Zap
} from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { href: '/', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/models', label: 'Models', icon: <Brain className="w-4 h-4" /> },
    { href: '/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { href: '/events/new', label: 'Events', icon: <Zap className="w-4 h-4" /> },
];

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    alertCount?: number;
    actions?: React.ReactNode;
}

export function PageHeader({
    title,
    subtitle,
    alertCount = 0,
    actions,
}: PageHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

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
                            {navItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
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

                        {/* Settings */}
                        <button
                            type="button"
                            className="hidden sm:flex p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 group"
                            aria-label="Settings"
                        >
                            <Settings className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </button>

                        {/* Custom Actions Slot */}
                        {actions}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-slate-400" />
                            ) : (
                                <Menu className="w-5 h-5 text-slate-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-white/[0.06] bg-[#030712]/95 backdrop-blur-xl">
                    <nav className="max-w-[1600px] mx-auto px-4 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                        }
                  `}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default PageHeader;
