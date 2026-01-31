import Link from 'next/link';
import { Brain, ChevronRight, CheckCircle, Activity, Shield, TrendingUp, Users } from 'lucide-react';

export function AIModelsSection() {
    const models = [
        { name: 'Anomaly Detector', accuracy: 94.2, type: 'Autoencoder Neural Network', status: 'active' },
        { name: 'Sequence Model', accuracy: 91.8, type: 'LSTM Network', status: 'active' },
        { name: 'Graph Analyzer', accuracy: 96.5, type: 'Graph Neural Network', status: 'active' },
    ];

    return (
        <section id="models" className="py-24 lg:py-32 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column */}
                    <div>
                        <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-6">
                            <Brain className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">ML-Powered</span>
                        </div>

                        <h2 className="scroll-reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Trained on <span className="gradient-text-premium">Millions</span> of Patterns
                        </h2>

                        <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 mb-8 leading-relaxed">
                            Our AI models are trained on extensive datasets of fraud patterns, behavioral anomalies,
                            and threat signatures. Continuous learning ensures protection against emerging threats.
                        </p>

                        {/* Model Cards */}
                        <div className="space-y-4">
                            {models.map((model, i) => (
                                <ModelCard key={model.name} {...model} delay={i + 3} />
                            ))}
                        </div>

                        <Link
                            href="/models"
                            className="scroll-reveal reveal-delay-6 inline-flex items-center gap-2 mt-8 text-blue-400 hover:text-blue-300 font-semibold transition-colors group"
                        >
                            <span>Explore Our Models</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="scroll-reveal-right relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
                        <div className="relative glass-card p-8 lg:p-12">
                            <div className="grid grid-cols-2 gap-6">
                                <LiveMetricBox icon={<Activity />} value="15,247" label="Events Analyzed" trend="+12%" />
                                <LiveMetricBox icon={<Shield />} value="847" label="Threats Blocked" trend="+23%" />
                                <LiveMetricBox icon={<TrendingUp />} value="96.8%" label="Detection Rate" trend="+0.5%" />
                                <LiveMetricBox icon={<Users />} value="2,341" label="Active Streams" trend="+8%" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface ModelCardProps {
    name: string;
    accuracy: number;
    type: string;
    status: string;
    delay: number;
}

function ModelCard({ name, accuracy, type, delay }: ModelCardProps) {
    return (
        <div className={`scroll-reveal reveal-delay-${Math.min(delay, 6)} flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group`}>
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white group-hover:text-emerald-200 transition-colors">{name}</span>
                    <span className="text-sm font-bold text-emerald-400">{accuracy}%</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{type}</p>
                <div className="progress-glow">
                    <div className="progress-glow-fill" style={{ width: `${accuracy}%` }} />
                </div>
            </div>
        </div>
    );
}

interface LiveMetricBoxProps {
    icon: React.ReactNode;
    value: string;
    label: string;
    trend: string;
}

function LiveMetricBox({ icon, value, label, trend }: LiveMetricBoxProps) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center hover:bg-white/[0.04] transition-all group">
            <div className="inline-flex p-2 rounded-lg bg-blue-500/10 text-blue-400 mb-3 icon-pulse">
                {icon}
            </div>
            <div className="text-xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-400 mb-2">{label}</div>
            <div className="text-xs font-semibold text-emerald-400">{trend}</div>
        </div>
    );
}
