import Link from 'next/link';
import { ArrowRight, Terminal, CheckCircle2 } from 'lucide-react';

export default function QuickStartPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <Terminal className="w-5 h-5 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Quick Start Guide</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Get up and running with Traceveil in less than 5 minutes. Follow these steps to integrate real-time threat detection into your application.
                </p>
            </div>

            <div className="space-y-12">
                {/* Step 1 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm">1</span>
                        <h2 className="text-xl font-semibold text-white">Install the SDK</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-400">Install the Traceveil client library using your preferred package manager.</p>
                        <div className="relative mt-4 group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative p-4 rounded-xl bg-[#0a0e17] border border-white/[0.08] font-mono text-sm text-slate-300 flex items-center justify-between">
                                <code>npm install @traceveil/client</code>
                                <button className="text-xs text-slate-500 hover:text-white transition-colors">Copy</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm">2</span>
                        <h2 className="text-xl font-semibold text-white">Initialize the Client</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-400">Import and initialize the client with your API key.</p>
                        <div className="relative mt-4">
                            <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/[0.08] font-mono text-sm text-slate-300 overflow-x-auto">
                                <pre className="text-xs leading-relaxed">
                                    {`import { Traceveil } from '@traceveil/client';

const tv = new Traceveil({
  apiKey: process.env.TRACEVEIL_API_KEY
});`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm">3</span>
                        <h2 className="text-xl font-semibold text-white">Track Events</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-400">Start tracking user events to detect anomalies.</p>
                        <div className="relative mt-4">
                            <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/[0.08] font-mono text-sm text-slate-300 overflow-x-auto">
                                <pre className="text-xs leading-relaxed">
                                    {`// Track a login attempt
await tv.track('login_attempt', {
  userId: 'user_123',
  ip: '192.168.1.1',
  timestamp: Date.now()
});`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/architecture"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: Understanding the Architecture
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
