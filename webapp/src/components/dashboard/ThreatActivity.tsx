import { AlertTriangle, XCircle, MinusCircle, Activity, ArrowRight, Clock } from "lucide-react";
import { ThreatActivityProps, COLORS, TYPOGRAPHY } from '@/types/dashboard';

export function ThreatActivity({ severity, title, description, time, userId }: ThreatActivityProps) {
  const severityConfig = {
    critical: {
      color: "red",
      icon: <XCircle className="w-5 h-5" />,
      bg: COLORS.severity.critical.bgLight,
      border: COLORS.severity.critical.borderLight,
      text: COLORS.severity.critical.text,
      glow: COLORS.severity.critical.glow,
      shadow: "shadow-red-500/20",
    },
    high: {
      color: "amber",
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: COLORS.severity.high.bgLight,
      border: COLORS.severity.high.borderLight,
      text: COLORS.severity.high.text,
      glow: COLORS.severity.high.glow,
      shadow: "shadow-amber-500/20",
    },
    medium: {
      color: "yellow",
      icon: <MinusCircle className="w-5 h-5" />,
      bg: COLORS.severity.medium.bgLight,
      border: COLORS.severity.medium.borderLight,
      text: COLORS.severity.medium.text,
      glow: COLORS.severity.medium.glow,
      shadow: "shadow-yellow-500/20",
    },
    low: {
      color: "blue",
      icon: <Activity className="w-5 h-5" />,
      bg: COLORS.severity.low.bgLight,
      border: COLORS.severity.low.borderLight,
      text: COLORS.severity.low.text,
      glow: COLORS.severity.low.glow,
      shadow: "shadow-blue-500/20",
    },
  };

  const config = severityConfig[severity];

  return (
    <div className="group/activity relative p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.02] transform">
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} rounded-2xl blur-2xl opacity-0 group-hover/activity:opacity-100 transition-all duration-700`} />

      <div className="relative flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${config.bg} border ${config.border} ${config.text} shadow-xl ${config.shadow} group-hover/activity:scale-110 transition-all duration-300`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h4 className={`${TYPOGRAPHY.body.base} font-bold group-hover/activity:text-white transition-colors duration-300 leading-tight tracking-tight`}>
              {title}
            </h4>
            <div className="flex items-center gap-2 text-xs opacity-70 group-hover/activity:opacity-100 transition-opacity">
              <Clock className="w-3 h-3" />
              <span className="whitespace-nowrap font-medium">{time}</span>
            </div>
          </div>

          <p className={`${TYPOGRAPHY.body.small} mb-4 leading-relaxed opacity-80 group-hover/activity:opacity-100 transition-opacity`}>{description}</p>

          <div className="flex items-center justify-between">
            <span className={`${TYPOGRAPHY.body.small} font-semibold text-slate-400 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/10`}>
              {userId}
            </span>
            <button className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 opacity-0 group-hover/activity:opacity-100 transition-all duration-300 group-hover/activity:translate-x-2 transform hover:scale-105">
              <span>Investigate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.glow} opacity-0 group-hover/activity:opacity-100 transition-opacity duration-500`} />
    </div>
  );
}