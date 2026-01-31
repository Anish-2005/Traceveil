import Link from 'next/link';
import {
    Sparkles, ArrowRight, Play, ShieldCheck, Lock, Brain, Target, Shield,
    Activity, Zap, Award, Globe, ChevronRight
} from 'lucide-react';
import { useCountUp } from '@/hooks';

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-32 lg:pt-40 pb-20 overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                    }}
                />
                {/* Scanning Line Animation */}
                <div
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                    style={{
                        animation: 'scan 4s linear infinite',
                        top: '20%',
                    }}
                />
                {/* Pulsing Radar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                    <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-radar-ping" />
                    <div className="absolute inset-[80px] rounded-full border border-blue-500/10 animate-radar-ping" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute inset-[160px] rounded-full border border-blue-500/10 animate-radar-ping" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top Section - Status Bar */}
                <div className="scroll-reveal flex items-center justify-center gap-4 mb-12">
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0a1628] border border-white/[0.08]">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                            <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">System Status: <span className="text-emerald-400 font-bold">Operational</span></span>
                        <span className="text-slate-600">|</span>
                        <span className="text-sm text-slate-400">Threats Blocked Today: <span className="text-white font-bold">2,847</span></span>
                    </div>
                </div>

                {/* Main Hero Content - Centered */}
                <div className="text-center max-w-5xl mx-auto">
                    {/* Headline with Typewriter Effect Look */}
                    <div className="scroll-reveal reveal-delay-1 mb-8">
                        <div className="inline-block mb-4">
                            <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                                {'>'} TRACEVEIL.INIT()
                            </span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95]">
                            <span className="block text-white mb-2">REAL-TIME</span>
                            <span className="block gradient-text-animated">THREAT DETECTION</span>
                        </h1>
                    </div>

                    {/* Subheadline */}
                    <p className="scroll-reveal reveal-delay-2 text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        AI-powered security that analyzes <span className="text-white font-medium">10M+ events per second</span>,
                        identifying threats <span className="text-cyan-400 font-medium">before they strike</span>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="scroll-reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/dashboard" className="magnetic-btn gap-3 text-lg py-4 px-10">
                            <span>Access Command Center</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] text-slate-300 hover:text-white font-medium text-lg transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <Play className="w-4 h-4 text-blue-400" />
                            </div>
                            <span>See Live Demo</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Stats Panel */}
                <div className="scroll-reveal reveal-delay-4 max-w-6xl mx-auto">
                    <HeroCommandPanel />
                </div>
            </div>

            {/* Add scan animation keyframe */}
            <style jsx>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
        </section>
    );
}

function HeroCommandPanel() {
    const accuracy = useCountUp(99, 2500);
    const threats = useCountUp(2847, 2000);
    const latency = useCountUp(4, 1500);

    return (
        <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />

            {/* Main Panel */}
            <div className="relative glass-card-elevated overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs font-mono text-slate-500">traceveil://command-center</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                        <div className="relative">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
                    {/* Stat Cells */}
                    <CommandStat
                        label="Detection Accuracy"
                        value={<><span ref={accuracy.ref} className="counter-number">{accuracy.count}</span>.7%</>}
                        icon={<Target className="w-5 h-5" />}
                        color="blue"
                        detail="Neural networks active"
                    />
                    <CommandStat
                        label="Threats Neutralized"
                        value={<span ref={threats.ref} className="counter-number">{threats.count.toLocaleString()}</span>}
                        icon={<Shield className="w-5 h-5" />}
                        color="emerald"
                        detail="Last 24 hours"
                    />
                    <CommandStat
                        label="Response Latency"
                        value={<><span ref={latency.ref} className="counter-number">{latency.count}</span>ms</>}
                        icon={<Zap className="w-5 h-5" />}
                        color="amber"
                        detail="P99 performance"
                    />

                    {/* Mini Activity Graph */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium text-slate-400">Threat Activity</span>
                            <span className="text-xs text-emerald-400 font-semibold">↓ 23%</span>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                            {[35, 55, 40, 70, 45, 60, 30, 80, 50, 55, 65, 35, 75, 45, 60].map((height, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-sm bg-gradient-to-t from-blue-600/60 to-cyan-400/80 hover:from-blue-500 hover:to-cyan-300 transition-all cursor-pointer"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.06] bg-white/[0.01]">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            SOC 2 Type II
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-blue-400" />
                            AES-256 Encrypted
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-purple-400" />
                            Global CDN
                        </span>
                    </div>
                    <Link href="/dashboard" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                        Open Full Dashboard
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

interface CommandStatProps {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    color: 'blue' | 'emerald' | 'amber' | 'purple';
    detail: string;
}

function CommandStat({ label, value, icon, color, detail }: CommandStatProps) {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    };

    return (
        <div className="p-6 group hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg border ${colors[color]}`}>
                    {icon}
                </div>
                <span className="text-xs font-medium text-slate-400">{label}</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-xs text-slate-500">{detail}</div>
        </div>
    );
}
