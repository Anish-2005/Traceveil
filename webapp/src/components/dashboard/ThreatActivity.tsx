import { AlertTriangle, XCircle, MinusCircle, Activity, ArrowRight } from "lucide-react";
import { ThreatActivityProps, COLORS, TYPOGRAPHY } from '@/types/dashboard';

export function ThreatActivity({ severity, title, description, time, userId }: ThreatActivityProps) {
  const severityConfig = {
    critical: {
      color: "red",
      icon: <XCircle className="w-4 h-4" />,
      bg: COLORS.severity.critical.bgLight,
      border: COLORS.severity.critical.borderLight,
      text: COLORS.severity.critical.text
    },
    high: {
      color: "amber",
      icon: <AlertTriangle className="w-4 h-4" />,
      bg: COLORS.severity.high.bgLight,
      border: COLORS.severity.high.borderLight,
      text: COLORS.severity.high.text
    },
    medium: {
      color: "yellow",
      icon: <MinusCircle className="w-4 h-4" />,
      bg: COLORS.severity.medium.bgLight,
      border: COLORS.severity.medium.borderLight,
      text: COLORS.severity.medium.text
    },
    low: {
      color: "blue",
      icon: <Activity className="w-4 h-4" />,
      bg: COLORS.severity.low.bgLight,
      border: COLORS.severity.low.borderLight,
      text: COLORS.severity.low.text
    },
  };

  const config = severityConfig[severity];

  return (
    <div className="group/activity p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${config.bg} border ${config.border} ${config.text} shadow-sm`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className={`${TYPOGRAPHY.body.base} font-semibold group-hover/activity:text-white transition-colors duration-200 leading-tight`}>
              {title}
            </h4>
            <span className={`${TYPOGRAPHY.body.small} whitespace-nowrap opacity-60`}>{time}</span>
          </div>
          <p className={`${TYPOGRAPHY.body.small} mb-3 leading-relaxed`}>{description}</p>
          <div className="flex items-center justify-between">
            <span className={`${TYPOGRAPHY.body.small} font-medium text-slate-400`}>{userId}</span>
            <button className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 opacity-0 group-hover/activity:opacity-100 transition-all duration-200 group-hover/activity:translate-x-1">
              Investigate
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}