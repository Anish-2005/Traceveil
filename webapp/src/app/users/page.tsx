'use client';

/**
 * Users Page - User Risk Assessment Dashboard
 * 
 * Premium threat-hunting interface for analyzing user risk profiles
 * with real-time risk visualization and detailed explanations.
 */

import { useState } from 'react';
import {
  Search,
  User,
  AlertTriangle,
  Shield,
  TrendingUp,
  Activity,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { PageLayout, PageHeader } from '@/components/shared';
import { traceveilApi, UserRisk } from '@/lib/api';

export default function UsersPage() {
  const [userId, setUserId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userRisk, setUserRisk] = useState<UserRisk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsSearching(true);
    setError(null);
    setUserRisk(null);

    try {
      const result = await traceveilApi.getUserRisk(userId.trim());
      setUserRisk(result);
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [userId.trim(), ...prev.filter(id => id !== userId.trim())].slice(0, 5);
        return newHistory;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user risk');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (id: string) => {
    setUserId(id);
    // Trigger search
    const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
    setUserId(id);
    setTimeout(() => {
      const form = document.getElementById('search-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 0);
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return { bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400' };
      case 'medium': return { bg: 'bg-amber-500/15', border: 'border-amber-500/25', text: 'text-amber-400' };
      case 'high': return { bg: 'bg-orange-500/15', border: 'border-orange-500/25', text: 'text-orange-400' };
      case 'critical': return { bg: 'bg-red-500/15', border: 'border-red-500/25', text: 'text-red-400' };
      default: return { bg: 'bg-slate-500/15', border: 'border-slate-500/25', text: 'text-slate-400' };
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'medium': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'high':
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <User className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="User Risk Assessment"
        subtitle="Threat Hunting & Analysis"
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Search & History */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search Card */}
            <div className="glass-card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Search User</h2>
                  <p className="text-xs text-slate-400">Enter user ID to analyze</p>
                </div>
              </div>

              <form id="search-form" onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID (e.g., user123)"
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Analyze Risk
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-300">Recent Searches</h3>
                </div>
                <div className="space-y-2">
                  {searchHistory.map((id, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickSearch(id)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-300">{id}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-slate-300">How It Works</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-400">1.</span>
                  Anomaly detection analyzes behavioral patterns
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">2.</span>
                  Sequence model evaluates temporal activity
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">3.</span>
                  Graph analysis examines network relationships
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-8 space-y-6">
            {userRisk ? (
              <>
                {/* Risk Overview Card */}
                <div className="glass-card-elevated p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* User Info & Risk Level */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`p-4 rounded-2xl ${getRiskColor(userRisk.risk_assessment.risk_level).bg} border ${getRiskColor(userRisk.risk_assessment.risk_level).border}`}>
                          {getRiskIcon(userRisk.risk_assessment.risk_level)}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{userRisk.user_id}</h2>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(userRisk.risk_assessment.risk_level).bg} ${getRiskColor(userRisk.risk_assessment.risk_level).border} border ${getRiskColor(userRisk.risk_assessment.risk_level).text}`}>
                            {userRisk.risk_assessment.risk_level.toUpperCase()}
                          </span>
                          <span className="text-sm text-slate-400">
                            {userRisk.risk_assessment.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Score Circle */}
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                          <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke={userRisk.risk_assessment.risk_score > 0.7 ? '#ef4444' : userRisk.risk_assessment.risk_score > 0.4 ? '#f59e0b' : '#10b981'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 42}
                            strokeDashoffset={2 * Math.PI * 42 * (1 - userRisk.risk_assessment.risk_score)}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-white">
                            {(userRisk.risk_assessment.risk_score * 100).toFixed(0)}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Risk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {(userRisk.risk_assessment.risk_score * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Risk Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {(userRisk.risk_assessment.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Confidence</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {userRisk.recent_events}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Recent Events</p>
                    </div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/25">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Risk Analysis</h3>
                      <p className="text-xs text-slate-400">AI-powered threat assessment</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-sm font-medium text-slate-300 mb-2">Summary</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {userRisk.explanation.summary}
                      </p>
                    </div>

                    {/* Key Factors */}
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Key Risk Factors
                      </p>
                      <ul className="space-y-2">
                        {userRisk.explanation.factors.map((factor, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Recommendations
                      </p>
                      <ul className="space-y-2">
                        {userRisk.explanation.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="glass-card p-6">
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
                      <Activity className="w-4 h-4" />
                      View Full History
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 font-medium transition-colors">
                      <FileText className="w-4 h-4" />
                      Export Report
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Mark Reviewed
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="glass-card-elevated p-12 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl" />
                  <div className="relative p-6 rounded-3xl bg-white/[0.04] border border-white/[0.06]">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Search for a User</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Enter a user ID to analyze their risk profile using our AI-powered threat detection models.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}