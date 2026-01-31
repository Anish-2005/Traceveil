import { ThreatIndicatorProps, COLORS } from '@/types/dashboard';

export function ThreatIndicator({ position, severity, label }: ThreatIndicatorProps) {
  const severityColors = COLORS.severity[severity];

  return (
    <div className={`absolute ${position} group/indicator cursor-pointer`}>
      <div className={`relative w-5 h-5 ${severityColors.bg} border-2 ${severityColors.border} rounded-full shadow-xl ${severityColors.shadow} transition-all duration-500 group-hover/indicator:scale-150 group-hover/indicator:rotate-12`}>
        {/* Enhanced pulsing animation */}
        <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-60" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-40" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
        <div className="absolute inset-1.5 bg-slate-900 rounded-full shadow-inner" />

        {/* Inner glow effect */}
        <div className="absolute inset-0.5 bg-current rounded-full opacity-20 animate-pulse" />
      </div>

      {/* Enhanced tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-xl text-xs font-medium whitespace-nowrap opacity-0 group-hover/indicator:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl shadow-black/50 z-50 transform group-hover/indicator:-translate-y-1">
        <div className="text-white font-semibold mb-1">{label}</div>
        <div className={`text-xs ${severityColors.text} font-bold capitalize tracking-wide`}>
          {severity} Risk Level
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/95" />
      </div>

      {/* Subtle connecting lines for critical threats */}
      {severity === 'critical' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-50" />
          <div className="absolute -top-1 -right-3 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-1 -left-3 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }} />
        </div>
      )}
    </div>
  );
}