// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is provided and not in development with missing network
const shouldInitSentry = process.env.NEXT_PUBLIC_SENTRY_DSN && 
  (process.env.NODE_ENV === 'production' || process.env.SENTRY_DEV_MODE === 'true');

if (shouldInitSentry) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_DEPLOY_ENV || process.env.NODE_ENV,
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
    release: process.env.SENTRY_RELEASE,
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',
    
    // Better error handling for network issues
    beforeSend(event, hint) {
      // Don't send events if we're having network connectivity issues
      const error = hint?.originalException;
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && error.message.includes('fetch')) {
        console.warn('Sentry: Skipping event due to network issue');
        return null;
      }
      return event;
    },
  });
} 