import { ThreatIndicatorProps, COLORS } from '@/types/dashboard';

export function ThreatIndicator({ position, severity, label }: ThreatIndicatorProps) {
  const severityColors = COLORS.severity[severity];

  return (
    <div className={`absolute ${position} group/indicator cursor-pointer`}>
      <div className={`w-3 h-3 ${severityColors.bg} ${severityColors.border} border rounded-full animate-pulse shadow-lg ${severityColors.shadow}`} />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 backdrop-blur-sm border border-white/10 rounded text-xs whitespace-nowrap opacity-0 group-hover/indicator:opacity-100 transition pointer-events-none">
        {label}
      </div>
    </div>
  );
}