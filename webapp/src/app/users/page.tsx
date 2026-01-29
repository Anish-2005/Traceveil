'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { traceveilApi, UserRisk } from '@/lib/api';

export default function UsersPage() {
  const [userId, setUserId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userRisk, setUserRisk] = useState<UserRisk | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsSearching(true);
    setError(null);
    setUserRisk(null);

    try {
      const result = await traceveilApi.getUserRisk(userId.trim());
      setUserRisk(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user risk');
    } finally {
      setIsSearching(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <Shield className="h-5 w-5 text-green-500" />;
      case 'medium': return <TrendingUp className="h-5 w-5 text-yellow-500" />;
      case 'high':
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <User className="h-5 w-5 text-gray-500" />;
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
                <User className="h-5 w-5" />
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">User Risk Assessment</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Check User Risk</h2>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID (e.g., user123)"
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Risk
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* User Risk Results */}
        {userRisk && (
          <div className="space-y-6">
            {/* Risk Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Risk Assessment for {userRisk.user_id}</h3>
                <div className="flex items-center">
                  {getRiskIcon(userRisk.risk_assessment.risk_level)}
                  <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(userRisk.risk_assessment.risk_level)}`}>
                    {userRisk.risk_assessment.risk_level.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {(userRisk.risk_assessment.risk_score * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Risk Score</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {(userRisk.risk_assessment.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{userRisk.recent_events}</p>
                  <p className="text-sm text-gray-600">Recent Events</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-sm font-medium text-gray-900">{userRisk.risk_assessment.category}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Summary</p>
                  <p className="text-sm text-gray-600 mt-1">{userRisk.explanation.summary}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Key Risk Factors</p>
                  <ul className="text-sm text-gray-600 mt-1 list-disc list-inside space-y-1">
                    {userRisk.explanation.factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Recommendations</p>
                  <ul className="text-sm text-gray-600 mt-1 list-disc list-inside space-y-1">
                    {userRisk.explanation.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  View Full History
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                  Export Report
                </button>
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                  Mark as Reviewed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!userRisk && !isSearching && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Search for a user to view their risk assessment</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}