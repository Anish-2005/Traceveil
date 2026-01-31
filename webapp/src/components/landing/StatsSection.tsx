import { Target, Zap, LineChart, Network } from 'lucide-react';
import { useCountUp } from '@/hooks';

export function StatsSection() {
    const detectionRate = useCountUp(99, 2000);
    const responseTime = useCountUp(5, 1500);
    const events = useCountUp(10, 2500);
    const uptime = useCountUp(99, 2000);

    return (
        <section id="stats" className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="scroll-reveal-scale glass-card-elevated p-8 lg:p-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <StatItem
                            value={<><span ref={detectionRate.ref} className="counter-number">{detectionRate.count}</span>.7%</>}
                            label="Detection Accuracy"
                            icon={<Target className="w-6 h-6" />}
                        />
                        <StatItem
                            value={<>{'<'}<span ref={responseTime.ref} className="counter-number">{responseTime.count}</span>ms</>}
                            label="Response Time"
                            icon={<Zap className="w-6 h-6" />}
                        />
                        <StatItem
                            value={<><span ref={events.ref} className="counter-number">{events.count}</span>M+</>}
                            label="Events/Day"
                            icon={<LineChart className="w-6 h-6" />}
                        />
                        <StatItem
                            value={<><span ref={uptime.ref} className="counter-number">{uptime.count}</span>.9%</>}
                            label="Uptime SLA"
                            icon={<Network className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

interface StatItemProps {
    value: React.ReactNode;
    label: string;
    icon: React.ReactNode;
}

function StatItem({ value, label, icon }: StatItemProps) {
    return (
        <div className="text-center group">
            <div className="inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 mb-4 icon-float">
                {icon}
            </div>
            <div className="text-3xl lg:text-4xl font-black gradient-text-premium mb-2">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );
}
