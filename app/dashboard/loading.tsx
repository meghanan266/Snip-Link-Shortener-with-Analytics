export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="bg-gray-900 px-4 py-3 flex gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="px-4 py-3 flex gap-8 border-t border-gray-800">
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-10 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
