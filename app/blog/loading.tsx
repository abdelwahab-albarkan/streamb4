export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-white/[0.04] rounded w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.05]">
                <div className="aspect-video bg-white/[0.04]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-white/[0.04] rounded w-24" />
                  <div className="h-5 bg-white/[0.05] rounded w-full" />
                  <div className="h-5 bg-white/[0.04] rounded w-4/5" />
                  <div className="h-3 bg-white/[0.03] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
