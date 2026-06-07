"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-6xl">⚠️</p>
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-red-400 text-xs font-mono bg-gray-900 px-3 py-2 rounded max-w-sm mx-auto break-all">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm border border-gray-700"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
