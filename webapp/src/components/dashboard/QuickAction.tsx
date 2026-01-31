import { QuickActionProps } from '@/types/dashboard';

export function QuickAction({ icon, label, count }: QuickActionProps) {
  return (
    <button className="w-full p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 transition-all group/action text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-gray-400 group-hover/action:text-blue-400 transition">
            {icon}
          </div>
          <span className="text-sm text-gray-300 group-hover/action:text-white transition">{label}</span>
        </div>
        {count !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}