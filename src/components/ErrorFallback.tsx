import { Button } from '@/components/ui/button'
import { ArrowClockwise } from '@phosphor-icons/react'

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="glass-panel p-8 text-center space-y-4 max-w-md">
        <div className="text-4xl mb-2">⚠️</div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          {error?.message || 'An unexpected error occurred'}
        </p>
        {resetErrorBoundary && (
          <Button onClick={resetErrorBoundary} className="gap-2">
            <ArrowClockwise size={20} />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
