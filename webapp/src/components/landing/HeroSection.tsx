import Link from 'next/link';
import {
    Sparkles, ArrowRight, Play, ShieldCheck, Lock, Brain, Target, Shield,
    Activity, Zap, Award, Globe, ChevronRight
} from 'lucide-react';
import { useCountUp } from '@/hooks';

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-32 overflow-hidden flex items-center">
            {/* Minimal Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Column: Minimal Text */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Live Threat Intelligence
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            Secure your platform <br />
                            <span className="text-slate-500">in millseconds.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Enterprise-grade fraud detection powered by advanced behavioral AI.
                            Stop threats before they impact your business.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-colors flex items-center justify-center gap-2">
                                <Play className="w-4 h-4 fill-current" />
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-8">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <ShieldCheck className="w-4 h-4" />
                                <span>SOC 2 Compliant</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Lock className="w-4 h-4" />
                                <span>End-to-End Encrypted</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Abstract Visual */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none">
                        <HeroVisual />
                    </div>
                </div>
            </div>
        </section>
    );
}

function HeroVisual() {
    const accuracy = useCountUp(99, 2000);
    const threats = useCountUp(847, 1500);

    return (
        <div className="relative">
            {/* Reduced Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-30" />

            {/* Main Surface */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-white">Live Monitor</div>
                            <div className="text-xs text-slate-500">us-east-1</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-500">Active</span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-xs text-slate-400 mb-1">Threats Blocked</div>
                        <div className="text-2xl font-semibold text-white">
                            <span ref={threats.ref}>{threats.count}</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-xs text-slate-400 mb-1">Accuracy</div>
                        <div className="text-2xl font-semibold text-white">
                            <span ref={accuracy.ref}>{accuracy.count}</span>.9%
                        </div>
                    </div>
                </div>

                {/* Graph Representation */}
                <div className="relative h-32 w-full flex items-end justify-between gap-1">
                    {[40, 70, 45, 90, 60, 80, 50, 75, 60, 85, 55, 95, 65, 80, 50, 70, 45, 90, 60, 75].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-blue-500/20 rounded-t-sm"
                            style={{
                                height: `${h}%`,
                                opacity: Math.max(0.3, i / 20)
                            }}
                        />
                    ))}
                    {/* Overlay Line */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] to-transparent opacity-20" />
                </div>
            </div>

            {/* Floating Element */}
            <div className="absolute -bottom-6 -left-6 p-4 rounded-xl border border-white/10 bg-[#0a0f1a] shadow-xl flex items-center gap-3 animate-bounce-subtle">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="text-sm font-semibold text-white">Protected</div>
                </div>
            </div>
        </div>
    );
}
