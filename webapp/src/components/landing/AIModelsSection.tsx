import Link from 'next/link';
import { Brain, ChevronRight, Terminal, GitBranch, Cpu, Network } from 'lucide-react';

export function AIModelsSection() {
    const models = [
        {
            id: 'mod_01',
            name: 'Anomaly Detector',
            type: 'Autoencoder NN',
            latency: '12ms',
            accuracy: '99.4%',
            status: 'active'
        },
        {
            id: 'mod_02',
            name: 'Sequence Analyzer',
            type: 'Bi-LSTM',
            latency: '24ms',
            accuracy: '98.8%',
            status: 'active'
        },
        {
            id: 'mod_03',
            name: 'Graph Network',
            type: 'GNN-v4',
            latency: '45ms',
            accuracy: '97.2%',
            status: 'training'
        },
    ];

    return (
        <section id="models" className="py-24 lg:py-32 bg-[#030712] relative border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Context */}
                    <div className="lg:col-span-5 pt-4">
                        <div className="inline-flex items-center gap-2 mb-8 text-blue-400 font-mono text-xs tracking-wider uppercase">
                            <Terminal className="w-4 h-4" />
                            <span>Neural Architecture</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
                            Multi-layered <br />
                            <span className="text-slate-500">intelligence engine.</span>
                        </h2>

                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            Our proprietary ensemble model combines unsupervised learning for anomaly detection
                            with deep graph networks for relationship mapping.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                <Cpu className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <div className="text-white font-medium text-sm">Parallel Processing</div>
                                    <div className="text-slate-500 text-xs mt-1">Simultaneous execution across 4,096 CUDA cores per node.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                <GitBranch className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <div className="text-white font-medium text-sm">Continuous Training</div>
                                    <div className="text-slate-500 text-xs mt-1">Models re-weight every 6 hours based on global threat feedback.</div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/models"
                            className="inline-flex items-center gap-2 mt-10 text-white hover:text-blue-400 font-medium transition-colors text-sm group"
                        >
                            <span>Read Technical Whitepaper</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right Column: Technical Spec Table */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0f1a] overflow-hidden">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.01]">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                    <Network className="w-4 h-4" />
                                    <span>active_inference_nodes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-medium text-emerald-500">Operational</span>
                                </div>
                            </div>

                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-6 py-3 border-b border-white/[0.04] bg-white/[0.005] text-xs font-mono text-slate-500 uppercase tracking-wider">
                                <div className="col-span-4">Model ID</div>
                                <div className="col-span-3">Type</div>
                                <div className="col-span-2 text-right">Latency</div>
                                <div className="col-span-3 text-right">Precision</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-white/[0.04]">
                                {models.map((model, i) => (
                                    <div key={model.id} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group">
                                        <div className="col-span-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${model.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <div>
                                                    <div className="text-sm font-medium text-white font-mono group-hover:text-blue-400 transition-colors">{model.name}</div>
                                                    <div className="text-xs text-slate-600 font-mono mt-0.5">{model.id}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.05] text-xs text-slate-300 font-mono">
                                                {model.type}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="text-xs text-slate-400 font-mono">{model.latency}</span>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <span className="text-sm font-bold text-emerald-400 font-mono">{model.accuracy}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer / Console Log */}
                            <div className="px-6 py-4 bg-[#05080f] border-t border-white/[0.08]">
                                <div className="font-mono text-[10px] leading-relaxed text-slate-600 space-y-1">
                                    <div className="flex gap-2">
                                        <span className="text-blue-500">info</span>
                                        <span>[10:42:01] Ensemble weights updated (v4.2.1)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-blue-500">info</span>
                                        <span>[10:42:03] Graph re-indexing complete (3.2ms)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-emerald-500">success</span>
                                        <span>[10:42:05] Node synchronization verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
