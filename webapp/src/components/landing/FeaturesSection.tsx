import { Cpu, Brain, Zap, Shield, BarChart3, Globe, Fingerprint } from 'lucide-react';

export function FeaturesSection() {
    const features = [
        {
            icon: <Brain className="w-6 h-6" />,
            title: 'AI-Powered Detection',
            description: 'Deep learning models analyze behavioral patterns to identify threats before they materialize',
            color: 'blue' as const,
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Real-Time Analysis',
            description: 'Sub-millisecond threat detection with streaming data processing and instant alerts',
            color: 'amber' as const,
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Fraud Prevention',
            description: 'Block fraudulent transactions and suspicious activities with 99.7% accuracy',
            color: 'emerald' as const,
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: 'Advanced Analytics',
            description: 'Comprehensive dashboards with real-time metrics and trend analysis',
            color: 'purple' as const,
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: 'Global Threat Intel',
            description: 'Cross-reference events against global threat databases and known patterns',
            color: 'cyan' as const,
        },
        {
            icon: <Fingerprint className="w-6 h-6" />,
            title: 'Behavioral Biometrics',
            description: 'Detect account takeovers with advanced user behavior analysis',
            color: 'rose' as const,
        },
    ];

    return (
        <section id="features" className="py-24 lg:py-32 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/25 mb-6">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-400">Core Capabilities</span>
                    </div>
                    <h2 className="scroll-reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Enterprise-Grade <span className="gradient-text-premium">Security</span>
                    </h2>
                    <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 max-w-2xl mx-auto">
                        Comprehensive threat detection powered by state-of-the-art machine learning
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={feature.title}
                            {...feature}
                            delay={i + 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: 'blue' | 'amber' | 'emerald' | 'purple' | 'cyan' | 'rose';
    delay: number;
}

function FeatureCard({ icon, title, description, color, delay }: FeatureCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/25 text-blue-400',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/25 text-amber-400',
        emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/25 text-emerald-400',
        purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/25 text-purple-400',
        cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/25 text-cyan-400',
        rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/25 text-rose-400',
    };

    return (
        <div className={`scroll-reveal reveal-delay-${Math.min(delay, 6)} glass-card p-6 lg:p-8 card-glow group`}>
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border mb-4 icon-float`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}
