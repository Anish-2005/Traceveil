'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useNavbarScroll } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { BackgroundEffects } from '@/components';

export function Navbar() {
    const { user } = useAuth();
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

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileMenuOpen
                    ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.08]'
                    : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group relative z-50" onClick={() => setMobileMenuOpen(false)}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt="Traceveil"
                                    className={`relative transition-all duration-500 w-10 h-10 group-hover:scale-110`}
                                />
                            </div>
                            <span className="font-bold text-white tracking-tight text-xl sm:text-2xl">Traceveil</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {[
                                { href: '#features', label: 'Platform' },
                                { href: '#models', label: 'Technology' },
                                { href: '#stats', label: 'Company' },
                                { href: '/docs', label: 'Documentation' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-full transition-all"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="hidden md:flex items-center gap-4">
                            {!user ? (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="group flex items-center gap-2 pl-5 pr-2 py-1.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-slate-200 transition-all hover:scale-105"
                                    >
                                        <span>Get Started</span>
                                        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className="group flex items-center gap-2 pl-5 pr-2 py-1.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-slate-200 transition-all hover:scale-105"
                                >
                                    <span>Dashboard</span>
                                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                        <ChevronRight className="w-4 h-4" />
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
                className={`fixed inset-0 z-40 bg-[#030712] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
                    }`}
            >
                {/* Background Ambience */}
                <div className="absolute inset-0 opacity-50">
                    <BackgroundEffects />
                </div>

                <div className="h-full flex flex-col pt-24 px-6 pb-8 relative z-10 overflow-y-auto">
                    <nav className="flex-1 flex flex-col gap-2">
                        {[
                            { href: '#features', label: 'Platform', desc: 'Core capabilities & modules' },
                            { href: '#models', label: 'Technology', desc: 'AI models & architecture' },
                            { href: '#stats', label: 'Company', desc: 'About Traceveil & metric' },
                            { href: '/docs', label: 'Documentation', desc: 'API references & guides' },
                            ...(user ? [] : [{ href: '/login', label: 'Sign In', desc: 'Access your console' }]),
                        ].map((link, i) => (
                            <a
                                key={link.href}
                                href={link.href}
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
                            </a>
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
