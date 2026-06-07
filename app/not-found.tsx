export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-6xl">404</p>
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-gray-400 text-sm">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
        >
          Go home
        </a>
      </div>
    </div>
  )
}
