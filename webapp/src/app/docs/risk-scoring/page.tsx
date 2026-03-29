import { AlertTriangle, CheckCircle, Gauge } from 'lucide-react';
import { DocCard, DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

export default function RiskScoringPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Gauge}
        title="User Risk Scoring"
        description="Risk scores are continuously recalculated as events stream in, allowing action policy to adapt in-session."
      />

      <DocSection title="Risk Bands" description="Default scoring bands used by the policy engine.">
        <div className="grid md:grid-cols-3 gap-4">
          <DocCard
            icon={CheckCircle}
            title="Low Risk · 0-30"
            description="Behavior remains within expected baseline. Requests can proceed without additional friction."
          />
          <DocCard
            icon={AlertTriangle}
            title="Medium Risk · 31-70"
            description="Suspicious drift detected. Trigger step-up checks, adaptive challenges, or transaction limits."
          />
          <DocCard
            icon={AlertTriangle}
            title="High Risk · 71-100"
            description="High-confidence fraud indicators. Block, isolate session, and surface incident for review."
          />
        </div>
      </DocSection>

      <DocSection title="Score Composition" description="The default weighted ensemble combines anomaly, sequence, and graph risk signals.">
        <div className="docs-code">
          <div className="docs-code-label">formula</div>
          <pre className="docs-code-pre">
            <code>{`risk_score = (0.35 * anomaly_score) + (0.40 * sequence_score) + (0.25 * graph_score)`}</code>
          </pre>
        </div>
      </DocSection>

      <DocNavLink href="/docs/ingestion" label="Next: Event Ingestion" />
    </div>
  );
}

