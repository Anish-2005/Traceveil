import { CheckCircle2, Activity, TrendingUp, Cpu, Zap } from "lucide-react";
import { ModelCardProps, COLORS, TYPOGRAPHY, CARD_STYLES } from '@/types/dashboard';

export function ModelCard({ name, version, accuracy, status }: ModelCardProps) {
  const statusConfig = {
    deployed: {
      color: "emerald",
      text: "Deployed",
      icon: <CheckCircle2 className="w-5 h-5" />,
      bg: COLORS.status.deployed.bg,
      border: COLORS.status.deployed.border,
      textColor: "text-emerald-300",
      glow: "from-emerald-500/20 to-green-500/20",
      shadow: "shadow-emerald-500/30",
    },
    training: {
      color: "blue",
      text: "Training",
      icon: <Activity className="w-5 h-5" />,
      bg: COLORS.status.training.bg,
      border: COLORS.status.training.border,
      textColor: "text-blue-300",
      glow: "from-blue-500/20 to-cyan-500/20",
      shadow: "shadow-blue-500/30",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`${CARD_STYLES.professional} p-6 hover:shadow-2xl hover:${config.shadow} hover:scale-[1.02] transform transition-all duration-500 group/model cursor-pointer`}>
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} rounded-3xl blur-3xl opacity-0 group-hover/model:opacity-100 transition-all duration-700`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h4 className={`${TYPOGRAPHY.heading.h5} mb-2 group-hover/model:text-blue-200 transition-colors duration-300 tracking-tight`}>
              {name}
            </h4>
            <p className={`${TYPOGRAPHY.body.small} font-semibold text-slate-400 bg-slate-800/40 px-3 py-1 rounded-full border border-white/10 inline-block`}>
              v{version}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border} ${config.textColor} shadow-xl ${config.shadow} group-hover/model:scale-105 transition-all duration-300`}>
            {config.icon}
            <span className="text-sm font-bold">{config.text}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-slate-400 group-hover/model:text-emerald-400 transition-colors" />
            <span className={`${TYPOGRAPHY.label} opacity-80`}>Accuracy</span>
          </div>
          <span className={`${TYPOGRAPHY.metric.value} text-2xl group-hover/model:text-emerald-200 transition-colors`}>
            {accuracy}
          </span>
        </div>

        {status === 'training' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium">Training Progress</span>
              <span className="text-blue-300 font-bold">65%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-full animate-pulse shadow-sm transition-all duration-1000" style={{ width: '65%' }} />
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>2.4 TFLOPS</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>94% GPU</span>
              </div>
            </div>
          </div>
        )}

        {status === 'deployed' && (
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="font-medium">Active</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              1.2M predictions/day
            </div>
          </div>
        )}
      </div>
    </div>
  );
}