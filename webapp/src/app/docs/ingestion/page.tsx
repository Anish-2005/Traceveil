import { Database } from 'lucide-react';
import { DocCodeBlock, DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

export default function IngestionPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Database}
        title="Event Ingestion"
        description="Send high-volume telemetry events into Traceveil for immediate model scoring and contextual response actions."
      />

      <DocSection title="HTTP Ingestion Endpoint" description="Primary endpoint for event submission with tenant-level auth.">
        <DocCodeBlock
          languageLabel="http"
          code={`POST https://api.traceveil.com/v1/events
Authorization: Bearer tv_live_sk_...
Content-Type: application/json`}
        />
      </DocSection>

      <DocSection title="Payload Example" description="Include identity, event metadata, and optional context attributes.">
        <DocCodeBlock
          languageLabel="json"
          code={`{
  "event_type": "transaction",
  "timestamp": "2026-03-29T14:30:00Z",
  "data": {
    "amount": 500.00,
    "currency": "USD",
    "user_id": "usr_89234"
  },
  "context": {
    "ip": "203.0.113.1",
    "user_agent": "Mozilla/5.0 ..."
  }
}`}
        />
      </DocSection>

      <DocNavLink href="/docs/api/auth" label="Next: API Authentication" />
    </div>
  );
}

