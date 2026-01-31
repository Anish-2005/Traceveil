'use client';

import { memo } from 'react';
import { Shield } from 'lucide-react';

/**
 * Premium skeleton loading with shimmer effects
 */
export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton rounded-xl ${className}`} />
  );
}

/**
 * Full dashboard skeleton for initial load state
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)' }}
        />
      </div>

      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="h-16 lg:h-[72px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LoadingSkeleton className="w-10 h-10 rounded-xl" />
              <div className="hidden sm:block space-y-1.5">
                <LoadingSkeleton className="w-24 h-5" />
                <LoadingSkeleton className="w-16 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LoadingSkeleton className="hidden md:block w-48 h-10 rounded-xl" />
              <LoadingSkeleton className="w-10 h-10 rounded-xl" />
              <LoadingSkeleton className="w-10 h-10 rounded-xl" />
              <LoadingSkeleton className="hidden sm:block w-32 h-10 rounded-xl" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12 space-y-10 lg:space-y-14 relative z-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5">
            <LoadingSkeleton className="h-64 rounded-2xl" />
          </div>
          <div className="lg:col-span-7">
            <LoadingSkeleton className="h-64 rounded-2xl" />
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </section>

        {/* Main content */}
        <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <LoadingSkeleton className="h-96 rounded-2xl" />
            <LoadingSkeleton className="h-80 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            <LoadingSkeleton className="h-72 rounded-2xl" />
            <LoadingSkeleton className="h-56 rounded-2xl" />
            <LoadingSkeleton className="h-48 rounded-2xl" />
          </div>
        </section>

        {/* Entity section */}
        <LoadingSkeleton className="h-64 rounded-2xl" />
      </main>

      {/* Center loading indicator */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white mb-1">Loading Dashboard</p>
            <p className="text-xs text-slate-400">Connecting to security services...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;