import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface FooterStatsBarProps {
    lastUpdated: Date;
    metrics: any;
}

export function FooterStatsBar({ lastUpdated, metrics }: FooterStatsBarProps) {
    // Calculate uptime from system health
    const systemHealth = metrics?.system_health ?? {};
    const healthyCount = Object.values(systemHealth).filter((s: any) => s?.status === 'healthy').length;
    const totalCount = Object.keys(systemHealth).length || 1;
    const uptimePercentage = ((healthyCount / totalCount) * 100).toFixed(1);

    return (
        <div className="glass-card p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-slate-400">
                            Last updated:{' '}
                            <time className="text-white font-medium" dateTime={lastUpdated.toISOString()}>
                                {lastUpdated.toLocaleTimeString()}
                            </time>
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-slate-400">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>{uptimePercentage}% uptime ({healthyCount}/{totalCount} systems healthy)</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-ghost text-sm flex items-center gap-2">
                        <span>View Analytics</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button className="btn-primary text-sm">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
}
