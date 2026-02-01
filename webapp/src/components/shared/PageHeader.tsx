'use client';

/**
 * PageHeader - Production Grade
 * 
 * Ultra-minimal, developer-focused navigation header.
 * Designed for high-density information environments.
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Bell,
    Search,
    Command,
    X,
    Menu,
    Slash,
    ChevronDown
} from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/events', label: 'Events' },
    { href: '/settings', label: 'Settings' },
];

interface PageHeaderProps {
    alertCount?: number;
    actions?: React.ReactNode;
}

export function PageHeader({
    alertCount = 0,
    actions,
}: PageHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header
            className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030712]/80 backdrop-blur-md"
        >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="h-14 flex items-center justify-between gap-4">

                    {/* Left: Brand & Context */}
                    <div className="flex items-center gap-4 lg:gap-6">
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
                                    className="relative w-8 h-8 lg:w-9 lg:h-9 transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="block">
                                <span className="text-base lg:text-lg font-bold tracking-tight gradient-text-premium block leading-none">
                                    Traceveil
                                </span>
                            </div>
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
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'text-white bg-white/[0.06]'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                                        }
                                    `}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search */}
                        <div className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] text-xs text-slate-500 hover:border-white/[0.12] transition-colors cursor-text min-w-[200px]">
                            <Search className="w-3.5 h-3.5" />
                            <span>Search...</span>
                            <div className="ml-auto flex gap-1">
                                <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.05]">Ctrl</kbd>
                                <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.05]">K</kbd>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-white/[0.08] hidden lg:block" />

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-400 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Simple Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/[0.08] bg-[#030712] p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 rounded-lg bg-white/[0.03] text-sm font-medium text-slate-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
