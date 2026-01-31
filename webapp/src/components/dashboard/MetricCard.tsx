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
      bg: "from-emerald-500/15 to-green-500/15",
      border: "border-emerald-400/40",
      text: "text-emerald-300",
      glow: COLORS.severity.low.glow,
    },
    red: {
      bg: "from-red-500/15 to-rose-500/15",
      border: "border-red-400/40",
      text: "text-red-300",
      glow: COLORS.severity.critical.glow,
    },
    amber: {
      bg: "from-amber-500/15 to-yellow-500/15",
      border: "border-amber-400/40",
      text: "text-amber-300",
      glow: COLORS.severity.high.glow,
    },
  };

  const colorConfig = colorMap[color];

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.glow} rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      <div className={`${CARD_STYLES.base} p-6 hover:shadow-xl hover:shadow-black/30`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorConfig.bg} border ${colorConfig.border} shadow-lg`}>
            <div className={`${colorConfig.text} drop-shadow-sm`}>{icon}</div>
          </div>
          <div className="flex items-center gap-2">
            {pulse && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-500/50" />}
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trendUp
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}>
              {trend}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className={`${TYPOGRAPHY.label} mb-2`}>{label}</p>
          <h4 className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</h4>
          <p className={TYPOGRAPHY.body.small}>{subtext}</p>
        </div>
      </div>
    </div>
  );
}