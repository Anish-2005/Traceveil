import { Target, Zap, LineChart, Network, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useCountUp } from '@/hooks';

export function StatsSection() {
    const detectionRate = useCountUp(99, 2000);
    const responseTime = useCountUp(12, 1500);
    const events = useCountUp(8, 2500);
    const uptime = useCountUp(99, 2000);

    return (
        <section id="stats" className="py-24 border-y border-white/[0.05] bg-[#030712] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
                    {/* Stat Item 1 */}
                    <div className="scroll-reveal">
                        <StatItem
                            label="Detection Accuracy"
                            value={<><span ref={detectionRate.ref} className="font-mono">{detectionRate.count}</span>.94%</>}
                            trend="+0.4%"
                            trendUp={true}
                            chart={[40, 60, 55, 70, 65, 80, 75, 90]}
                        />
                    </div>

                    {/* Stat Item 2 */}
                    <div className="scroll-reveal reveal-delay-1">
                        <StatItem
                            label="Global Latency"
                            value={<><span ref={responseTime.ref} className="font-mono">{responseTime.count}</span>ms</>}
                            trend="-1.2ms"
                            trendUp={true} // Inverted visual for latency (down is good/green but we want green color)
                            chart={[80, 70, 60, 65, 50, 45, 40, 35]}
                            color="emerald"
                        />
                    </div>

                    {/* Stat Item 3 */}
                    <div className="scroll-reveal reveal-delay-2">
                        <StatItem
                            label="Daily Events"
                            value={<><span ref={events.ref} className="font-mono">{events.count}</span>.2B</>}
                            trend="+12%"
                            trendUp={true}
                            chart={[20, 30, 45, 40, 60, 55, 70, 85]}
                        />
                    </div>

                    {/* Stat Item 4 */}
                    <div className="scroll-reveal reveal-delay-3">
                        <StatItem
                            label="System Uptime"
                            value={<><span ref={uptime.ref} className="font-mono">{uptime.count}</span>.99%</>}
                            trend="Stable"
                            trendUp={true}
                            chart={[100, 100, 95, 100, 98, 100, 100, 100]}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

interface StatItemProps {
    label: string;
    value: React.ReactNode;
    trend: string;
    trendUp: boolean;
    chart: number[];
    color?: string;
}

function StatItem({ label, value, trend, trendUp, chart, color = 'emerald' }: StatItemProps) {
    return (
        <div className="px-6 py-8 md:p-8 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors relative">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                    <span className={`inline-flex items-center text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend}
                        {trendUp ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
                    </span>
                </div>

                <div className="text-3xl lg:text-4xl font-semibold text-white mb-6 tracking-tight">
                    {value}
                </div>
            </div>

            {/* Sparkline Visual */}
            <div className="h-10 flex items-end justify-between gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                {chart.map((point, i) => (
                    <div
                        key={i}
                        className="w-full bg-blue-500/20 rounded-sm relative overflow-hidden"
                        style={{ height: `${point}%` }}
                    >
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />
                    </div>
                ))}
            </div>
        </div>
    );
}
