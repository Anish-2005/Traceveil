import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Brain, BarChart3, Activity, Menu, X } from 'lucide-react';
import { useNavbarScroll } from '@/hooks';

export function Navbar() {
    const scrolled = useNavbarScroll();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'py-3 bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.08]'
                    : 'py-5 bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt="Traceveil"
                                    className={`relative transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'
                                        } group-hover:scale-110`}
                                />
                            </div>
                            <span className={`font-bold gradient-text-animated transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'
                                }`}>
                                Traceveil
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {[
                                { href: '#features', label: 'Features' },
                                { href: '#models', label: 'AI Models' },
                                { href: '#stats', label: 'Performance' },
                                { href: '/dashboard', label: 'Dashboard' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-6 transition-all duration-300" />
                                </a>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors touch-target"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                                <span />
                                <span />
                                <span />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
}

function MobileMenu({ open, onClose }: MobileMenuProps) {
    // Don't render anything when menu is closed
    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                style={{ animation: 'fade-up 0.3s ease-out' }}
            />

            {/* Menu Panel */}
            <div
                className="fixed top-0 right-0 bottom-0 w-[280px] z-50 bg-[#0a0f1a] border-l border-white/[0.08]"
                style={{ animation: 'slide-in-right 0.3s ease-out' }}
            >
                <div className="p-6 pt-20 space-y-6">
                    {[
                        { href: '#features', label: 'Features', icon: <Sparkles className="w-5 h-5" /> },
                        { href: '#models', label: 'AI Models', icon: <Brain className="w-5 h-5" /> },
                        { href: '#stats', label: 'Performance', icon: <BarChart3 className="w-5 h-5" /> },
                        { href: '/dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
                    ].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
                        >
                            <span className="text-blue-400">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </a>
                    ))}

                    <div className="pt-6 border-t border-white/[0.08]">
                        <Link
                            href="/dashboard"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold"
                        >
                            <span>Launch Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
