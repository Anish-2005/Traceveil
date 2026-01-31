import { MetricCardProps, COLORS, CARD_STYLES, TYPOGRAPHY } from '@/types/dashboard';

export function MetricCard({
  icon,
  label,
  value,
  subtext,
  trend,
  trendUp,
  color,
  pulse
}: MetricCardProps) {
  const colorMap = {
    emerald: {
      bg: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-400/50",
      text: "text-emerald-300",
      glow: COLORS.severity.low.glow,
      shadow: "shadow-emerald-500/30",
    },
    red: {
      bg: "from-red-500/20 to-rose-500/20",
      border: "border-red-400/50",
      text: "text-red-300",
      glow: COLORS.severity.critical.glow,
      shadow: "shadow-red-500/30",
    },
    amber: {
      bg: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-400/50",
      text: "text-amber-300",
      glow: COLORS.severity.high.glow,
      shadow: "shadow-amber-500/30",
    },
  };

  const colorConfig = colorMap[color];

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.glow} rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700`} />
      <div className={`${CARD_STYLES.professional} p-8 hover:shadow-2xl hover:${colorConfig.shadow} hover:scale-[1.02] transform transition-all duration-500`}>
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorConfig.bg} border ${colorConfig.border} shadow-xl ${colorConfig.shadow} group-hover:scale-110 transition-all duration-300`}>
            <div className={`${colorConfig.text} drop-shadow-lg`}>{icon}</div>
          </div>
          <div className="flex items-center gap-3">
            {pulse && (
              <div className="relative">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-500/60" />
                <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75" />
              </div>
            )}
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300 ${
              trendUp
                ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                : 'bg-red-500/25 text-red-200 border-red-400/50 shadow-lg shadow-red-500/20'
            } group-hover:scale-105`}>
              {trend}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className={`${TYPOGRAPHY.metric.label} mb-3 opacity-80`}>{label}</p>
          <h4 className={`${TYPOGRAPHY.metric.value} mb-2 tracking-tight drop-shadow-sm`}>{value}</h4>
          <p className={`${TYPOGRAPHY.metric.subtext} font-medium`}>{subtext}</p>
        </div>

        {/* Subtle progress indicator */}
        <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${colorConfig.bg} rounded-full transition-all duration-1500 shadow-sm`}
            style={{ width: trendUp ? '75%' : '45%' }}
          />
        </div>
      </div>
    </div>
  );
}