import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorFallback extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md text-center">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-xl font-heading font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              Don't worry, we're working on fixing this! Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-heading hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}