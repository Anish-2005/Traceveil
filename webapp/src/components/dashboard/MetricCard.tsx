import { MetricCardProps, COLORS, CARD_STYLES } from '@/types/dashboard';

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
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    },
    red: {
      bg: "from-red-500/20 to-rose-500/20",
      border: "border-red-500/30",
      text: "text-red-400",
    },
    amber: {
      bg: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/30",
      text: "text-amber-400",
    },
  };

  const colorConfig = colorMap[color];

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      <div className={`${CARD_STYLES.base} p-5`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorConfig.bg} border ${colorConfig.border}`}>
            <div className={colorConfig.text}>{icon}</div>
          </div>
          {pulse && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </div>
        <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{subtext}</p>
          <span className={`text-xs font-semibold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}