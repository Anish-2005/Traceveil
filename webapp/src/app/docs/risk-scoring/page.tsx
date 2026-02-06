import Link from 'next/link';
import { ArrowRight, Gauge, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RiskScoringPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                        <Gauge className="w-5 h-5 text-orange-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Risk Scoring</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Understanding how Traceveil calculates and assigns risk scores to sessions and users.
                </p>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <div className="flex items-center gap-3 mb-2 text-emerald-400">
                                <CheckCircle className="w-5 h-5" />
                                <h3 className="font-semibold">Low Risk (0-30)</h3>
                            </div>
                            <p className="text-sm text-slate-400">Normal user behavior. No anomalies detected.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                            <div className="flex items-center gap-3 mb-2 text-yellow-400">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-semibold">Medium Risk (31-70)</h3>
                            </div>
                            <p className="text-sm text-slate-400">Suspicious patterns detected but inconclusive.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                            <div className="flex items-center gap-3 mb-2 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-semibold">High Risk (71-100)</h3>
                            </div>
                            <p className="text-sm text-slate-400">Strong indicators of fraud or bot activity.</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Score Calculation</h2>
                    <div className="prose prose-invert max-w-none text-slate-400">
                        <p>
                            Risk scores are calculated using a weighted ensemble of multiple models. The score is dynamic and can change throughout a session as more data is collected.
                        </p>
                    </div>
                </section>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/ingestion"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: Event Ingestion
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
