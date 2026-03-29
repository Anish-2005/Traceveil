import { Fingerprint, MousePointer2, ShieldAlert } from 'lucide-react';
import { DocCard, DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

export default function ThreatDetectionPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={ShieldAlert}
        title="Threat Detection Models"
        description="Traceveil combines multiple model families to reduce false positives while maintaining high sensitivity for coordinated abuse patterns."
      />

      <DocSection title="Model Families" description="Models run in parallel and contribute weighted signals to the final risk decision.">
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard
            icon={MousePointer2}
            title="Behavioral Biometrics"
            description="Tracks pointer trajectories, movement entropy, typing cadence, and interaction rhythm to differentiate human and automated behavior."
          />
          <DocCard
            icon={Fingerprint}
            title="Device Intelligence"
            description="Builds stable device fingerprints and surfaces anomalies from suspicious browser entropy and hardware signature drift."
          />
        </div>
      </DocSection>

      <DocSection title="Decision Logic" description="The risk engine fuses model outputs and policy thresholds into a single action category.">
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="docs-card">`safe` signals normal behavior and low abuse likelihood.</li>
          <li className="docs-card">`monitor` indicates suspicious trajectory requiring additional verification or throttling.</li>
          <li className="docs-card">`block` indicates high-confidence fraud/cheat behavior requiring immediate prevention action.</li>
        </ul>
      </DocSection>

      <DocNavLink href="/docs/risk-scoring" label="Next: User Risk Scoring" />
    </div>
  );
}

