export default function AnalyticsLoading() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
          <div className="h-7 w-64 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-2">
              <div className="h-3 w-20 bg-gray-800 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
          <div className="h-48 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="h-32 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
