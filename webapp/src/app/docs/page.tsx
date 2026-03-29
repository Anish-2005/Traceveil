import Link from 'next/link';
import { Activity, Book, Code, Shield, Sparkles } from 'lucide-react';
import { DocCard, DocHero, DocSection } from '@/components/docs/DocPrimitives';

export default function DocsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        badge="Traceveil Docs v2.0"
        icon={Book}
        title="Traceveil Documentation"
        description="Production-grade integration guides for real-time threat detection, event ingestion, and model-driven risk scoring."
        actions={
          <>
            <Link href="/docs/quick-start" className="btn-primary">
              Start Quick Setup
            </Link>
            <Link
              href="/docs/api/endpoints"
              className="inline-flex items-center px-5 py-3 rounded-xl border border-white/[0.12] bg-white/[0.03] text-sm font-semibold text-slate-100 hover:bg-white/[0.06] transition-colors"
            >
              Explore API
            </Link>
          </>
        }
      />

      <DocSection title="Documentation Map" description="Choose a path based on where you are in implementation.">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DocCard
            icon={Activity}
            title="Quick Start"
            description="Boot integration in minutes with secure key setup and first event ingestion."
            href="/docs/quick-start"
          />
          <DocCard
            icon={Shield}
            title="Threat Detection"
            description="Understand behavioral, sequence, and graph models used in the detection pipeline."
            href="/docs/threat-detection"
          />
          <DocCard
            icon={Code}
            title="API Reference"
            description="Complete authentication, endpoint contracts, and SDK integration details."
            href="/docs/api/endpoints"
          />
        </div>
      </DocSection>

      <DocSection
        title="What You Get"
        description="Traceveil is engineered for high-signal decisions with low-latency operational overhead."
      >
        <div className="grid lg:grid-cols-3 gap-4">
          <DocCard
            icon={Sparkles}
            title="Real-time Risk Decisions"
            description="Sub-second scoring pipeline with contextual explanation and confidence metadata."
          />
          <DocCard
            icon={Shield}
            title="Layered Defense"
            description="Behavioral biometrics, sequence intelligence, and network-graph analysis in one stack."
          />
          <DocCard
            icon={Activity}
            title="Operator-first Control"
            description="Production-safe endpoints for monitoring, events, model status, and feedback loop signals."
          />
        </div>
      </DocSection>
    </div>
  );
}

