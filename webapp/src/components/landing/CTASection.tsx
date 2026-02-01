import Link from 'next/link';
import { ArrowRight, Check, Mail } from 'lucide-react';

export function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden bg-[#030712] border-t border-white/[0.05]">
            {/* Minimal Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="scroll-reveal text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                    Ready to secure your <br />
                    <span className="text-slate-500">infrastructure?</span>
                </h2>

                <p className="scroll-reveal reveal-delay-1 text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                    Deploy Traceveil in minutes. Get full visibility into your threat landscape with our enterprise-grade detection engine.
                </p>

                {/* Minimal Input or Button Group */}
                <div className="scroll-reveal reveal-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="email"
                            className="block w-full pl-10 pr-3 py-3.5 border border-white/10 rounded-xl leading-5 bg-white/[0.03] text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 transition-colors sm:text-sm"
                            placeholder="Enter your work email"
                        />
                    </div>
                    <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="scroll-reveal reveal-delay-3 mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>No credit card required</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
