import { Shield, Zap, Lock, Eye, Network, BarChart3, Fingerprint, Globe } from 'lucide-react';

export function FeaturesSection() {
    const features = [
        {
            title: "Real-time Detection",
            description: "Sub-millisecond latency threat identification using distributed edge nodes.",
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            colSpan: "md:col-span-2",
            delay: "reveal-delay-1"
        },
        {
            title: "Behavioral Biometrics",
            description: "Analyze user interactions to distinguish humans from bots.",
            icon: <Fingerprint className="w-5 h-5 text-blue-500" />,
            colSpan: "md:col-span-1",
            delay: "reveal-delay-2"
        },
        {
            title: "Global Intelligence",
            description: "Shared threat signals from over 50,000+ deployments worldwide.",
            icon: <Globe className="w-5 h-5 text-emerald-500" />,
            colSpan: "md:col-span-1",
            delay: "reveal-delay-3"
        },
        {
            title: "Graph Neural Networks",
            description: "Detect complex fraud rings and money laundering schemes.",
            icon: <Network className="w-5 h-5 text-purple-500" />,
            colSpan: "md:col-span-2",
            delay: "reveal-delay-4"
        }
    ];

    return (
        <section id="features" className="py-24 sm:py-32 bg-[#030712] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="scroll-reveal max-w-2xl mb-16 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Engineered for Scale
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Our infrastructure processes billions of events daily with zero downtime.
                        Built for mission-critical applications where failure is not an option.
                    </p>
                </div>

                <div className="bg-white/[0.05] border border-white/[0.05] grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`scroll-reveal ${feature.delay} ${feature.colSpan} group relative p-8 sm:p-10 bg-[#0a0f1a] hover:bg-[#0f1623] transition-colors duration-300`}
                        >
                            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
