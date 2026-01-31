import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export function CTASection() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl animate-pulse-glow" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 mb-8">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">Start Protecting Today</span>
                </div>

                <h2 className="scroll-reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                    Ready to Secure Your Platform?
                </h2>

                <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                    Join thousands of companies using Traceveil to detect and prevent fraud in real-time.
                    Start your free trial today.
                </p>

                <div className="scroll-reveal reveal-delay-3">
                    <Link
                        href="/dashboard"
                        className="magnetic-btn gap-3 text-xl py-5 px-10"
                    >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>

                <p className="scroll-reveal reveal-delay-4 text-sm text-slate-500 mt-6">
                    No credit card required • 14-day free trial • Cancel anytime
                </p>
            </div>
        </section>
    );
}
