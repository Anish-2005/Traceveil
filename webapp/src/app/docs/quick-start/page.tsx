import { Terminal } from 'lucide-react';
import { DocCodeBlock, DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

export default function QuickStartPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Terminal}
        title="Quick Start Guide"
        description="Integrate Traceveil in under 5 minutes with secure auth, client initialization, and first event telemetry."
      />

      <DocSection title="1. Install SDK" description="Use npm or pnpm in your application workspace.">
        <DocCodeBlock code={`npm install @traceveil/client`} languageLabel="bash" />
      </DocSection>

      <DocSection title="2. Initialize Client" description="Initialize once and share the client across your API routes or worker pipeline.">
        <DocCodeBlock
          languageLabel="typescript"
          code={`import { Traceveil } from '@traceveil/client';

const tv = new Traceveil({
  apiKey: process.env.TRACEVEIL_API_KEY!,
  project: 'production',
});`}
        />
      </DocSection>

      <DocSection title="3. Send Events" description="Track critical behavior events with user and network context.">
        <DocCodeBlock
          languageLabel="typescript"
          code={`await tv.track('login_attempt', {
  userId: 'user_123',
  ip: '192.168.1.1',
  userAgent: req.headers['user-agent'],
  metadata: {
    sessionId: 'sess_abcd1234',
    source: 'webapp',
  },
});`}
        />
      </DocSection>

      <div className="pt-2">
        <DocNavLink href="/docs/architecture" label="Next: System Architecture" />
      </div>
    </div>
  );
}

