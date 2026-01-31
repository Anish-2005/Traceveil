'use client';

/**
 * Traceveil Dashboard - Main Page
 * 
 * Industry-grade threat intelligence dashboard with premium UI/UX.
 * Features real-time monitoring, AI-powered insights, and enterprise analytics.
 */

import { Activity, AlertTriangle, Zap, Shield, TrendingUp, ArrowUpRight } from 'lucide-react';

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

  // Premium Loading State
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Premium Error State
  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  // Main Dashboard
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden">
        {/* Premium Ambient Background */}
        <BackgroundEffects />

        {/* Header */}
        <DashboardHeader alertCount={metrics?.critical_threats ?? 0} />

        {/* Main Content */}
        <main
          id="main-content"
          className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12 space-y-10 lg:space-y-14 relative z-10"
        >
          {/* Hero Section - Welcome & Primary KPI */}
          <section className="animate-fade-up">
            <HeroSection metrics={metrics} models={models} />
          </section>

          {/* Metrics Grid */}
          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-fade-up stagger-2"
            aria-label="Key performance indicators"
          >
            <MetricCard
              icon={<Activity className="w-5 h-5" />}
              label="Active Monitoring"
              value={metrics?.active_monitoring?.toLocaleString() ?? '2,847'}
              subtext="real-time streams"
              trend="+8.2%"
              trendUp={true}
              color="emerald"
            />
            <MetricCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Critical Threats"
              value={metrics?.critical_threats?.toString() ?? '17'}
              subtext="require immediate action"
              trend="-23.1%"
              trendUp={false}
              color="red"
              pulse={(metrics?.critical_threats ?? 0) > 0}
            />
            <MetricCard
              icon={<Zap className="w-5 h-5" />}
              label="Avg Response"
              value={metrics?.avg_response_time
                ? formatResponseTime(metrics.avg_response_time)
                : '4.2ms'}
              subtext="detection latency"
              trend="-41ms"
              trendUp={false}
              color="amber"
            />
            <MetricCard
              icon={<Shield className="w-5 h-5" />}
              label="Threats Blocked"
              value="12,847"
              subtext="last 24 hours"
              trend="+156%"
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
          <FooterStatsBar lastUpdated={lastUpdated} />
        </main>
      </div>
    </ErrorBoundary>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

interface HeroSectionProps {
  metrics: any;
  models: any;
}

function HeroSection({ metrics, models }: HeroSectionProps) {
  const detectionRate = metrics?.threat_detection_rate ?? 0.968;
  const formattedRate = `${(detectionRate * 100).toFixed(1)}%`;

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Welcome Card */}
      <div className="lg:col-span-5 glass-card-elevated p-6 lg:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-overline mb-2">Welcome back</p>
            <h1 className="text-heading gradient-text mb-3">Command Center</h1>
            <p className="text-body max-w-md">
              Your AI-powered security dashboard is monitoring{' '}
              <span className="text-white font-semibold">{metrics?.active_monitoring?.toLocaleString() ?? '2,847'}</span>{' '}
              real-time data streams.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              All Systems Online
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <QuickStat
            label="Events Processed"
            value="2.4M"
            subtext="today"
            icon={<Activity className="w-4 h-4" />}
          />
          <QuickStat
            label="Models Active"
            value={models?.models?.length?.toString() ?? '12'}
            subtext="deployed"
            icon={<Shield className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Primary KPI Card */}
      <div className="lg:col-span-7">
        <PrimaryKPICard metrics={metrics} />
      </div>
    </div>
  );
}

// ============================================================================
// QUICK STAT COMPONENT
// ============================================================================

interface QuickStatProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}

function QuickStat({ label, value, subtext, icon }: QuickStatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-caption">{label}</p>
        <p className="text-lg font-bold text-white">
          {value}{' '}
          <span className="text-xs font-normal text-slate-400">{subtext}</span>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// FOOTER STATS BAR
// ============================================================================

interface FooterStatsBarProps {
  lastUpdated: Date;
}

function FooterStatsBar({ lastUpdated }: FooterStatsBarProps) {
  return (
    <div className="glass-card p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-slate-400">
              Last updated:{' '}
              <time className="text-white font-medium" dateTime={lastUpdated.toISOString()}>
                {lastUpdated.toLocaleTimeString()}
              </time>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>98.7% uptime this month</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-ghost text-sm flex items-center gap-2">
            <span>View Analytics</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button className="btn-primary text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BACKGROUND EFFECTS
// ============================================================================

function BackgroundEffects() {
  return (
    <>
      {/* Primary gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Top-right blue orb */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        {/* Bottom-left purple orb */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite reverse',
            animationDelay: '2s',
          }}
        />

        {/* Center cyan accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
            animation: 'pulse-glow 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top gradient overlay */}
      <div
        className="fixed top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.8), transparent)',
        }}
        aria-hidden="true"
      />
    </>
  );
}

// ============================================================================
// ERROR STATE
// ============================================================================

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-8 animate-scale-in">
        {/* Error Icon */}
        <div className="relative mb-8 inline-block">
          <div
            className="absolute inset-0 bg-red-500/20 rounded-3xl blur-2xl"
            aria-hidden="true"
          />
          <div className="relative p-8 rounded-3xl glass-card-elevated border-red-500/20">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" aria-hidden="true" />
          </div>
        </div>

        {/* Error Content */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Connection Error
        </h2>
        <p className="text-red-300/80 mb-4 leading-relaxed">
          Unable to load dashboard data from the server.
        </p>
        <p className="text-sm text-slate-500 mb-8 font-mono bg-slate-900/50 p-3 rounded-lg border border-white/5">
          {message}
        </p>

        {/* Retry Button */}
        <button
          type="button"
          onClick={onRetry}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 font-semibold text-white transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-red-400/40 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]"
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