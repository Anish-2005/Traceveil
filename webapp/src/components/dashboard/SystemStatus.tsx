import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import { SystemStatusProps, COLORS, TYPOGRAPHY } from '@/types/dashboard';

export function SystemStatus({ label, status, value }: SystemStatusProps) {
  const statusConfig = COLORS.status[status as keyof typeof COLORS.status] || COLORS.status.operational;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-1 border-b border-white/5 last:border-none group/status hover:bg-white/[0.02] rounded-lg transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${statusConfig.bg} border ${statusConfig.border} transition-all duration-200 group-hover/status:scale-105`}>
          {getStatusIcon(status)}
        </div>
        <div>
          <span className={`${TYPOGRAPHY.body.base} font-medium`}>{label}</span>
          <div className={`text-xs ${statusConfig.color === 'emerald' ? 'text-emerald-400' :
            statusConfig.color === 'amber' ? 'text-amber-400' :
            statusConfig.color === 'red' ? 'text-red-400' : 'text-slate-400'} font-semibold capitalize mt-0.5`}>
            {statusConfig.text}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`${TYPOGRAPHY.body.base} font-semibold text-white`}>{value}</div>
      </div>
    </div>
  );
}