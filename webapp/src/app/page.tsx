'use client';

/**
 * Traceveil Dashboard - Main Page
 * 
 * The primary dashboard interface for the Traceveil threat intelligence platform.
 * Provides real-time monitoring of security threats, system health, and ML models.
 * 
 * Architecture:
 * - Uses custom `useDashboardData` hook for data fetching with auto-refresh
 * - All major sections are extracted into focused, reusable components
 * - Error boundaries wrap content to prevent cascade failures
 * - Progressive loading states for better UX
 */

import { Activity, AlertTriangle } from 'lucide-react';

import { useDashboardData } from '@/hooks';
import {
  MetricCard,
  DashboardHeader,
  PrimaryKPICard,
  ThreatIntelligenceMap,
  ThreatActivityTimeline,
  SystemHealthPanel,
  ActiveModelsPanel,
  QuickActionsPanel,
  EntityMonitoringSection,
  DashboardSkeleton,
  ErrorBoundary,
} from '@/components';
import { formatResponseTime } from '@/lib/constants';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function DashboardPage() {
  const {
    metrics,
    models,
    isLoading,
    error,
    lastUpdated,
    refresh,
  } = useDashboardData();

  // Loading State
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refresh}
      />
    );
  }

  // Main Dashboard
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <BackgroundEffects />

        {/* Header */}
        <DashboardHeader
          alertCount={metrics?.critical_threats ?? 0}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 relative z-10">
          {/* Hero Metrics Section */}
          <section
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            aria-label="Key performance indicators"
          >
            {/* Primary KPI */}
            <div className="lg:col-span-4">
              <PrimaryKPICard metrics={metrics} />
            </div>

            {/* Secondary Metrics */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <MetricCard
                icon={<Activity className="w-6 h-6" />}
                label="Active Monitoring"
                value={metrics?.active_monitoring?.toLocaleString() ?? '2,847'}
                subtext="real-time streams"
                trend="+8.2%"
                trendUp={true}
                color="emerald"
              />
              <MetricCard
                icon={<AlertTriangle className="w-6 h-6" />}
                label="Critical Threats"
                value={metrics?.critical_threats?.toString() ?? '17'}
                subtext="require action"
                trend="-23.1%"
                trendUp={false}
                color="red"
                pulse={(metrics?.critical_threats ?? 0) > 0}
              />
              <MetricCard
                icon={<Activity className="w-6 h-6" />}
                label="Avg Response Time"
                value={metrics?.avg_response_time
                  ? formatResponseTime(metrics.avg_response_time)
                  : '0.3ms'}
                subtext="detection latency"
                trend="-41ms"
                trendUp={false}
                color="amber"
              />
            </div>
          </section>

          {/* Command Center Section */}
          <section
            className="grid lg:grid-cols-12 gap-10"
            aria-label="Threat intelligence and system status"
          >
            {/* Left Column - Threat Intelligence */}
            <div className="lg:col-span-8 space-y-8">
              <ThreatIntelligenceMap
                metrics={metrics}
                lastUpdated={lastUpdated}
              />
              <ThreatActivityTimeline
                metrics={metrics}
              />
            </div>

            {/* Right Column - System Status & Actions */}
            <div className="lg:col-span-4 space-y-8">
              <SystemHealthPanel metrics={metrics} />
              <ActiveModelsPanel models={models} />
              <QuickActionsPanel />
            </div>
          </section>

          {/* Entity Monitoring Section */}
          <EntityMonitoringSection metrics={metrics} />
        </main>
      </div>
    </ErrorBoundary>
  );
}

// ============================================================================
// SUPPORTING COMPONENTS
// ============================================================================

/**
 * Animated background effects for the dashboard
 */
function BackgroundEffects() {
  return (
    <>
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '10s' }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s', animationDuration: '12s' }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-64 h-64 bg-emerald-500/4 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '6s', animationDuration: '9s' }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    </>
  );
}

/**
 * Error state display with retry capability
 */
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-8">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-2xl opacity-50" aria-hidden="true" />
          <div className="relative p-6 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-red-400/20 shadow-2xl">
            <AlertTriangle className="h-16 w-16 text-red-300 mx-auto drop-shadow-lg" aria-hidden="true" />
          </div>
        </div>

        {/* Error Content */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Connection Error
        </h2>
        <p className="text-red-300 mb-6 leading-relaxed">
          Unable to load dashboard data from the server.
        </p>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Retry Button */}
        <button
          type="button"
          onClick={onRetry}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 font-semibold text-white transition-all duration-200 shadow-xl shadow-red-500/30 hover:shadow-red-400/40 hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
        >
          <span className="flex items-center gap-3">
            <Activity className="w-5 h-5" aria-hidden="true" />
            Retry Connection
          </span>
        </button>
      </div>
    </div>
  );
}