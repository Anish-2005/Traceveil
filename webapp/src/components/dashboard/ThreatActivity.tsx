import { AlertTriangle, XCircle, MinusCircle, Activity } from "lucide-react";
import { ThreatActivityProps, COLORS } from '@/types/dashboard';

export function ThreatActivity({ severity, title, description, time, userId }: ThreatActivityProps) {
  const severityConfig = {
    critical: { color: "red", icon: <XCircle className="w-4 h-4" /> },
    high: { color: "amber", icon: <AlertTriangle className="w-4 h-4" /> },
    medium: { color: "yellow", icon: <MinusCircle className="w-4 h-4" /> },
    low: { color: "blue", icon: <Activity className="w-4 h-4" /> },
  };

  const config = severityConfig[severity];

  return (
    <div className="group/activity p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm group-hover/activity:text-blue-400 transition">{title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{description}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{userId}</span>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium opacity-0 group-hover/activity:opacity-100 transition">
              Investigate →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}