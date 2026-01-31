import { ThreatIndicatorProps, COLORS } from '@/types/dashboard';

export function ThreatIndicator({ position, severity, label }: ThreatIndicatorProps) {
  const severityColors = COLORS.severity[severity];

  return (
    <div className={`absolute ${position} group/indicator cursor-pointer`}>
      <div className={`relative w-4 h-4 ${severityColors.bg} border-2 ${severityColors.border} rounded-full shadow-lg ${severityColors.shadow} transition-all duration-300 group-hover/indicator:scale-125`}>
        <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-75" />
        <div className="absolute inset-1 bg-slate-900 rounded-full" />
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover/indicator:opacity-100 transition-all duration-200 pointer-events-none shadow-xl">
        <div className="text-white">{label}</div>
        <div className={`text-xs ${severityColors.text} mt-0.5 capitalize font-semibold`}>
          {severity} Risk
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/95" />
      </div>
    </div>
  );
}