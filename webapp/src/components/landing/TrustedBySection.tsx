import { Server } from 'lucide-react';

export function TrustedBySection() {
    const companies = [
        'TechCorp', 'FinanceHub', 'CloudSec', 'DataFlow', 'SecureNet', 'PayGuard', 'CyberShield', 'TrustWave'
    ];

    return (
        <section className="py-16 border-y border-white/[0.04] bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-slate-500 mb-8">Trusted by leading enterprises worldwide</p>

                <div className="marquee">
                    <div className="marquee-content">
                        {[...companies, ...companies].map((company, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] whitespace-nowrap hover:bg-white/[0.05] transition-colors"
                            >
                                <Server className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-400 font-medium">{company}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
