"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { Button } from './ui/button'
import LogoutButton from './logout-button'
import { Refresh } from 'iconsax-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  isAuthError: boolean
}

class RedirectErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isAuthError: false
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's an authentication error
    const isAuthError = error.message.toLowerCase().includes('auth') || 
                       error.message.toLowerCase().includes('unauthorized') ||
                       error.message.toLowerCase().includes('unauthenticated') ||
                       error.message.toLowerCase().includes('session') ||
                       error.message.toLowerCase().includes('token')
    
    return {
      hasError: true,
      error,
      isAuthError
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by RedirectErrorBoundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      isAuthError: false
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <AlertDialog open={this.state.hasError}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {this.state.isAuthError ? 'Authentication Error' : 'Something went wrong'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {this.state.isAuthError
                  ? 'There was a problem with your authentication. You may need to sign in again.'
                  : `An error occurred: ${this.state.error?.message || 'Unknown error'}`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={this.handleReset}
                  className="gap-2"
                >
                  <Refresh size="16" />
                  Try again
                </Button>
                
                {/* Add logout button for authentication errors */}
                {this.state.isAuthError && (
                  <LogoutButton variant="destructive" />
                )}
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    return this.props.children
  }
}

export default RedirectErrorBoundary
