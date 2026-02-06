import { Brain, Cpu, Zap, Lock, Terminal } from 'lucide-react';

export function AIModelsSection() {
    return (
        <section id="models" className="py-32 relative bg-[#030712] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="scroll-reveal max-w-2xl mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Proprietary AI Models
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Our ensemble of models analyzes behavioral biometrics, network patterns, and device fingerprints in real-time.
                    </p>
                </div>

                {/* Technical Spec Sheet Layout */}
                <div className="scroll-reveal reveal-delay-2 border border-white/[0.05] rounded-lg overflow-hidden bg-white/[0.01]">
                    {/* Hdr */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/[0.05] bg-white/[0.02] text-xs font-mono text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4 sm:col-span-3">Model Name</div>
                        <div className="col-span-4 sm:col-span-3">Task</div>
                        <div className="col-span-2 hidden sm:block">Latency</div>
                        <div className="col-span-2 hidden sm:block">Accuracy</div>
                        <div className="col-span-4 sm:col-span-2 text-right">Status</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/[0.05]">
                        {[
                            { name: 'Cybernet-V4', task: 'Traffic Analysis', latency: '2ms', accuracy: '99.98%', status: 'Active' },
                            { name: 'Behavior-X', task: 'Biometrics', latency: '12ms', accuracy: '99.95%', status: 'Active' },
                            { name: 'Fraud-Zero', task: 'Transaction Scoring', latency: '45ms', accuracy: '99.99%', status: 'Training' },
                            { name: 'Bot-Sentry', task: 'Automated Threats', latency: '5ms', accuracy: '99.97%', status: 'Active' },
                        ].map((model, i) => (
                            <div key={model.name} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                                <div className="col-span-4 sm:col-span-3 font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                                    {model.name}
                                </div>
                                <div className="col-span-4 sm:col-span-3 text-sm text-slate-300">
                                    {model.task}
                                </div>
                                <div className="col-span-2 hidden sm:block font-mono text-xs text-slate-500">
                                    {model.latency}
                                </div>
                                <div className="col-span-2 hidden sm:block font-mono text-xs text-slate-500">
                                    {model.accuracy}
                                </div>
                                <div className="col-span-4 sm:col-span-2 text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] border ${model.status === 'Active'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {model.status === 'Active' && <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                                        {model.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Console */}
                    <div className="p-3 bg-[#0a0e17] border-t border-white/[0.05] font-mono text-[10px] text-slate-600 flex items-center gap-2">
                        <Terminal className="w-3 h-3" />
                        <span>root@traceveil-core:~/models# watch -n 0.1 ./monitor_status.sh</span>
                    </div>
                </div>

            </div >
        </section >
    );
}
