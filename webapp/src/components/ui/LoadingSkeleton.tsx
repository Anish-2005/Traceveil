export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-white/5 via-white/8 to-white/5 rounded-xl ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-900/80 border-b border-white/10 shadow-lg">
        <div className="max-w-[1920px] mx-auto px-8 h-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-6">
              <LoadingSkeleton className="w-16 h-16 rounded-2xl" />
              <div>
                <LoadingSkeleton className="w-32 h-8 mb-3" />
                <LoadingSkeleton className="w-48 h-4 mb-2" />
                <LoadingSkeleton className="w-40 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LoadingSkeleton className="w-12 h-12 rounded-xl" />
              <LoadingSkeleton className="w-32 h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-8 py-12 space-y-12">
        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <LoadingSkeleton className="lg:col-span-4 h-48 rounded-3xl" />
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <LoadingSkeleton className="h-40 rounded-2xl" />
            <LoadingSkeleton className="h-40 rounded-2xl" />
            <LoadingSkeleton className="h-40 rounded-2xl" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <LoadingSkeleton className="h-96 rounded-3xl" />
            <LoadingSkeleton className="h-80 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <LoadingSkeleton className="h-80 rounded-3xl" />
            <LoadingSkeleton className="h-64 rounded-3xl" />
            <LoadingSkeleton className="h-48 rounded-3xl" />
          </div>
        </div>

        {/* Entity Monitoring Skeleton */}
        <LoadingSkeleton className="h-72 rounded-3xl" />
      </main>
    </div>
  );
}