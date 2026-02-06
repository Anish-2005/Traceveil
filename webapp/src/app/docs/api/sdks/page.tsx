import Link from 'next/link';
import { ArrowLeft, Box, Code2 } from 'lucide-react';

export default function SDKsPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10">
                        <Box className="w-5 h-5 text-teal-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Client SDKs</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Official client libraries to accelerate your integration.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <a href="#" className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Code2 className="w-5 h-5 text-yellow-400" />
                            <h3 className="font-semibold text-white">JavaScript / TypeScript</h3>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-white/[0.1] text-slate-400">v2.4.0</span>
                    </div>
                    <p className="text-sm text-slate-400">Official Node.js and browser client.</p>
                </a>

                <a href="#" className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Code2 className="w-5 h-5 text-blue-400" />
                            <h3 className="font-semibold text-white">Python</h3>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-white/[0.1] text-slate-400">v1.2.1</span>
                    </div>
                    <p className="text-sm text-slate-400">Async-ready Python client for backend integration.</p>
                </a>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Introduction
                </Link>
            </div>
        </div>
    );
}
