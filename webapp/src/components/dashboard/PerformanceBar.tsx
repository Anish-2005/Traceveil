interface PerformanceBarProps {
    label: string;
    value: number;
    color: 'emerald' | 'red' | 'blue' | 'amber';
    inverted?: boolean;
}

export function PerformanceBar({ label, value, color, inverted }: PerformanceBarProps) {
    const colorClasses = {
        emerald: 'from-emerald-500 to-green-400',
        red: 'from-red-500 to-rose-400',
        blue: 'from-blue-500 to-cyan-400',
        amber: 'from-amber-500 to-yellow-400',
    }[color];

    const textColor = {
        emerald: 'text-emerald-400',
        red: 'text-red-400',
        blue: 'text-blue-400',
        amber: 'text-amber-400',
    }[color];

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{label}</span>
                <span className={`text-sm font-bold ${inverted ? (value < 5 ? 'text-emerald-400' : 'text-red-400') : textColor}`}>
                    {value.toFixed(1)}%
                </span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colorClasses} transition-all duration-1000`}
                    style={{ width: `${inverted ? value * 10 : value}%` }}
                />
            </div>
        </div>
    );
}
