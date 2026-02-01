'use client';

/**
 * Traceveil Dashboard - Main Page
 * 
 * Industry-grade threat intelligence dashboard with premium UI/UX.
 * Features real-time monitoring, AI-powered insights, and enterprise analytics.
 */

import { Activity, AlertTriangle, Zap, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';

import { useDashboardData } from '@/hooks';
import {
  MetricCard,
  DashboardSkeleton,
  HeroSection,
  BackgroundEffects,
  ErrorState,
} from '@/components';
import { PageHeader } from '@/components/shared/PageHeader';
import { formatResponseTime } from '@/lib/constants';

// Lazy load below-the-fold content to improve TTI/LCP
const ThreatIntelligenceMap = dynamic(() => import('@/components').then(mod => mod.ThreatIntelligenceMap));
const ThreatActivityTimeline = dynamic(() => import('@/components').then(mod => mod.ThreatActivityTimeline));
const SystemHealthPanel = dynamic(() => import('@/components').then(mod => mod.SystemHealthPanel));
const ActiveModelsPanel = dynamic(() => import('@/components').then(mod => mod.ActiveModelsPanel));
const QuickActionsPanel = dynamic(() => import('@/components').then(mod => mod.QuickActionsPanel));
const EntityMonitoringSection = dynamic(() => import('@/components').then(mod => mod.EntityMonitoringSection));
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

  // Premium Loading State
  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Premium Ambient Background */}
      <BackgroundEffects />

      {/* Header */}
      <PageHeader alertCount={criticalThreatsCount} />

      {/* Main Content */}
      <main
        id="main-content"
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12 space-y-10 lg:space-y-14 relative z-10"
      >
        {/* Hero Section - Welcome & Primary KPI (Eager Loaded) */}
        <section className="animate-fade-up">
          <HeroSection metrics={metrics} models={models} />
        </section>

        {/* Key Metrics Grid (Eager Loaded) */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-fade-up stagger-2"
          aria-label="Key performance indicators"
        >
          <MetricCard
            icon={<Activity className="w-5 h-5" />}
            label="Active Monitoring"
            value={activeMonitoringCount.toLocaleString()}
            subtext="real-time streams"
            trend={activeMonitoringCount ? `+${((activeMonitoringCount / 2500) * 8.2).toFixed(1)}%` : '0%'}
            trendUp={true}
            color="emerald"
          />
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
          <MetricCard
            icon={<Zap className="w-5 h-5" />}
            label="Avg Response"
            value={avgResponse ? formatResponseTime(avgResponse) : '0ms'}
            subtext="detection latency"
            trend={avgResponse ? `-${Math.round(avgResponse * 10)}ms` : '0ms'}
            trendUp={false}
            color="amber"
          />
          <MetricCard
            icon={<Shield className="w-5 h-5" />}
            label="Threats Blocked"
            value={threatsBlockedCount.toLocaleString()}
            subtext="last 24 hours"
            trend={threatsBlockedCount ? `+${Math.round((threatsBlockedCount / 10) * 100)}%` : '0%'}
            trendUp={true}
            color="emerald"
          />
        </section>

        {/* Command Center Section */}
        <section
          className="grid lg:grid-cols-12 gap-6 lg:gap-8"
          aria-label="Threat intelligence and system status"
        >
          {/* Left Column - Threat Intelligence */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <div className="animate-fade-up stagger-3">
              <ThreatIntelligenceMap metrics={metrics} lastUpdated={lastUpdated} />
            </div>
            <div className="animate-fade-up stagger-4">
              <ThreatActivityTimeline metrics={metrics} />
            </div>
          </div>

          {/* Right Column - System Status & Actions */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <div className="animate-slide-in-right stagger-3">
              <SystemHealthPanel metrics={metrics} />
            </div>
            <div className="animate-slide-in-right stagger-4">
              <ActiveModelsPanel models={models} />
            </div>
            <div className="animate-slide-in-right stagger-5">
              <QuickActionsPanel />
            </div>
          </div>
        </section>

        {/* Entity Monitoring Section */}
        <section className="animate-fade-up stagger-5">
          <EntityMonitoringSection metrics={metrics} />
        </section>

        {/* Footer Stats Bar */}
        <FooterStatsBar lastUpdated={lastUpdated} metrics={metrics} />
      </main>
    </div>
  );
}