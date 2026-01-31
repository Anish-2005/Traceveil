import { EntityCardProps, COLORS, TYPOGRAPHY, CARD_STYLES } from '@/types/dashboard';

export function EntityCard({ id, type, riskScore, flags, status }: EntityCardProps) {
  const statusConfig = COLORS.status[status as keyof typeof COLORS.status];

  const getRiskColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-red-500', text: 'text-red-300', bar: 'from-red-500 to-red-600' };
    if (score >= 75) return { bg: 'bg-amber-500', text: 'text-amber-300', bar: 'from-amber-500 to-amber-600' };
    if (score >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-300', bar: 'from-yellow-500 to-yellow-600' };
    return { bg: 'bg-blue-500', text: 'text-blue-300', bar: 'from-blue-500 to-blue-600' };
  };

  const riskColor = getRiskColor(riskScore);

  return (
    <div className={`${CARD_STYLES.base} p-5 hover:shadow-xl hover:shadow-black/30 group/entity cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`${TYPOGRAPHY.label} mb-1`}>{type}</p>
          <h4 className={`${TYPOGRAPHY.body.base} font-semibold text-white group-hover/entity:text-blue-300 transition-colors`}>{id}</h4>
        </div>
        <div className={`px-3 py-1.5 rounded-full ${statusConfig.bg} border ${statusConfig.border} text-xs font-semibold ${statusConfig.color === 'emerald' ? 'text-emerald-300' :
          statusConfig.color === 'amber' ? 'text-amber-300' :
          statusConfig.color === 'red' ? 'text-red-300' : 'text-blue-300'} shadow-sm`}>
          {statusConfig.text}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={TYPOGRAPHY.label}>Risk Score</span>
          <span className={`text-sm font-bold ${riskColor.text}`}>
            {riskScore}%
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${riskColor.bar} rounded-full transition-all duration-1000 shadow-sm`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {flags.map((flag: string) => (
          <span key={flag} className="px-2.5 py-1 rounded-md bg-slate-800/50 border border-white/10 text-xs text-slate-300 font-medium hover:bg-slate-700/50 transition-colors">
            {flag}
          </span>
        ))}
      </div>
    </div>
  );
}