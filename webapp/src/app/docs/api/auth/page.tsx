import { Key, ShieldCheck } from 'lucide-react';
import { DocCallout, DocCodeBlock, DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

export default function AuthPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Key}
        title="API Authentication"
        description="Authenticate every Traceveil request with scoped API keys to protect ingestion and decision endpoints."
      />

      <DocSection title="Authorization Header" description="Use bearer tokens in each call.">
        <DocCodeBlock languageLabel="http header" code={`Authorization: Bearer tv_live_sk_...`} />
      </DocSection>

      <DocCallout title="Security Best Practice" tone="warning">
        Never expose secret keys (`tv_live_sk_...`) in browser bundles. Use server-side functions or API routes
        to sign requests and store secrets in your environment manager.
      </DocCallout>

      <DocNavLink href="/docs/api/endpoints" label="Next: API Endpoints" />
    </div>
  );
}

