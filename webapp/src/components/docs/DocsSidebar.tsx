'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Code, Shield, Activity, Users, Settings, ChevronRight, Menu as MenuIcon, X, Search } from 'lucide-react';

const sections = [
    {
        title: 'Getting Started',
        items: [
            { label: 'Introduction', href: '/docs', icon: Book },
            { label: 'Quick Start', href: '/docs/quick-start', icon: Activity },
            { label: 'Architecture', href: '/docs/architecture', icon: Shield },
        ]
    },
    {
        title: 'Core Concepts',
        items: [
            { label: 'Threat Detection', href: '/docs/threat-detection', icon: Shield },
            { label: 'User Risk Scoring', href: '/docs/risk-scoring', icon: Users },
            { label: 'Event Ingestion', href: '/docs/ingestion', icon: Code },
        ]
    },
    {
        title: 'API Reference',
        items: [
            { label: 'Authentication', href: '/docs/api/auth', icon: Shield },
            { label: 'Endpoints', href: '/docs/api/endpoints', icon: Code },
            { label: 'SDKs', href: '/docs/api/sdks', icon: Settings },
        ]
    }
];

export function DocsSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    const filteredSections = useMemo(() => {
        if (!query.trim()) return sections;
        const q = query.toLowerCase();
        return sections
            .map((section) => ({
                ...section,
                items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
            }))
            .filter((section) => section.items.length > 0);
    }, [query]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all active:scale-95"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed top-14 bottom-0 left-0 w-72 border-r border-white/[0.08] bg-[#020712]/95 backdrop-blur-xl overflow-y-auto transform transition-transform duration-300 z-40 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-5 space-y-6">
                    <div className="space-y-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Browse Docs</p>
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search pages..."
                                className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/40"
                            />
                        </div>
                    </div>

                    {filteredSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                                ? 'bg-blue-500/12 text-blue-300 border border-blue-500/20'
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                                                }`}
                                        >
                                            <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'
                                                }`} />
                                            <span>{item.label}</span>
                                            {isActive && (
                                                <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {filteredSections.length === 0 && (
                        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-sm text-slate-500">
                            No docs page matched "{query}".
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
