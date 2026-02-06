'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Code, Shield, Activity, Users, Settings, ChevronRight, Menu as MenuIcon, X } from 'lucide-react';

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

            <aside className={`fixed top-16 bottom-0 left-0 w-64 border-r border-white/[0.08] bg-[#030712]/95 backdrop-blur-xl overflow-y-auto transform transition-transform duration-300 z-40 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 space-y-8">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
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
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
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
                </div>
            </aside>
        </>
    );
}
