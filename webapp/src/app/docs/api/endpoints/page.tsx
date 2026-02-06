import Link from 'next/link';
import { ArrowRight, Server, Globe } from 'lucide-react';

export default function EndpointsPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                        <Globe className="w-5 h-5 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">API Endpoints</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Reference for all available Traceveil API endpoints.
                </p>
            </div>

            <div className="space-y-8">
                <div className="overflow-hidden rounded-xl border border-white/[0.08]">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-white">Method</th>
                                <th className="px-6 py-4 font-semibold text-white">Endpoint</th>
                                <th className="px-6 py-4 font-semibold text-white">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-6 py-4 text-emerald-400 font-mono">POST</td>
                                <td className="px-6 py-4 font-mono text-slate-300">/v1/events</td>
                                <td className="px-6 py-4">Ingest a new event for analysis</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-6 py-4 text-blue-400 font-mono">GET</td>
                                <td className="px-6 py-4 font-mono text-slate-300">/v1/users/{'{id}'}/risk</td>
                                <td className="px-6 py-4">Get current risk score for a user</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                                <td className="px-6 py-4 text-blue-400 font-mono">GET</td>
                                <td className="px-6 py-4 font-mono text-slate-300">/v1/decisions</td>
                                <td className="px-6 py-4">Retrieve past automation decisions</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/api/sdks"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: SDKs
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
