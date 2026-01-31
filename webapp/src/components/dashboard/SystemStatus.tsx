import { CheckCircle2, AlertTriangle, XCircle, Clock, Activity } from "lucide-react";
import { SystemStatusProps, COLORS, TYPOGRAPHY } from '@/types/dashboard';

export function SystemStatus({ label, status, value }: SystemStatusProps) {
  const statusConfig = COLORS.status[status as keyof typeof COLORS.status] || COLORS.status.operational;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusAnimation = (status: string) => {
    switch (status) {
      case 'operational':
        return 'animate-pulse';
      case 'degraded':
        return 'animate-bounce';
      case 'offline':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="group/status relative py-5 px-2 border-b border-white/5 last:border-none hover:bg-white/[0.03] rounded-xl transition-all duration-300 cursor-pointer">
      {/* Subtle background glow for degraded/offline */}
      {(status === 'degraded' || status === 'offline') && (
        <div className={`absolute inset-0 bg-gradient-to-r ${status === 'degraded' ? 'from-amber-500/5 to-transparent' : 'from-red-500/5 to-transparent'} rounded-xl opacity-0 group-hover/status:opacity-100 transition-opacity duration-500`} />
      )}

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${statusConfig.bg} border ${statusConfig.border} transition-all duration-300 group-hover/status:scale-110 ${getStatusAnimation(status)} shadow-lg`}>
            {getStatusIcon(status)}
          </div>
          <div>
            <span className={`${TYPOGRAPHY.body.base} font-bold text-white group-hover/status:text-blue-200 transition-colors duration-300`}>
              {label}
            </span>
            <div className={`text-sm font-bold capitalize mt-1 tracking-wide ${
              statusConfig.color === 'emerald' ? 'text-emerald-300' :
              statusConfig.color === 'amber' ? 'text-amber-300' :
              statusConfig.color === 'red' ? 'text-red-300' : 'text-slate-300'
            }`}>
              {statusConfig.text}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`${TYPOGRAPHY.body.base} font-black text-white mb-1 tracking-tight`}>
            {value}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Activity className="w-3 h-3" />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Status indicator bar */}
      <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            status === 'operational' ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm shadow-emerald-500/30' :
            status === 'degraded' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm shadow-amber-500/30' :
            'bg-gradient-to-r from-red-500 to-red-600 shadow-sm shadow-red-500/30'
          }`}
          style={{ width: status === 'operational' ? '95%' : status === 'degraded' ? '70%' : '20%' }}
        />
      </div>
    </div>
  );
}