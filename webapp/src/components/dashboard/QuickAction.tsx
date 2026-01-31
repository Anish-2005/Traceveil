import { QuickActionProps, TYPOGRAPHY } from '@/types/dashboard';

export function QuickAction({ icon, label, count }: QuickActionProps) {
  return (
    <button className="w-full p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all duration-200 group/action text-left hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/50 border border-white/10 text-slate-400 group-hover/action:text-blue-400 group-hover/action:bg-blue-500/10 group-hover/action:border-blue-400/30 transition-all duration-200">
            {icon}
          </div>
          <span className={`${TYPOGRAPHY.body.base} font-medium text-slate-300 group-hover/action:text-white transition-colors duration-200`}>{label}</span>
        </div>
        {count !== undefined && (
          <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold shadow-sm">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}