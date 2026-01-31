import { CheckCircle2, Activity, TrendingUp } from "lucide-react";
import { ModelCardProps, COLORS, TYPOGRAPHY, CARD_STYLES } from '@/types/dashboard';

export function ModelCard({ name, version, accuracy, status }: ModelCardProps) {
  const statusConfig = {
    deployed: {
      color: "emerald",
      text: "Deployed",
      icon: <CheckCircle2 className="w-4 h-4" />,
      bg: COLORS.status.deployed.bg,
      border: COLORS.status.deployed.border,
      textColor: "text-emerald-300"
    },
    training: {
      color: "blue",
      text: "Training",
      icon: <Activity className="w-4 h-4" />,
      bg: COLORS.status.training.bg,
      border: COLORS.status.training.border,
      textColor: "text-blue-300"
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`${CARD_STYLES.base} p-5 hover:shadow-xl hover:shadow-black/30 group/model cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className={`${TYPOGRAPHY.body.base} font-semibold text-white mb-1 group-hover/model:text-blue-300 transition-colors`}>{name}</h4>
          <p className={`${TYPOGRAPHY.body.small} font-medium`}>{version}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} border ${config.border} ${config.textColor} shadow-sm`}>
          {config.icon}
          <span className="text-xs font-semibold">{config.text}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span className={TYPOGRAPHY.label}>Accuracy</span>
        </div>
        <span className={`${TYPOGRAPHY.body.base} font-bold text-white`}>{accuracy}</span>
      </div>

      {status === 'training' && (
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" style={{ width: '65%' }} />
        </div>
      )}
    </div>
  );
}