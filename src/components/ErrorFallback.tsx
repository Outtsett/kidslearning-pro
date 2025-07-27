import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md text-center">
        <div className="text-6xl mb-4">😅</div>
        <h2 className="text-xl font-heading font-semibold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Don't worry, we're working on fixing this!"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-heading hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
