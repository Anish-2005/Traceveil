import { EntityCardProps, COLORS } from '@/types/dashboard';

export function EntityCard({ id, type, riskScore, flags, status }: EntityCardProps) {
  const statusConfig = COLORS.status[status as keyof typeof COLORS.status];

  return (
    <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer group/entity">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{type}</p>
          <h4 className="font-semibold text-white text-sm">{id}</h4>
        </div>
        <div className={`px-2 py-0.5 rounded-full bg-${statusConfig.color}-500/10 border border-${statusConfig.color}-500/20 text-${statusConfig.color}-400 text-xs font-medium`}>
          {statusConfig.text}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Risk Score</span>
          <span className={`text-sm font-bold ${riskScore >= 90 ? 'text-red-400' : riskScore >= 75 ? 'text-amber-400' : 'text-yellow-400'}`}>
            {riskScore}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${riskScore >= 90 ? 'bg-red-500' : riskScore >= 75 ? 'bg-amber-500' : 'bg-yellow-500'}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {flags.map((flag: string) => (
          <span key={flag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-gray-400">
            {flag}
          </span>
        ))}
      </div>
    </div>
  );
}