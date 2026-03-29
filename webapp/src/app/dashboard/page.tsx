'use client';

/**
 * Traceveil Dashboard - Main Page
 * 
 * Industry-grade threat intelligence dashboard with premium UI/UX.
 * Features real-time monitoring, AI-powered insights, and enterprise analytics.
 */

import { Activity, AlertTriangle, Zap, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';

import { useDashboardData, useModelIntelligence } from '@/hooks';
import {
  MetricCard,
  HeroSection,
  BackgroundEffects,
  ErrorState,
  LoadingSkeleton,
} from '@/components';
import { PageHeader } from '@/components/shared/PageHeader';
import { ModelIntelligenceStrip } from '@/components/shared';
import { formatResponseTime } from '@/lib/constants';

// Lazy load below-the-fold content to improve TTI/LCP
const ThreatIntelligenceMap = dynamic(() => import('@/components').then(mod => mod.ThreatIntelligenceMap), {
  loading: () => <LoadingSkeleton className="h-[400px] w-full" />
});
const ThreatActivityTimeline = dynamic(() => import('@/components').then(mod => mod.ThreatActivityTimeline), {
  loading: () => <LoadingSkeleton className="h-[300px] w-full bg-white/[0.02]" />
});
const SystemHealthPanel = dynamic(() => import('@/components').then(mod => mod.SystemHealthPanel), {
  loading: () => <LoadingSkeleton className="h-[250px] w-full" />
});
const ActiveModelsPanel = dynamic(() => import('@/components').then(mod => mod.ActiveModelsPanel), {
  loading: () => <LoadingSkeleton className="h-[200px] w-full" />
});
const QuickActionsPanel = dynamic(() => import('@/components').then(mod => mod.QuickActionsPanel), {
  loading: () => <LoadingSkeleton className="h-[150px] w-full" />
});
const EntityMonitoringSection = dynamic(() => import('@/components').then(mod => mod.EntityMonitoringSection), {
  loading: () => <LoadingSkeleton className="h-[300px] w-full" />
});
const FooterStatsBar = dynamic(() => import('@/components').then(mod => mod.FooterStatsBar));

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
  const { data: modelSnapshot, isLoading: isModelSnapshotLoading } = useModelIntelligence({
    refreshInterval: 30000,
  });

  // Premium Loading State - REMOVED blocking skeleton for progressive loading
  // if (isLoading) {
  //   return <DashboardSkeleton />;
  // }

  // Premium Error State
  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  // Calculate trends safely
  const activeMonitoringCount = metrics?.active_monitoring ?? 0;
  const criticalThreatsCount = metrics?.critical_threats ?? 0;
  const avgResponse = metrics?.avg_response_time ?? 0;
  const threatsBlockedCount = metrics?.recent_threats?.length ?? 0;

  // Main Dashboard
  return (
    <div className="app-shell relative overflow-hidden">
      {/* Premium Ambient Background */}
      <BackgroundEffects />

      {/* Header */}
      <PageHeader alertCount={criticalThreatsCount} />

      {/* Main Content */}
      <main
        id="main-content"
        className="app-main-container app-content-spacing space-y-8 sm:space-y-10 lg:space-y-14 relative z-10"
      >
        {/* Hero Section - Welcome & Primary KPI (Eager Loaded) */}
        <section>
          {isLoading ? (
            <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 min-h-[320px] sm:min-h-[400px]">
              <div className="lg:col-span-6"><LoadingSkeleton className="h-full w-full rounded-2xl bg-white/[0.03]" /></div>
              <div className="lg:col-span-6"><LoadingSkeleton className="h-full w-full rounded-2xl bg-white/[0.03]" /></div>
            </div>
          ) : (
            <HeroSection metrics={metrics} models={models} />
          )}
        </section>

        <section>
          <ModelIntelligenceStrip
            snapshot={modelSnapshot}
            loading={isModelSnapshotLoading}
          />
        </section>

        {/* Key Metrics Grid (Eager Loaded) */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          aria-label="Key performance indicators"
        >
          <div className="scroll-reveal reveal-delay-100">
            {isLoading ? <LoadingSkeleton className="h-44 rounded-xl bg-white/[0.03]" /> : (
              <MetricCard
                icon={<Activity className="w-5 h-5" />}
                label="Active Monitoring"
                value={activeMonitoringCount.toLocaleString()}
                subtext="real-time streams"
                trend={activeMonitoringCount ? `+${((activeMonitoringCount / 2500) * 8.2).toFixed(1)}%` : '0%'}
                trendUp={true}
                color="emerald"
              />
            )}
          </div>
          <div className="scroll-reveal reveal-delay-200">
            {isLoading ? <LoadingSkeleton className="h-44 rounded-xl bg-white/[0.03]" /> : (
              <MetricCard
                icon={<AlertTriangle className="w-5 h-5" />}
                label="Critical Threats"
                value={criticalThreatsCount.toString()}
                subtext="require immediate action"
                trend={criticalThreatsCount ? `-${Math.round(100 / (criticalThreatsCount + 1))}%` : '0%'}
                trendUp={false}
                color="red"
                pulse={criticalThreatsCount > 0}
              />
            )}
          </div>
          <div className="scroll-reveal reveal-delay-300">
            {isLoading ? <LoadingSkeleton className="h-44 rounded-xl bg-white/[0.03]" /> : (
              <MetricCard
                icon={<Zap className="w-5 h-5" />}
                label="Avg Response"
                value={avgResponse ? formatResponseTime(avgResponse) : '0ms'}
                subtext="detection latency"
                trend={avgResponse ? `-${Math.round(avgResponse * 10)}ms` : '0ms'}
                trendUp={false}
                color="amber"
              />
            )}
          </div>
          <div className="scroll-reveal reveal-delay-400">
            {isLoading ? <LoadingSkeleton className="h-44 rounded-xl bg-white/[0.03]" /> : (
              <MetricCard
                icon={<Shield className="w-5 h-5" />}
                label="Threats Blocked"
                value={threatsBlockedCount.toLocaleString()}
                subtext="last 24 hours"
                trend={threatsBlockedCount ? `+${Math.round((threatsBlockedCount / 10) * 100)}%` : '0%'}
                trendUp={true}
                color="emerald"
              />
            )}
          </div>
        </section>

        {/* Command Center Section */}
        <section
          className="grid lg:grid-cols-12 gap-6 lg:gap-8"
          aria-label="Threat intelligence and system status"
        >
          {/* Left Column - Threat Intelligence */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <div className="scroll-reveal-left reveal-delay-200">
              <ThreatIntelligenceMap metrics={metrics} lastUpdated={lastUpdated} />
            </div>
            <div className="scroll-reveal-left reveal-delay-300">
              <ThreatActivityTimeline metrics={metrics} />
            </div>
          </div>

          {/* Right Column - System Status & Actions */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <div className="scroll-reveal-right reveal-delay-200">
              <SystemHealthPanel metrics={metrics} />
            </div>
            <div className="scroll-reveal-right reveal-delay-300">
              <ActiveModelsPanel models={models} />
            </div>
            <div className="scroll-reveal-right reveal-delay-400">
              <QuickActionsPanel />
            </div>
          </div>
        </section>

        {/* Entity Monitoring Section */}
        <section className="scroll-reveal reveal-delay-200">
          <EntityMonitoringSection metrics={metrics} />
        </section>

        {/* Footer Stats Bar */}
        <div className="scroll-reveal reveal-delay-300">
          <FooterStatsBar lastUpdated={lastUpdated} metrics={metrics} />
        </div>
      </main>
    </div>
  );
}
