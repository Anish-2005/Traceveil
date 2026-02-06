import Link from 'next/link';
import { ArrowRight, Key, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Key className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">API Authentication</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Secure your API requests using API Keys.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-white mb-4">Using API Keys</h2>
                    <p className="text-slate-400 mb-4">
                        Include your API key in the <code>Authorization</code> header of every request.
                    </p>
                    <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/[0.08] font-mono text-sm text-yellow-500">
                        Authorization: Bearer tv_live_sk_...
                    </div>
                </section>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-400">Security Best Practice</h4>
                        <p className="text-xs text-slate-400 mt-1">
                            Never expose your Secret Key (starting with <code>tv_live_sk_</code>) in client-side code. Use Publishable Keys for frontend integration.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/api/endpoints"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: API Endpoints
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
