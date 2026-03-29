export default function GlobalLoading() {
  return (
    <div className="app-shell relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -right-28 h-[420px] w-[420px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-36 -left-24 h-[380px] w-[380px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)' }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="space-y-2">
            <div className="h-4 w-28 skeleton rounded" />
            <div className="h-8 w-64 skeleton rounded" />
          </div>
          <div className="h-10 w-32 skeleton rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"
            >
              <div className="mb-4 h-8 w-8 skeleton rounded-lg" />
              <div className="mb-3 h-7 w-20 skeleton rounded" />
              <div className="h-4 w-28 skeleton rounded" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 h-[320px] rounded-2xl border border-white/[0.07] bg-white/[0.03] skeleton" />
          <div className="lg:col-span-4 h-[320px] rounded-2xl border border-white/[0.07] bg-white/[0.03] skeleton" />
        </div>
      </main>
    </div>
  );
}
