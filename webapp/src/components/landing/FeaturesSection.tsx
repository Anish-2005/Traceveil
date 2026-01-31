import { Cpu, Brain, Zap, Shield, BarChart3, Globe, Fingerprint, Lock, Search } from 'lucide-react';

export function FeaturesSection() {
    const features = [
        {
            icon: <Brain className="w-6 h-6" />,
            title: 'AI-Powered Detection',
            description: 'Deep learning models analyze behavioral patterns to identify threats before they materialize.',
            className: 'lg:col-span-2',
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Real-Time Analysis',
            description: 'Sub-millisecond threat detection with streaming data processing.',
            className: 'lg:col-span-1',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Fraud Prevention',
            description: 'Block fraudulent transactions with 99.7% accuracy.',
            className: 'lg:col-span-1',
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: 'Advanced Analytics',
            description: 'Comprehensive dashboards with real-time metrics.',
            className: 'lg:col-span-1',
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: 'Global Threat Intel',
            description: 'Cross-reference events against global threat databases.',
            className: 'lg:col-span-1',
        },
        {
            icon: <Fingerprint className="w-6 h-6" />,
            title: 'Behavioral Biometrics',
            description: 'Detect account takeovers with advanced user behavior analysis and fingerprinting techniques.',
            className: 'lg:col-span-2',
        },
    ];

    return (
        <section id="features" className="py-24 lg:py-32 relative bg-[#030712]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Minimal Section Header */}
                <div className="mb-16 md:mb-24 max-w-3xl">
                    <h2 className="scroll-reveal text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
                        Engineered for <br />
                        <span className="text-slate-500">uncompromising security.</span>
                    </h2>
                    <p className="scroll-reveal reveal-delay-1 text-lg text-slate-400 leading-relaxed max-w-2xl">
                        We've built the most advanced threat detection engine in the industry.
                        Powered by next-gen AI, tailored for enterprise scale.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {features.map((feature, i) => (
                        <BentoCard
                            key={feature.title}
                            {...feature}
                            delay={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface BentoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
    delay: number;
}

function BentoCard({ icon, title, description, className = '', delay }: BentoCardProps) {
    return (
        <div
            className={`
                group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 hover:bg-white/[0.04] transition-colors duration-300
                ${className}
            `}
        >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-300 group-hover:text-white group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                {title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
                {description}
            </p>

            {/* Subtle Gradient Hover Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}
