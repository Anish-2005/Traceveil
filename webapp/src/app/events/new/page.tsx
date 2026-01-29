'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { traceveilApi, EventData, RiskAssessment } from '@/lib/api';

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

  const handleMetadataChange = (value: string) => {
    setMetadataInput(value);
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, metadata: parsed }));
      setError(null);
    } catch (e) {
      // Invalid JSON, but we'll allow it for now
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
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Ingest New Event</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                  User ID *
                </label>
                <input
                  type="text"
                  id="user_id"
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., user123"
                />
              </div>

              <div>
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                  Event Type *
                </label>
                <select
                  id="event_type"
                  required
                  value={formData.event_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select event type</option>
                  <option value="login">Login</option>
                  <option value="transaction">Transaction</option>
                  <option value="page_view">Page View</option>
                  <option value="api_call">API Call</option>
                  <option value="file_upload">File Upload</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="metadata" className="block text-sm font-medium text-gray-700">
                  Metadata (JSON)
                </label>
                <textarea
                  id="metadata"
                  rows={6}
                  value={metadataInput}
                  onChange={(e) => handleMetadataChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder='{"key": "value", "amount": 100}'
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter valid JSON object with event metadata
                </p>
              </div>

              <div>
                <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700">
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  id="timestamp"
                  value={formData.timestamp.slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({ ...prev, timestamp: new Date(e.target.value).toISOString() }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Ingest Event
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(result.risk_assessment.risk_level)}`}>
                      {result.risk_assessment.risk_level.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(result.risk_assessment.risk_score * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg text-gray-900">
                      {(result.risk_assessment.confidence * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="text-sm text-gray-900">{result.risk_assessment.category}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Summary</p>
                    <p className="text-sm text-gray-600 mt-1">{result.explanation.summary}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Key Factors</p>
                    <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                      {result.explanation.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Recommendations</p>
                    <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                      {result.explanation.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}