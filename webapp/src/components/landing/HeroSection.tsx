import Link from 'next/link';
import { ArrowRight, Terminal, Shield, Cpu, Activity, Copy, Check } from 'lucide-react';
import { useCountUp } from '@/hooks';
import { useState } from 'react';

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-32 pb-20 lg:pt-20 lg:pb-32 overflow-hidden flex items-center bg-[#030712]">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Left Column: Technical Copy */}
                    <div className="flex-1 max-w-2xl">
                        <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v2.4.0 Stable
                        </div>

                        <h1 className="scroll-reveal reveal-delay-1 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
                            The security layer for <br />
                            <span className="text-slate-500">modern platforms.</span>
                        </h1>

                        <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
                            Traceveil provides real-time fraud detection APIs for fintech, crypto, and enterprise platforms.
                            <span className="text-slate-300"> Integrate in &lt;5ms.</span>
                        </p>

                        <div className="scroll-reveal reveal-delay-3 flex flex-col sm:flex-row items-center gap-4">
                            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm">
                                Start Building
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <div className="w-full sm:w-auto relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button className="relative w-full px-8 py-3.5 rounded-lg border border-white/10 bg-[#0a0f1a] text-slate-300 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Terminal className="w-4 h-4" />
                                    Read Documentation
                                </button>
                            </div>
                        </div>

                        <div className="scroll-reveal reveal-delay-4 mt-12 flex items-center gap-8 text-xs font-mono text-slate-500">
                            <span>// TRUSTED BY ENGINEERING TEAMS AT</span>
                        </div>
                        <div className="scroll-reveal reveal-delay-5 mt-4 flex flex-wrap gap-x-8 gap-y-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {['Mercury', 'Ramp', 'Vercel', 'Linear'].map(brand => (
                                <span key={brand} className="text-sm font-semibold text-white">{brand}</span>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Code/Terminal Visual */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none scroll-reveal-right">
                        <TerminalVisual />
                    </div>
                </div>
            </div>
        </section>
    );
}

function TerminalVisual() {
    const [copied, setCopied] = useState(false);
    const threats = useCountUp(847, 1500);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            {/* Subtle Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent rounded-xl blur-xl opacity-50" />

            {/* Terminal Window */}
            <div className="relative rounded-xl border border-white/[0.08] bg-[#0a0f1a] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
                {/* Window Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="text-slate-500">investigation.json</div>
                    <button onClick={handleCopy} className="text-slate-500 hover:text-white transition-colors">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                {/* Code Content */}
                <div className="p-6 overflow-x-auto">
                    <div className="space-y-1">
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">01</span>
                            <span className="text-purple-400">{"{"}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">02</span>
                            <span className="pl-4">
                                <span className="text-blue-400">"event_id"</span>: <span className="text-emerald-400">"evt_84729104"</span>,
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">03</span>
                            <span className="pl-4">
                                <span className="text-blue-400">"risk_score"</span>: <span className="text-rose-400 font-bold">0.98</span>,
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">04</span>
                            <span className="pl-4">
                                <span className="text-blue-400">"ip_address"</span>: <span className="text-emerald-400">"192.168.1.1"</span>,
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">05</span>
                            <span className="pl-4">
                                <span className="text-blue-400">"signals"</span>: [
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">06</span>
                            <span className="pl-8">
                                <span className="text-emerald-400">"velocity_check"</span>, <span className="text-emerald-400">"suspicious_device"</span>
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">07</span>
                            <span className="pl-4">],</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">08</span>
                            <span className="pl-4">
                                <span className="text-blue-400">"action"</span>: <span className="text-rose-400 font-bold">"BLOCK"</span>
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600 select-none">09</span>
                            <span className="text-purple-400">{"}"}</span>
                        </div>
                    </div>
                </div>

                {/* Status Footer */}
                <div className="px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-blue-500" />
                        <span>Processing: {(threats.count * 1.5).toFixed(0)} req/s</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        <span>Mode: Active Block</span>
                    </div>
                </div>
            </div>

            {/* Floating Tag */}
            <div className="absolute -right-4 top-12 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg backdrop-blur-md animate-bounce-subtle">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-400">Threat Detected</span>
                </div>
            </div>
        </div>
    );
}
