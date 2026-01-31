import { EntityCardProps, COLORS, TYPOGRAPHY, CARD_STYLES } from '@/types/dashboard';

export function EntityCard({ id, type, riskScore, flags, status }: EntityCardProps) {
  const statusConfig = COLORS.status[status as keyof typeof COLORS.status];

  const getRiskColor = (score: number) => {
    if (score >= 90) return {
      bg: 'bg-red-500',
      text: 'text-red-200',
      bar: 'from-red-500 to-red-600',
      glow: 'from-red-500/20 to-rose-500/20',
      shadow: 'shadow-red-500/30'
    };
    if (score >= 75) return {
      bg: 'bg-amber-500',
      text: 'text-amber-200',
      bar: 'from-amber-500 to-amber-600',
      glow: 'from-amber-500/20 to-orange-500/20',
      shadow: 'shadow-amber-500/30'
    };
    if (score >= 50) return {
      bg: 'bg-yellow-500',
      text: 'text-yellow-200',
      bar: 'from-yellow-500 to-yellow-600',
      glow: 'from-yellow-500/20 to-amber-500/20',
      shadow: 'shadow-yellow-500/30'
    };
    return {
      bg: 'bg-blue-500',
      text: 'text-blue-200',
      bar: 'from-blue-500 to-blue-600',
      glow: 'from-blue-500/20 to-cyan-500/20',
      shadow: 'shadow-blue-500/30'
    };
  };

  const riskColor = getRiskColor(riskScore);

  return (
    <div className={`${CARD_STYLES.professional} p-6 hover:shadow-2xl hover:${riskColor.shadow} hover:scale-[1.02] transform transition-all duration-500 group/entity cursor-pointer`}>
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${riskColor.glow} rounded-3xl blur-3xl opacity-0 group-hover/entity:opacity-100 transition-all duration-700`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <p className={`${TYPOGRAPHY.label} mb-2 opacity-80`}>{type}</p>
            <h4 className={`${TYPOGRAPHY.heading.h5} group-hover/entity:text-blue-200 transition-colors duration-300 tracking-tight`}>
              {id}
            </h4>
          </div>
          <div className={`px-4 py-2 rounded-full ${statusConfig.bg} border ${statusConfig.border} text-sm font-bold shadow-xl ${statusConfig.color === 'emerald' ? 'text-emerald-200' :
            statusConfig.color === 'amber' ? 'text-amber-200' :
            statusConfig.color === 'red' ? 'text-red-200' : 'text-blue-200'} group-hover/entity:scale-105 transition-all duration-300`}>
            {statusConfig.text}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`${TYPOGRAPHY.label} opacity-80`}>Risk Score</span>
            <span className={`text-xl font-black ${riskColor.text} drop-shadow-sm`}>
              {riskScore}%
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${riskColor.bar} rounded-full transition-all duration-1500 shadow-lg ${riskColor.shadow}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {flags.map((flag: string) => (
            <span key={flag} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/15 text-sm text-slate-300 font-semibold hover:bg-slate-700/60 hover:border-white/25 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm">
              {flag}
            </span>
          ))}
        </div>

        {/* Risk level indicator */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Risk Level</span>
            <span className={`font-bold ${riskColor.text} uppercase tracking-wider`}>
              {riskScore >= 90 ? 'Critical' : riskScore >= 75 ? 'High' : riskScore >= 50 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}