export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 animate-pulse">
        <div className="h-3 bg-white/[0.04] rounded w-48 mb-10" />
        <div className="h-4 bg-white/[0.04] rounded w-24 mb-4" />
        <div className="h-10 bg-white/[0.06] rounded w-full mb-2" />
        <div className="h-10 bg-white/[0.05] rounded w-4/5 mb-6" />
        <div className="h-3 bg-white/[0.04] rounded w-56 mb-10" />
        <div className="aspect-video bg-white/[0.04] rounded-2xl mb-10" />
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${60 + Math.abs(Math.sin(i * 2.3)) * 38}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
