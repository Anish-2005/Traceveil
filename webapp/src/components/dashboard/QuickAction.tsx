import { QuickActionProps, TYPOGRAPHY } from '@/types/dashboard';

export function QuickAction({ icon, label, count }: QuickActionProps) {
  return (
    <button className="w-full relative p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.10] border border-white/5 hover:border-white/25 transition-all duration-500 group/action text-left hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.03] active:scale-[0.97] transform overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover/action:opacity-100 transition-all duration-700" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 group-hover/action:text-blue-300 group-hover/action:bg-blue-500/15 group-hover/action:border-blue-400/30 transition-all duration-300 group-hover/action:scale-110 group-hover/action:rotate-3 shadow-lg group-hover/action:shadow-blue-500/20">
            {icon}
          </div>
          <span className={`${TYPOGRAPHY.body.base} font-bold text-slate-300 group-hover/action:text-white transition-colors duration-300 tracking-tight`}>
            {label}
          </span>
        </div>
        {count !== undefined && (
          <div className="relative">
            <span className="px-4 py-2 rounded-full bg-red-500/25 border border-red-400/50 text-red-200 text-sm font-black shadow-xl shadow-red-500/20 group-hover/action:scale-110 transition-all duration-300 animate-pulse">
              {count}
            </span>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-75" />
          </div>
        )}
      </div>

      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-purple-500/50 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500" />
    </button>
  );
}