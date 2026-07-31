import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Exception captured by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-gray-200/80 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 text-[#FA394A] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Something went wrong</h1>
              <p className="text-xs text-gray-500 leading-relaxed">
                {this.props.fallbackMessage ||
                  'An unexpected rendering error occurred. The system has safely captured this crash.'}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-left overflow-x-auto max-h-36">
                <p className="text-[11px] font-mono font-bold text-red-600 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-[#FA394A] hover:bg-[#D92B3B] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-[#333333] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
