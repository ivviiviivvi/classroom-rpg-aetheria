import * as Sentry from '@sentry/react'

/**
 * Track an error with context for debugging
 * @param error - The error to track
 * @param context - Additional context about the error
 */
export function trackError(error: Error, context?: Record<string, any>) {
  console.error(error)
  
  // Only send to Sentry if DSN is configured
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: { custom: context }
    })
  }
}

/**
 * Initialize Sentry error tracking
 */
export function initErrorTracking() {
  // Only initialize if DSN is provided
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    })
  }
}
