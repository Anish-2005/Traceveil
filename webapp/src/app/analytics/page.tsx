'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Users, AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { traceveilApi, FeedbackStats, ModelStatus } from '@/lib/api';

export default function AnalyticsPage() {
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [feedback, models] = await Promise.all([
        traceveilApi.getFeedbackStats(),
        traceveilApi.getModelStatus(),
      ]);
      setFeedbackStats(feedback);
      setModelStatus(models);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
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
                <BarChart3 className="h-5 w-5" />
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            </div>
            <button
              onClick={loadAnalytics}
              disabled={isLoading}
              className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">15,247</p>
                <p className="text-xs text-green-600">+12% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Risk Alerts</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-xs text-red-600">+5% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">2,341</p>
                <p className="text-xs text-green-600">+8% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Detection Rate</p>
                <p className="text-2xl font-bold text-gray-900">96.4%</p>
                <p className="text-xs text-green-600">+2.1% from last week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Low Risk</span>
                </div>
                <span className="text-sm font-medium text-gray-900">68.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Medium Risk</span>
                </div>
                <span className="text-sm font-medium text-gray-900">24.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">High Risk</span>
                </div>
                <span className="text-sm font-medium text-gray-900">6.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-800 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Critical Risk</span>
                </div>
                <span className="text-sm font-medium text-gray-900">1.0%</span>
              </div>
            </div>
          </div>

          {/* Model Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Anomaly Detection</span>
                  <span className="font-medium text-gray-900">94.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sequence Analysis</span>
                  <span className="font-medium text-gray-900">89.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '89.7%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Graph Analysis</span>
                  <span className="font-medium text-gray-900">91.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Accuracy</span>
                  <span className="font-medium text-gray-900">96.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '96.4%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Stats & Model Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Statistics</h3>
            {feedbackStats ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Feedback</span>
                  <span className="text-sm font-medium text-gray-900">{feedbackStats.total_feedback}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accuracy Improvements</span>
                  <span className="text-sm font-medium text-gray-900">{feedbackStats.accuracy_improvements}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Model Updates</span>
                  <span className="text-sm font-medium text-gray-900">{feedbackStats.model_updates}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p>Loading feedback statistics...</p>
              </div>
            )}
          </div>

          {/* Model Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Status</h3>
            {modelStatus ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Models</p>
                  <div className="flex flex-wrap gap-2">
                    {modelStatus.current_models.map((model, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Model Versions</p>
                  <div className="space-y-1">
                    {Object.entries(modelStatus.model_versions).map(([model, version]) => (
                      <div key={model} className="flex justify-between text-sm">
                        <span className="text-gray-600">{model}</span>
                        <span className="font-medium text-gray-900">{version}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p>Loading model status...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}