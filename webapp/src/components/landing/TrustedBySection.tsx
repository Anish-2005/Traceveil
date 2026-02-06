import { Server, Database, Globe, Cloud, ShieldCheck, Lock, Cpu, Wifi } from 'lucide-react';

export function TrustedBySection() {
    const companies = [
        { name: 'TechCorp', icon: <Server className="w-5 h-5" /> },
        { name: 'FinanceHub', icon: <Database className="w-5 h-5" /> },
        { name: 'CloudSec', icon: <Cloud className="w-5 h-5" /> },
        { name: 'DataFlow', icon: <Wifi className="w-5 h-5" /> },
        { name: 'SecureNet', icon: <ShieldCheck className="w-5 h-5" /> },
        { name: 'PayGuard', icon: <Lock className="w-5 h-5" /> },
        { name: 'CyberShield', icon: <Cpu className="w-5 h-5" /> },
        { name: 'TrustWave', icon: <Globe className="w-5 h-5" /> },
    ];

    return (
        <section className="py-12 border-b border-white/[0.05] bg-[#030712]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <p className="scroll-reveal text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
                    Trusted by security teams at
                </p>

                {/* Clean Grid Layout */}
                <div className="scroll-reveal reveal-delay-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company) => (
                        <div
                            key={company.name}
                            className="flex items-center gap-2 group cursor-default"
                        >
                            <div className="text-slate-400 group-hover:text-white transition-colors">
                                {company.icon}
                            </div>
                            <span className="font-semibold text-slate-400 group-hover:text-white transition-colors">{company.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
