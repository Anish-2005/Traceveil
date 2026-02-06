import Link from 'next/link';
import { ArrowRight, Box, Server, Cloud, Shield } from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <Box className="w-5 h-5 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Architecture</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Traceveil uses a distributed, event-driven architecture designed for low-latency inference and high availability.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                        <Server className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Edge Ingestion</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Events are ingested via globally distributed edge nodes to minimize latency. Typical ingestion latency is under 15ms.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Events are processed by our streaming engine which runs behavioral models and rule engines in parallel.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                        <Cloud className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Cloud Synapse</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Long-term storage and batch processing for model retraining and historical analysis happens in our secure cloud core.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Data Flow</h2>
                <div className="p-6 rounded-2xl bg-[#0a0e17] border border-white/[0.08] overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-mono text-slate-400">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/[0.02]">
                            <span className="text-white">Client App</span>
                            <span className="text-xs opacity-50">SDK</span>
                        </div>
                        <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-slate-600" />
                        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/[0.02]">
                            <span className="text-white">API Gateway</span>
                            <span className="text-xs opacity-50">Ingestion</span>
                        </div>
                        <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-slate-600" />
                        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <span className="text-blue-400">Analysis Engine</span>
                            <span className="text-xs text-blue-500/50">ML Models</span>
                        </div>
                        <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-slate-600" />
                        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/[0.02]">
                            <span className="text-white">Your Backend</span>
                            <span className="text-xs opacity-50">Webhook</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/threat-detection"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: Collaborative Threat Detection
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
