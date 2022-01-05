import { Component, ReactNode } from "react"

export interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error) => void
  renderError?: (error: Error) => JSX.Element
}

export interface ErrorBoundaryState {
  error: Error | null
}

export function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value
  } else {
    return Error(typeof value === "string" ? value : "Unknown error")
  }
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(rawError: unknown): ErrorBoundaryState {
    return { error: toError(rawError) }
  }

  componentDidCatch(rawError: unknown) {
    const { onError } = this.props

    if (onError) {
      onError(toError(rawError))
    } else {
      console.error(rawError)
    }
  }

  render() {
    const { children, renderError } = this.props
    const { error } = this.state

    if (error) {
      return renderError ? renderError(error) : error.message
    }

    return children
  }
}
