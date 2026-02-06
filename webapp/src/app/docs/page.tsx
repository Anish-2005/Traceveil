import Link from 'next/link';
import { ArrowRight, Shield, Code, Zap } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="space-y-6 border-b border-white/[0.08] pb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    v2.0 Documentation
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Traceveil Documentation
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                    Learn how to integrate Traceveil's advanced threat detection and behavioral analysis into your applications.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/docs/quick-start"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
                    >
                        Quick Start
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/docs/api/endpoints"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold transition-all border border-white/[0.1]"
                    >
                        API Reference
                    </Link>
                </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                    icon={Zap}
                    title="Quick Start"
                    description="Get up and running with Traceveil in less than 5 minutes."
                    href="/docs/quick-start"
                />
                <Card
                    icon={Shield}
                    title="Core Concepts"
                    description="Understand the fundamentals of behavioral threat detection."
                    href="/docs/concepts"
                />
                <Card
                    icon={Code}
                    title="API Integration"
                    description="Deep dive into our REST API endpoints and SDKs."
                    href="/docs/api"
                />
            </div>

            {/* Content Section */}
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-400 prose-a:text-blue-400 hover:prose-a:text-blue-300 transition-colors">
                <h2>Introduction</h2>
                <p>
                    Traceveil is a real-time fraud and cheating detection system powered by advanced machine learning models.
                    It analyzes user behavior patterns, mouse movements, and interaction events to identify suspicious activities instantly.
                </p>
                <p>
                    Whether you are building a gaming platform, an online testing environment, or a financial application,
                    Traceveil provides the security layer you need without compromising user experience.
                </p>

                <h2>Key Features</h2>
                <ul>
                    <li>Real-time behavioral analysis</li>
                    <li>Mouse movement trajectory tracking</li>
                    <li>Device fingerprinting and anomaly detection</li>
                    <li>latency-optimized edge inference</li>
                </ul>
            </div>
        </div>
    );
}

function Card({ icon: Icon, title, description, href }: { icon: any, title: string, description: string, href: string }) {
    return (
        <Link
            href={href}
            className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all hover:-translate-y-1"
        >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
