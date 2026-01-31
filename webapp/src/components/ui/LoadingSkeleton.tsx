export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0E13] text-gray-100">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0A0E13]/80 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-8 h-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <LoadingSkeleton className="w-14 h-14 rounded-xl" />
              <div>
                <LoadingSkeleton className="w-24 h-6 mb-2" />
                <LoadingSkeleton className="w-32 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LoadingSkeleton className="w-10 h-10 rounded-lg" />
              <LoadingSkeleton className="w-24 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-8 py-8 space-y-8">
        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <LoadingSkeleton className="lg:col-span-4 h-32" />
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <LoadingSkeleton className="h-80" />
            <LoadingSkeleton className="h-64" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <LoadingSkeleton className="h-64" />
            <LoadingSkeleton className="h-48" />
            <LoadingSkeleton className="h-32" />
          </div>
        </div>

        {/* Entity Monitoring Skeleton */}
        <LoadingSkeleton className="h-64" />
      </main>
    </div>
  );
}