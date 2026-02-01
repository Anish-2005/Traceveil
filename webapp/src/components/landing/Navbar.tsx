import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, Terminal, ChevronRight } from 'lucide-react';
import { useNavbarScroll } from '@/hooks';

export function Navbar() {
    const scrolled = useNavbarScroll();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-[#030712]/80 backdrop-blur-md border-b border-white/[0.08]'
                    : 'bg-transparent py-2'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="/traceveil-logo.svg"
                                    alt="Traceveil"
                                    className={`relative transition-all duration-500 w-8 h-8 group-hover:scale-110`}
                                />
                            </div>
                            <span className="font-semibold text-white tracking-tight">Traceveil</span>
                        </Link>

                        {/* Desktop Nav Links - Minimal Text */}
                        <div className="hidden lg:flex items-center gap-8">
                            {[
                                { href: '#features', label: 'Platform' },
                                { href: '#models', label: 'Technology' },
                                { href: '#stats', label: 'Company' },
                                { href: 'https://docs.traceveil.com', label: 'Documentation' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 bg-white text-black rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                <span>Get Started</span>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Simple Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#030712] pt-24 px-6 space-y-4">
                    {[
                        { href: '#features', label: 'Platform' },
                        { href: '#models', label: 'Technology' },
                        { href: '#stats', label: 'Company' },
                        { href: '/docs', label: 'Documentation' },
                        { href: '/login', label: 'Sign In' },
                    ].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-2xl font-medium text-white py-4 border-b border-white/[0.08]"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-4 mt-8 rounded-xl bg-white text-black font-semibold"
                    >
                        Start Free Trial
                    </Link>
                </div>
            )}
        </>
    );
}
