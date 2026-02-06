import Link from 'next/link';
import { ArrowRight, Database, Code, Zap } from 'lucide-react';

export default function IngestionPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-6 border-b border-white/[0.08] pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/10">
                        <Database className="w-5 h-5 text-pink-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Event Ingestion</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Learn how to send high-volume event streams to Traceveil for analysis.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-white mb-4">Ingestion API</h2>
                    <p className="text-slate-400 mb-6">
                        The primary method for sending data is via our HTTP Ingestion API. It is optimized for high throughput.
                    </p>

                    <div className="p-6 rounded-xl bg-[#0a0e17] border border-white/[0.08] font-mono text-sm text-slate-300 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 border-b border-white/[0.05] pb-2">
                            <span className="text-emerald-400">POST</span>
                            <span>https://api.traceveil.com/v1/events</span>
                        </div>
                        <pre className="text-xs leading-relaxed">
                            {`{
  "event_type": "transaction",
  "timestamp": "2024-03-20T14:30:00Z",
  "data": {
    "amount": 500.00,
    "currency": "USD",
    "user_id": "usr_89234"
  },
  "context": {
    "ip": "203.0.113.1",
    "user_agent": "Mozilla/5.0..."
  }
}`}
                        </pre>
                    </div>
                </section>
            </div>

            <div className="pt-8 border-t border-white/[0.08]">
                <Link
                    href="/docs/api/auth"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    Next: Authentication
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
