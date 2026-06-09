import { Component, type ReactNode, type ErrorInfo } from 'react'
import { notifyError } from '@utils/errorNotifier'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    notifyError(error)
  }

  private handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="error-boundary">
          <p className="error-boundary__message">
            Ocurrió un error inesperado en esta sección.
          </p>
          <button className="error-boundary__btn" onClick={this.handleReload}>
            Recargar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
