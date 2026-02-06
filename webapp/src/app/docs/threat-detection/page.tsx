import Link from 'next/link';
import { ArrowRight, ShieldAlert, Fingerprint, Activity, MousePointer2 } from 'lucide-react';

export default function ThreatDetectionPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Threat Detection Models</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Traceveil employs a multi-layered approach to threat detection, combining behavioral biometrics, device fingerprinting, and network analysis.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-6">Core Models</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Biometrics */}
                        <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <MousePointer2 className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Behavioral Biometrics</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">
                                Analyzes mouse movement trajectories, typing cadence, and interaction patterns to distinguish humans from bots.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    Mouse jitter analysis
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    Keystroke dynamics
                                </li>
                            </ul>
                        </div>

                        {/* Fingerprinting */}
                        <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Fingerprint className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-semibold text-white">Device Fingerprinting</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">
                                Creates a unique identity for every device accessing your platform, even across incognito sessions and VPNs.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                                    Browser entropy
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                                    Hardware canvas access
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-6">Detection Logic</h2>
                    <div className="prose prose-invert max-w-none text-slate-400">
                        <p>
                            Our engines run continuously, updating risk scores in real-time. When a threshold is breached, an alert is triggered immediately.
                        </p>
                    </div>
                </section>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/risk-scoring"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: User Risk Scoring
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
