'use client';

/**
 * Events Page - Event Ingestion & Risk Assessment
 * 
 * Production-grade interface for ingesting events and
 * receiving real-time AI-powered risk assessments.
 */

import { useState } from 'react';
import {
  Send,
  AlertCircle,
  CheckCircle,
  Zap,
  Code,
  Clock,
  User,
  Activity,
  Shield,
  TrendingUp,
  AlertTriangle,
  FileJson,
  Sparkles
} from 'lucide-react';
import { PageLayout, PageHeader, AnimatedSection } from '@/components/shared';
import { ModelIntelligenceStrip } from '@/components/shared';
import { traceveilApi, EventData, RiskAssessment } from '@/lib/api';
import { useModelIntelligence } from '@/hooks';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const eventTypes = [
  { value: 'login', label: 'Login', icon: <User className="w-4 h-4" />, color: 'blue' },
  { value: 'transaction', label: 'Transaction', icon: <Activity className="w-4 h-4" />, color: 'emerald' },
  { value: 'page_view', label: 'Page View', icon: <Zap className="w-4 h-4" />, color: 'purple' },
  { value: 'api_call', label: 'API Call', icon: <Code className="w-4 h-4" />, color: 'amber' },
  { value: 'file_upload', label: 'File Upload', icon: <FileJson className="w-4 h-4" />, color: 'cyan' },
] as const;

const sampleMetadata = {
  login: '{\n  "ip_address": "192.168.1.1",\n  "device": "Chrome/Windows",\n  "location": "New York, US"\n}',
  transaction: '{\n  "amount": 250.00,\n  "currency": "USD",\n  "merchant": "Amazon",\n  "card_last4": "4242"\n}',
  page_view: '{\n  "page": "/dashboard",\n  "referrer": "google.com",\n  "duration_ms": 3500\n}',
  api_call: '{\n  "endpoint": "/api/data",\n  "method": "POST",\n  "response_time_ms": 145\n}',
  file_upload: '{\n  "filename": "report.pdf",\n  "size_bytes": 1048576,\n  "mime_type": "application/pdf"\n}',
};

export default function NewEventPage() {
  const [formData, setFormData] = useState<EventData>({
    user_id: '',
    event_type: '',
    metadata: {},
    timestamp: new Date().toISOString(),
  });

  const [metadataInput, setMetadataInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<RiskAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const { data: modelSnapshot, isLoading: isModelSnapshotLoading } = useModelIntelligence({
    refreshInterval: 30000,
  });

  const handleEventTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, event_type: type }));
    // Auto-populate sample metadata
    const sample = sampleMetadata[type as keyof typeof sampleMetadata];
    if (sample && !metadataInput) {
      setMetadataInput(sample);
    }
  };

  const handleMetadataChange = (value: string) => {
    setMetadataInput(value);
    setJsonError(null);
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        setFormData(prev => ({ ...prev, metadata: parsed }));
      }
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      // Validate metadata
      if (metadataInput.trim()) {
        try {
          JSON.parse(metadataInput);
        } catch (e) {
          throw new Error('Invalid JSON in metadata field');
        }
      }

      const eventData: EventData = {
        ...formData,
        metadata: metadataInput.trim() ? JSON.parse(metadataInput) : {},
        timestamp: new Date().toISOString(),
      };

      const response = await traceveilApi.ingestEvent(eventData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return { bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400', bar: 'from-emerald-500 to-emerald-400' };
      case 'medium': return { bg: 'bg-amber-500/15', border: 'border-amber-500/25', text: 'text-amber-400', bar: 'from-amber-500 to-amber-400' };
      case 'high': return { bg: 'bg-orange-500/15', border: 'border-orange-500/25', text: 'text-orange-400', bar: 'from-orange-500 to-orange-400' };
      case 'critical': return { bg: 'bg-red-500/15', border: 'border-red-500/25', text: 'text-red-400', bar: 'from-red-500 to-red-400' };
      default: return { bg: 'bg-slate-500/15', border: 'border-slate-500/25', text: 'text-slate-400', bar: 'from-slate-500 to-slate-400' };
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <Shield className="w-6 h-6 text-emerald-400" />;
      case 'medium': return <TrendingUp className="w-6 h-6 text-amber-400" />;
      case 'high':
      case 'critical': return <AlertTriangle className="w-6 h-6 text-red-400" />;
      default: return <Activity className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Ingest Event"
        subtitle="Real-time Risk Assessment"
      />

      <main className="app-main-container app-content-spacing">
        <AnimatedSection className="mb-6" delayMs={80}>
          <ModelIntelligenceStrip snapshot={modelSnapshot} loading={isModelSnapshotLoading} compact />
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Form Column */}
          <AnimatedSection className="lg:col-span-6" variant="left" delayMs={120}>
            <div className="glass-card-elevated p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/25">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Event Details</h2>
                  <p className="text-xs text-slate-400">Submit event for AI analysis</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    User ID <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.user_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="e.g., user_12345"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {eventTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleEventTypeChange(type.value)}
                        className={`flex items-center justify-start gap-2 px-4 py-3 rounded-xl border transition-all ${formData.event_type === type.value
                            ? 'bg-blue-500/15 border-blue-500/40 text-white'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04] hover:border-white/[0.1]'
                          }`}
                      >
                        {type.icon}
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metadata JSON */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Metadata (JSON)
                    </label>
                    {jsonError && (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {jsonError}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      rows={8}
                      value={metadataInput}
                      onChange={(e) => handleMetadataChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 transition-all resize-none ${jsonError
                          ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                          : 'border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20'
                        }`}
                      placeholder='{"key": "value"}'
                    />
                    <div className="absolute top-3 right-3">
                      <Code className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Enter valid JSON object with event-specific data
                  </p>
                </div>

                {/* Timestamp */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timestamp
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.timestamp.slice(0, 16)}
                      onChange={(e) => setFormData(prev => ({ ...prev, timestamp: new Date(e.target.value).toISOString() }))}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.user_id || !formData.event_type}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Event...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Ingest & Analyze
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            {isSubmitting && !result ? (
              <EventResultSkeleton />
            ) : result ? (
              <>
                {/* Success Banner */}
                <AnimatedSection className="glass-card p-4 border-l-4 border-emerald-500" variant="right" delayMs={150}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Event Processed Successfully</p>
                      <p className="text-xs text-slate-400">Event ID: {result.event_id}</p>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Risk Assessment Card */}
                <AnimatedSection className="glass-card-elevated p-6 lg:p-8" variant="right" delayMs={200}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${getRiskColor(result.risk_assessment.risk_level).bg} ${getRiskColor(result.risk_assessment.risk_level).border} border`}>
                      {getRiskIcon(result.risk_assessment.risk_level)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Risk Assessment</h3>
                      <span className={`text-sm ${getRiskColor(result.risk_assessment.risk_level).text}`}>
                        {result.risk_assessment.risk_level.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-xs text-slate-400 mb-1">Risk Score</p>
                      <p className="text-3xl font-black text-white">
                        {(result.risk_assessment.risk_score * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-xs text-slate-400 mb-1">Confidence</p>
                      <p className="text-3xl font-black text-white">
                        {(result.risk_assessment.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Risk Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Threat Level</span>
                      <span className={`font-medium ${getRiskColor(result.risk_assessment.risk_level).text}`}>
                        {result.risk_assessment.category}
                      </span>
                    </div>
                    <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getRiskColor(result.risk_assessment.risk_level).bar} transition-all duration-1000`}
                        style={{ width: `${result.risk_assessment.risk_score * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-xs text-slate-400 mb-1">Category</p>
                    <p className="text-sm font-medium text-white">{result.risk_assessment.category}</p>
                  </div>
                </AnimatedSection>

                {/* Explanation Card */}
                <AnimatedSection className="glass-card p-6" variant="right" delayMs={250}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/25">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Explanation</h3>
                      <p className="text-xs text-slate-400">Model reasoning</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {result.explanation.summary}
                      </p>
                    </div>

                    {/* Factors */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Key Factors</p>
                      <ul className="space-y-2">
                        {result.explanation.factors.map((factor, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Recommendations</p>
                      <ul className="space-y-2">
                        {result.explanation.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              </>
            ) : (
              /* Empty State */
              <AnimatedSection
                className="glass-card-elevated p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]"
                variant="right"
                delayMs={180}
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-2xl" />
                  <div className="relative p-6 rounded-3xl bg-white/[0.04] border border-white/[0.06]">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Risk Analysis</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Submit an event to receive real-time risk assessment powered by our ML models.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Anomaly Detection
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Sequence Analysis
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Graph Analysis
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

function EventResultSkeleton() {
  return (
    <div className="space-y-6">
      <AnimatedSection className="glass-card p-4" variant="right" delayMs={140}>
        <LoadingSkeleton className="h-5 w-48" />
      </AnimatedSection>
      <AnimatedSection className="glass-card-elevated p-6 lg:p-8" variant="right" delayMs={190}>
        <LoadingSkeleton className="h-6 w-40 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
        </div>
        <LoadingSkeleton className="h-3 w-full rounded-full mb-6" />
        <LoadingSkeleton className="h-14 rounded-xl" />
      </AnimatedSection>
      <AnimatedSection className="glass-card p-6" variant="right" delayMs={240}>
        <LoadingSkeleton className="h-5 w-36 mb-4" />
        <LoadingSkeleton className="h-16 rounded-xl mb-4" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-10 rounded-lg" />
          <LoadingSkeleton className="h-10 rounded-lg" />
          <LoadingSkeleton className="h-10 rounded-lg" />
        </div>
      </AnimatedSection>
    </div>
  );
}
