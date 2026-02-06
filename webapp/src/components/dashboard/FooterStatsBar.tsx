'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';

interface FooterStatsBarProps {
    lastUpdated: Date;
    metrics: any;
}

export function FooterStatsBar({ lastUpdated, metrics }: FooterStatsBarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate uptime from system health
    const systemHealth = metrics?.system_health ?? {};
    const healthyCount = Object.values(systemHealth).filter((s: any) => s?.status === 'healthy').length;
    const totalCount = Object.keys(systemHealth).length || 1;
    const uptimePercentage = ((healthyCount / totalCount) * 100).toFixed(1);

    return (
        <div className="border-t border-white/[0.06] pt-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>
                            System Status: <span className="text-emerald-500 font-medium">Functional</span>
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{uptimePercentage}% uptime</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                        <span>Last sync: {mounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hover:text-white transition-colors">Privacy Policy</button>
                    <button className="hover:text-white transition-colors">Support</button>
                    <span className="text-slate-700">|</span>
                    <span className="opacity-60">v2.4.0-stable</span>
                </div>
            </div>
        </div>
    );
}
