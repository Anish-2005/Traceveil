import { Globe } from 'lucide-react';
import { DocHero, DocNavLink, DocSection } from '@/components/docs/DocPrimitives';

const endpoints = [
  { method: 'POST', path: '/v1/events', description: 'Ingest a new event for immediate analysis', methodClass: 'text-emerald-300' },
  { method: 'GET', path: '/v1/users/{id}/risk', description: 'Fetch current risk score and explanation', methodClass: 'text-blue-300' },
  { method: 'GET', path: '/v1/decisions', description: 'Retrieve historical action decisions', methodClass: 'text-violet-300' },
];

export default function EndpointsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <DocHero
        icon={Globe}
        title="API Endpoints"
        description="Operational endpoint contract for ingestion, risk lookups, and decision intelligence."
      />

      <DocSection title="Core Routes">
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-100">Method</th>
                <th className="px-5 py-3 font-semibold text-slate-100">Endpoint</th>
                <th className="px-5 py-3 font-semibold text-slate-100">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {endpoints.map((endpoint) => (
                <tr key={endpoint.path} className="hover:bg-white/[0.03]">
                  <td className={`px-5 py-3 font-mono ${endpoint.methodClass}`}>{endpoint.method}</td>
                  <td className="px-5 py-3 font-mono text-slate-200">{endpoint.path}</td>
                  <td className="px-5 py-3 text-slate-400">{endpoint.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocNavLink href="/docs/api/sdks" label="Next: Client SDKs" />
    </div>
  );
}
