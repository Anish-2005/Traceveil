import { SystemStatusProps, COLORS } from '@/types/dashboard';

export function SystemStatus({ label, status, value }: SystemStatusProps) {
  const statusConfig = COLORS.status[status as keyof typeof COLORS.status] || COLORS.status.operational;

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-none group/status">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 bg-${statusConfig.color}-500 rounded-full ${status === 'operational' ? 'animate-pulse' : ''}`} />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">{value}</div>
      </div>
    </div>
  );
}