'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useNavbarScroll } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { BackgroundEffects } from '@/components';
import { ThemeToggle } from '@/components/shared';

export function Navbar() {
    const { user } = useAuth();
    const pathname = usePathname();
    const scrolled = useNavbarScroll();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: '#features', label: 'Platform' },
        { href: '#models', label: 'Technology' },
        { href: '#stats', label: 'Company' },
        { href: '/docs', label: 'Documentation' },
    ];

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-[70] px-2 sm:px-4 pt-2 transition-all duration-300"
            >
                <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl border transition-all duration-300 ${
                    scrolled || mobileMenuOpen
                        ? 'app-nav-surface-strong border-white/[0.12] backdrop-blur-2xl shadow-[0_12px_40px_rgba(2,6,23,0.55)]'
                        : 'app-nav-surface border-white/[0.07] backdrop-blur-xl'
                }`}>
                    <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'}`}>
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group relative z-50" onClick={() => setMobileMenuOpen(false)}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt="Traceveil"
                                    className={`relative transition-all duration-300 group-hover:scale-110 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-bold text-white tracking-tight transition-all duration-300 ${scrolled ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
                                    Traceveil
                                </span>
                                <span className={`hidden lg:block text-[10px] text-slate-500 uppercase tracking-[0.14em] transition-all duration-300 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                                    Real-time Risk Intelligence
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className={`hidden lg:flex items-center transition-all duration-300 ${scrolled ? 'gap-0.5 px-1 py-1 rounded-full border border-white/[0.1] bg-white/[0.03]' : 'gap-1'}`}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href.startsWith('#') && pathname !== '/' ? `/${link.href}` : link.href}
                                    className={`font-medium text-slate-400 hover:text-white hover:bg-white/[0.07] rounded-full transition-all ${scrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="hidden md:flex items-center gap-3">
                            <ThemeToggle compact={scrolled} />
                            {!user ? (
                                <>
                                    <Link
                                        href="/login"
                                        className={`font-medium text-slate-400 hover:text-white transition-colors ${scrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className={`group flex items-center gap-2 bg-white text-black rounded-full font-semibold hover:bg-slate-200 transition-all ${scrolled ? 'pl-3 pr-1.5 py-1 text-xs' : 'pl-5 pr-2 py-1.5 text-sm hover:scale-105'}`}
                                    >
                                        <span>{scrolled ? 'Start' : 'Get Started'}</span>
                                        <div className={`rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 ${scrolled ? 'w-5 h-5' : 'w-7 h-7'}`}>
                                            <ChevronRight className={scrolled ? 'w-3 h-3' : 'w-4 h-4'} />
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className={`group flex items-center gap-2 bg-white text-black rounded-full font-semibold hover:bg-slate-200 transition-all ${scrolled ? 'pl-3 pr-1.5 py-1 text-xs' : 'pl-5 pr-2 py-1.5 text-sm hover:scale-105'}`}
                                >
                                    <span>Dashboard</span>
                                    <div className={`rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 ${scrolled ? 'w-5 h-5' : 'w-7 h-7'}`}>
                                        <ChevronRight className={scrolled ? 'w-3 h-3' : 'w-4 h-4'} />
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden relative z-50 p-2 text-slate-400 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-6 flex items-center justify-center relative">
                                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
                                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Premium Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 app-mobile-overlay transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
                    }`}
            >
                {/* Background Ambience */}
                <div className="absolute inset-0 opacity-50">
                    <BackgroundEffects />
                </div>

                <div className="h-full flex flex-col pt-24 px-6 pb-8 relative z-10 overflow-y-auto">
                    <div className="mb-6">
                        <ThemeToggle />
                    </div>
                    <nav className="flex-1 flex flex-col gap-2">
                        {[
                            { href: '#features', label: 'Platform', desc: 'Core capabilities & modules' },
                            { href: '#models', label: 'Technology', desc: 'AI models & architecture' },
                            { href: '#stats', label: 'Company', desc: 'About Traceveil & metric' },
                            { href: '/docs', label: 'Documentation', desc: 'API references & guides' },
                            ...(user ? [] : [{ href: '/login', label: 'Sign In', desc: 'Access your console' }]),
                        ].map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href.startsWith('#') && pathname !== '/' ? `/${link.href}` : link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all duration-300"
                                style={{
                                    opacity: mobileMenuOpen ? 1 : 0,
                                    transform: `translateY(${mobileMenuOpen ? 0 : 20}px)`,
                                    transitionDelay: `${100 + (i * 50)}ms`
                                }}
                            >
                                <div>
                                    <span className="block text-2xl font-light tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                        {link.label}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1 block group-hover:text-slate-400 transition-colors">
                                        {link.desc}
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </nav>

                    <div
                        className="mt-8"
                        style={{
                            opacity: mobileMenuOpen ? 1 : 0,
                            transform: `translateY(${mobileMenuOpen ? 0 : 20}px)`,
                            transitionDelay: '400ms'
                        }}
                    >
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                        >
                            <span>{user ? 'Go to Dashboard' : 'Start Building Now'}</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Uptime</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                <div className="text-2xl font-bold text-white mb-1">&lt;5ms</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Latency</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
