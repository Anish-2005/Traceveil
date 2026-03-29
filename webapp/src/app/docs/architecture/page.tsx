import { Box, Cloud, Server, Shield } from 'lucide-react';
import { DocCard, DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

export default function ArchitecturePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Box}
        title="System Architecture"
        description="Traceveil runs as a distributed event pipeline designed for low-latency scoring, resilient ingestion, and continuous model operations."
      />

      <DocSection title="Core Layers" description="Each layer is independently scalable and observable.">
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard
            icon={Server}
            title="Edge Ingestion"
            description="Globally distributed ingress nodes accept telemetry with low network RTT and push events to stream partitions."
          />
          <DocCard
            icon={Shield}
            title="Real-time Analysis"
            description="Behavioral, sequence, and graph models evaluate each event in parallel with policy-aware post-processing."
          />
          <DocCard
            icon={Cloud}
            title="Cloud Core"
            description="Historical storage, offline training, model versioning, and deployment orchestration are centralized in the cloud layer."
          />
        </div>
      </DocSection>

      <DocSection title="Data Flow" description="Typical end-to-end request path in production.">
        <div className="rounded-xl border border-white/[0.1] bg-[#0a0e17] p-5">
          <div className="grid md:grid-cols-4 gap-3 text-center text-sm">
            <FlowNode title="Client SDK" subtitle="Telemetry Capture" />
            <FlowNode title="API Gateway" subtitle="Validation + Queue" />
            <FlowNode title="Inference Layer" subtitle="Risk + Explanation" highlighted />
            <FlowNode title="Your Backend" subtitle="Action Hook" />
          </div>
        </div>
      </DocSection>

      <DocNavLink href="/docs/threat-detection" label="Next: Threat Detection Models" />
    </div>
  );
}

function FlowNode({
  title,
  subtitle,
  highlighted = false,
}: {
  title: string;
  subtitle: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-4 py-4 border ${
        highlighted
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
          : 'border-white/[0.08] bg-white/[0.02] text-slate-200'
      }`}
    >
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}

