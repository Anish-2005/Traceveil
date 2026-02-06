import Link from 'next/link';
import { ArrowRight, Terminal, Shield, Cpu, Activity, Copy, Check, ChevronRight, Play } from 'lucide-react';
import { useCountUp } from '@/hooks';
import { useState } from 'react';

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-32 overflow-hidden flex items-center bg-[#030712]">
            {/* Premium Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" />
                <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]" />
            </div>
            <div className="absolute inset-0 bg-[#030712]/90 z-0" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Brand & Copy */}
                    <div className="flex-1 max-w-2xl text-center lg:text-left pt-8 lg:pt-0">
                        {/* New Status Pill */}
                        <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">v2.4 Is Live</span>
                            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                        </div>

                        <h1 className="scroll-reveal reveal-delay-1 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-8 leading-[1.1] lg:leading-[1.05]">
                            The security layer for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient pb-2">
                                modern platforms.
                            </span>
                        </h1>

                        <p className="scroll-reveal reveal-delay-2 text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Detect fraud in <span className="text-white font-semibold">real-time</span> with our distributed edge network.
                            Integrate our API in minutes, not months.
                        </p>

                        <div className="scroll-reveal reveal-delay-3 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link href="/dashboard" className="w-full sm:w-auto group relative px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                                Start Building
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button className="w-full sm:w-auto group px-8 py-4 rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.05] font-medium text-sm transition-all flex items-center justify-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.1] group-hover:bg-white/[0.2] transition-colors">
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                </span>
                                Watch Demo
                            </button>
                        </div>

                        <div className="scroll-reveal reveal-delay-4 mt-16 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-12">
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Trusted By</span>
                            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                                {['Mercury', 'Linear', 'Ramp', 'Vercel'].map(brand => (
                                    <span key={brand} className="text-sm font-bold text-white tracking-tight">{brand}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: High-Fidelity Terminal */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none scroll-reveal-right mt-10 lg:mt-0 relative group perspective-[2000px]">
                        {/* 3D Tilt Effect Container (Subtle) */}
                        <div className="relative transform transition-transform duration-700 hover:rotate-y-[2deg] hover:rotate-x-[2deg]">
                            <TerminalVisual />
                        </div>
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
        <div className="relative w-full">
            {/* Ambient Glow Behind Terminal */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

            {/* Main Window */}
            <div className="relative rounded-xl border border-white/[0.08] bg-[#0B0F19]/95 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/[0.05]">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/40 border border-white/[0.05] text-[10px] sm:text-xs font-mono text-slate-400">
                        <Terminal className="w-3 h-3" />
                        <span>security_protocol.json</span>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded hover:bg-white/[0.05] text-slate-500 hover:text-white transition-colors"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {/* Code Content */}
                <div className="p-4 sm:p-6 overflow-x-auto custom-scrollbar">
                    <pre className="font-mono text-[11px] sm:text-xs md:text-[13px] leading-relaxed">
                        <code className="block min-w-max">
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">1</span><span className="text-purple-400">{'{'}</span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">2</span><span className="pl-4"><span className="text-sky-400">"event_id"</span>: <span className="text-emerald-400">"evt_84729104"</span>,</span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">3</span><span className="pl-4"><span className="text-sky-400">"timestamp"</span>: <span className="text-amber-400">"{new Date().toISOString()}"</span>,</span></div>
                            <div className="flex bg-red-500/10 -mx-4 sm:-mx-6 px-4 sm:px-6 border-l-2 border-red-500/50"><span className="w-6 text-slate-700 select-none mr-2">4</span><span className="pl-4"><span className="text-sky-400">"risk_score"</span>: <span className="text-red-400 font-bold">0.98</span>,</span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">5</span><span className="pl-4"><span className="text-sky-400">"signals"</span>: [</span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">6</span><span className="pl-8"><span className="text-emerald-400">"velocity_check"</span>,</span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">7</span><span className="pl-8"><span className="text-emerald-400">"suspicious_device"</span></span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">8</span><span className="pl-4">],</span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">9</span><span className="pl-4"><span className="text-sky-400">"action"</span>: <span className="text-red-400 font-bold">"BLOCK"</span></span></div>
                            <div className="flex"><span className="w-6 text-slate-700 select-none mr-2">10</span><span className="text-purple-400">{'}'}</span></div>
                        </code>
                    </pre>
                </div>

                {/* Live Activity Footer */}
                <div className="px-4 py-2.5 bg-[#050912] border-t border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-mono">
                            <Activity className="w-3 h-3" />
                            <span className="animate-pulse">Analyzing Stream...</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Connected</span>
                    </div>
                </div>
            </div>

            {/* Floating Context Card (Desktop only/Responsive) */}
            <div className="absolute -right-4 md:-right-8 top-20 px-4 py-3 bg-[#1e293b]/90 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md animate-fade-up hidden sm:block">
                <div className="flex items-center gap-3 mb-1">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-white">Anomalous Activity</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">IP: 192.168.1.1 blocked</div>
            </div>
        </div>
    );
}
