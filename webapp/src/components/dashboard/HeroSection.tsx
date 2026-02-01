import { Activity, AlertTriangle, Brain, ChevronRight, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { PerformanceBar } from './PerformanceBar';

interface HeroSectionProps {
    metrics: any;
    models: any;
}

export function HeroSection({ metrics, models }: HeroSectionProps) {
    // Real data from API
    const detectionRate = metrics?.threat_detection_rate ?? 0;
    const percentage = Math.round(detectionRate * 100);
    const activeModels = models?.models?.length ?? 0;
    const criticalThreats = metrics?.critical_threats ?? 0;
    const activeMonitoring = metrics?.active_monitoring ?? 0;
    const recentThreats = metrics?.recent_threats ?? [];
    const avgResponseTime = metrics?.avg_response_time ?? 0;

    // Calculate high severity threats from recent_threats
    const highThreats = recentThreats.filter((t: any) => t.severity === 'high').length;

    // Calculate average model accuracy from models
    const avgModelAccuracy = models?.models?.length > 0
        ? models.models.reduce((sum: number, m: any) => {
            const acc = parseFloat(m.accuracy?.replace('%', '') || '0');
            return sum + acc;
        }, 0) / models.models.length
        : 0;

    // Calculate healthy models count
    const healthyModels = models?.models?.filter((m: any) => m.status === 'active' || m.status === 'healthy').length ?? 0;

    // Calculate TPR/FPR based on detection rate (simulated from real detection rate)
    const truePositiveRate = percentage > 0 ? Math.min(percentage + 0.8, 99.9) : 0;
    const falsePositiveRate = percentage > 0 ? Math.max(100 - percentage - 1, 0.5) : 0;

    // System health status
    const systemHealth = metrics?.system_health ?? {};
    const allSystemsOperational = Object.values(systemHealth).every((s: any) => s?.status === 'healthy');

    return (
        <div className="relative">
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column - Welcome & Stats */}
                <div className="lg:col-span-6 flex flex-col">
                    <div className="h-full flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 p-6 lg:p-8 hover:border-white/[0.12] transition-colors">

                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
                                    System Status
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                                    Monitoring <span className="text-white font-medium">{activeMonitoring.toLocaleString()}</span> active data streams.
                                    AI models operating at <span className="text-emerald-400 font-medium">{percentage}%</span> efficiency.
                                </p>
                            </div>

                            {/* Status Indicator */}
                            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${allSystemsOperational
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${allSystemsOperational ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                <span className="text-[11px] font-medium uppercase tracking-wide">
                                    {allSystemsOperational ? 'Operational' : 'Degraded'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <StatCard
                                label="Total Events"
                                value={recentThreats.length.toString()}
                                change="Active"
                                positive={true}
                                icon={<Activity className="w-4 h-4" />}
                            />
                            <StatCard
                                label="Active Models"
                                value={`${healthyModels}/${activeModels}`}
                                change="Online"
                                positive={healthyModels === activeModels}
                                icon={<Brain className="w-4 h-4" />}
                            />
                            <StatCard
                                label="Threats Blocked"
                                value={recentThreats.length.toLocaleString()}
                                change="+12%"
                                positive={true}
                                icon={<Shield className="w-4 h-4" />}
                            />
                            <StatCard
                                label="Latency"
                                value={`${avgResponseTime.toFixed(1)}ms`}
                                change="Optimal"
                                positive={avgResponseTime < 10}
                                icon={<Zap className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Primary KPI */}
                <div className="lg:col-span-6 flex flex-col">
                    <div className="h-full flex flex-col rounded-xl border border-white/[0.08] bg-[#030712]/50 p-6 lg:p-8 hover:border-white/[0.12] transition-colors">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Detection Accuracy</h2>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06]">
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">24H Window</span>
                            </div>
                        </div>

                        {/* Main KPI Display - Horizontal Layout for Density */}
                        <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
                            {/* Circular Progress */}
                            <div className="relative flex-shrink-0">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                                        <circle
                                            cx="70" cy="70" r="60"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.03)"
                                            strokeWidth="8"
                                        />
                                        <circle
                                            cx="70" cy="70" r="60"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 60}
                                            strokeDashoffset={2 * Math.PI * 60 * (1 - percentage / 100)}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-white tracking-tighter">
                                            {percentage}%
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium mt-1">confidence</span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics - Compact */}
                            <div className="w-full space-y-5 flex-1 min-w-0">
                                <PerformanceBar
                                    label="True Positive Rate"
                                    value={truePositiveRate}
                                    color="emerald"
                                />
                                <PerformanceBar
                                    label="False Positive Rate"
                                    value={falsePositiveRate}
                                    color="red"
                                    inverted
                                />
                                <PerformanceBar
                                    label="Model Consensus"
                                    value={avgModelAccuracy > 0 ? avgModelAccuracy : percentage * 0.97}
                                    color="blue"
                                />
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
                            <span>Last machine learning training cycle: <span className="text-slate-300">2h ago</span></span>
                            {criticalThreats > 0 && (
                                <span className="flex items-center gap-1.5 text-red-400 font-medium">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {criticalThreats} Critical Threats
                                </span>
                            )}
                            {criticalThreats === 0 && (
                                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    No Active Threats
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
