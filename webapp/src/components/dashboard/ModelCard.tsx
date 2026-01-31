import { CheckCircle2, Activity } from "lucide-react";
import { ModelCardProps, COLORS } from '@/types/dashboard';

export function ModelCard({ name, version, accuracy, status }: ModelCardProps) {
  const statusConfig = {
    deployed: { color: "green", text: "Deployed", icon: <CheckCircle2 className="w-3 h-3" /> },
    training: { color: "blue", text: "Training", icon: <Activity className="w-3 h-3" /> },
  };

  const config = statusConfig[status];

  return (
    <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer group/model">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm mb-0.5">{name}</h4>
          <p className="text-xs text-gray-500">{version}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400`}>
          {config.icon}
          <span className="text-xs font-medium">{config.text}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Accuracy</span>
        <span className="text-sm font-bold text-white">{accuracy}</span>
      </div>
    </div>
  );
}