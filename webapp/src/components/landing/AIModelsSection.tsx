'use client';

import { Terminal } from 'lucide-react';
import { useModelIntelligence } from '@/hooks';

export function AIModelsSection() {
  const { data, isLoading } = useModelIntelligence({ refreshInterval: 30000 });
  const models = data?.models.models || [];

  return (
    <section id="models" className="py-32 relative bg-[#030712] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="scroll-reveal max-w-2xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Trained Models In Production</h2>
          <p className="text-slate-400 text-lg">
            Live registry of deployed models powering anomaly, sequence, and graph-based risk scoring.
          </p>
        </div>

        <div className="scroll-reveal reveal-delay-2 border border-white/[0.05] rounded-lg overflow-hidden bg-white/[0.01]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/[0.05] bg-white/[0.02] text-xs font-mono text-slate-500 uppercase tracking-wider">
            <div className="col-span-4 sm:col-span-3">Model Name</div>
            <div className="col-span-4 sm:col-span-3">Role</div>
            <div className="col-span-2 hidden sm:block">Version</div>
            <div className="col-span-2 hidden sm:block">Accuracy</div>
            <div className="col-span-4 sm:col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {isLoading && (
              <div className="p-4 text-sm text-slate-400">Loading model registry...</div>
            )}
            {!isLoading && models.length === 0 && (
              <div className="p-4 text-sm text-slate-400">No active model registry found. Backend is likely in fallback mode.</div>
            )}
            {!isLoading &&
              models.map((model) => {
                const lower = model.name.toLowerCase();
                const role = lower.includes('anomaly')
                  ? 'Behavioral anomalies'
                  : lower.includes('sequence')
                    ? 'Temporal behavior'
                    : lower.includes('graph')
                      ? 'Network relationships'
                      : 'Risk inference';

                const isActive = ['active', 'deployed', 'operational'].includes(model.status.toLowerCase());

                return (
                  <div key={`${model.name}-${model.version}`} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                    <div className="col-span-4 sm:col-span-3 font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                      {model.name}
                    </div>
                    <div className="col-span-4 sm:col-span-3 text-sm text-slate-300">{role}</div>
                    <div className="col-span-2 hidden sm:block font-mono text-xs text-slate-500">{model.version}</div>
                    <div className="col-span-2 hidden sm:block font-mono text-xs text-slate-500">{model.accuracy}</div>
                    <div className="col-span-4 sm:col-span-2 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] border ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}
                      >
                        {isActive && <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                        {model.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="p-3 bg-[#0a0e17] border-t border-white/[0.05] font-mono text-[10px] text-slate-600 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>model_registry.sync :: source={data?.source || 'fallback'} :: refresh_interval=30s</span>
          </div>
        </div>
      </div>
    </section>
  );
}

