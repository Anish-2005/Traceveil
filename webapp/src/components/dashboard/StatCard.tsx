import { Activity, Brain, Shield, Zap } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: React.ReactNode;
}

export function StatCard({ label, value, change, positive, icon }: StatCardProps) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-blue-400 transition-colors">
                    {icon}
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${positive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                    }`}>
                    {change}
                </span>
            </div>
            <p className="text-xs text-slate-400 mb-0.5">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    );
}
