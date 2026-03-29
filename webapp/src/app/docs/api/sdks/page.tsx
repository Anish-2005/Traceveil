import { Box, Code2 } from 'lucide-react';
import Link from 'next/link';
import { DocCard, DocHero, DocSection } from '@/components/docs/DocPrimitives';

export default function SDKsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Box}
        title="Client SDKs"
        description="Official SDKs for production integration with typed APIs, retry strategy, and telemetry helpers."
      />

      <DocSection title="Available SDKs">
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard
            icon={Code2}
            title="JavaScript / TypeScript · v2.4.0"
            description="Node and browser package optimized for Next.js, Express, and edge runtime use cases."
          />
          <DocCard
            icon={Code2}
            title="Python · v1.2.1"
            description="Async-friendly package for backend workers, Flask/FastAPI integration, and pipeline jobs."
          />
        </div>
      </DocSection>

      <Link href="/docs" className="docs-nav-link">
        Back to Introduction
      </Link>
    </div>
  );
}

