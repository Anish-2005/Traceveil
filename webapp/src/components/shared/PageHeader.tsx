'use client';

/**
 * PageHeader - Shared navigation header for all pages
 * 
 * Provides consistent navigation with premium styling,
 * breadcrumbs, and mobile-responsive menu.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Shield,
    BarChart3,
    Users,
    Zap,
    Brain,
    Menu,
    X,
    ChevronRight,
    Bell,
    Home
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
    title: string;
    subtitle?: string;
    alertCount?: number;
    actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, alertCount = 0, actions }: PageHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/80 border-b border-white/[0.06]">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-white tracking-tight">Traceveil</span>
                                <span className="text-lg font-light text-blue-400 ml-1">AI</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Page Title (centered on desktop) */}
                    <div className="hidden lg:flex flex-col items-center absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-lg font-bold text-white">{title}</h1>
                        {subtitle && (
                            <p className="text-xs text-slate-400">{subtitle}</p>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Alert Badge */}
                        {alertCount > 0 && (
                            <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all group">
                                <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                                    {alertCount > 9 ? '9+' : alertCount}
                                </span>
                            </button>
                        )}

                        {/* Custom Actions */}
                        {actions}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-slate-400" />
                            ) : (
                                <Menu className="w-5 h-5 text-slate-400" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Page Title */}
                <div className="lg:hidden pb-4 -mt-2">
                    <h1 className="text-lg font-bold text-white">{title}</h1>
                    {subtitle && (
                        <p className="text-xs text-slate-400">{subtitle}</p>
                    )}
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
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-50" />
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
