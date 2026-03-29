'use client';

/**
 * PageHeader - Production Grade
 * 
 * Ultra-minimal, developer-focused navigation header.
 * Designed for high-density information environments.
 */

import { useEffect, useState } from 'react';
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
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
    href: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/events/new', label: 'Events' },
    { href: '/entities', label: 'Entities' },
    { href: '/models', label: 'Models' },
    { href: '/users', label: 'Users' },
    { href: '/docs', label: 'Docs' },
];

interface PageHeaderProps {
    alertCount?: number;
    actions?: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export function PageHeader({
    alertCount = 0,
    actions,
    title,
    subtitle,
}: PageHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => {
            setIsCompact(window.scrollY > 40);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[80] border-b app-header-surface backdrop-blur-md transition-all duration-300 ${
                    isCompact
                        ? 'border-white/[0.12] shadow-[0_10px_30px_rgba(2,6,23,0.55)]'
                        : 'border-white/[0.08]'
                }`}
            >
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${isCompact ? 'h-12' : 'h-14'}`}>

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
                                    className={`relative transition-all duration-300 group-hover:scale-110 ${isCompact ? 'w-7 h-7 lg:w-8 lg:h-8' : 'w-8 h-8 lg:w-9 lg:h-9'}`}
                                />
                            </div>
                            <div className="block">
                                <span className={`font-bold tracking-tight gradient-text-premium block leading-none transition-all duration-300 ${isCompact ? 'text-sm lg:text-base' : 'text-base lg:text-lg'}`}>
                                    Traceveil
                                </span>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center text-slate-600">
                            <Slash className="w-4 h-4 -rotate-12" />
                        </div>

                        {/* Workspace / Context Selector */}
                        {title ? (
                            <div className="hidden sm:flex flex-col">
                                <h1 className="text-sm font-bold text-slate-200 leading-tight">{title}</h1>
                                {subtitle && !isCompact && <span className="text-[10px] text-slate-500 font-medium leading-tight">{subtitle}</span>}
                            </div>
                        ) : (
                            <button className={`hidden lg:flex items-center gap-2 font-medium text-slate-300 hover:text-white transition-colors -ml-2 rounded-md hover:bg-white/[0.04] ${isCompact ? 'text-xs px-2 py-1' : 'text-sm px-2 py-1'}`}>
                                <span>Production</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                        )}
                    </div>

                    {/* Center: Minimal Navigation */}
                    <nav className={`hidden md:flex items-center absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${isCompact ? 'gap-0.5 px-1 py-1 rounded-full border border-white/[0.1] bg-white/[0.03]' : 'gap-1'}`}>
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        rounded-md font-medium transition-all duration-200
                                        ${isCompact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}
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
                        {actions && (
                            <div className="flex items-center mr-2">
                                {actions}
                            </div>
                        )}
                        {/* Search */}
                        <div className={`hidden lg:flex items-center rounded-md border border-white/[0.08] bg-white/[0.02] text-xs text-slate-500 hover:border-white/[0.12] transition-all cursor-text ${isCompact ? 'gap-1.5 px-2 py-1 min-w-[140px]' : 'gap-2 px-2 py-1.5 min-w-[200px]'}`}>
                            <Search className="w-3.5 h-3.5" />
                            {!isCompact && <span>Search...</span>}
                            <div className="ml-auto flex gap-1">
                                <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.05]">Ctrl</kbd>
                                <kbd className="px-1 rounded bg-white/[0.05] border border-white/[0.05]">K</kbd>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-white/[0.08] hidden lg:block" />

                        <ThemeToggle compact={isCompact} />

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
                    <div className="md:hidden border-t border-white/[0.08] app-header-mobile p-4 space-y-2">
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
            <div className={mobileMenuOpen ? 'h-[220px] md:h-14' : isCompact ? 'h-12' : 'h-14'} />
        </>
    );
}
