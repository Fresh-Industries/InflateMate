// lib/security/embed-security.ts

/**
 * InflateMate Embed Security Configuration
 * Centralizes origin validation, CORS policies, and security headers
 */

// Strict origin validation - exact match allow-list
const PRODUCTION_ORIGINS = [
  'https://inflatemate.co',
  'https://www.inflatemate.co',
  "https://staging.inflatemate.co",
  "https://www.staging.inflatemate.co"

];

const DEVELOPMENT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  "https://staging.inflatemate.co",
  "https://www.staging.inflatemate.co"

];

// Build allowed origins set based on environment
export const ALLOWED_ORIGINS = new Set([
  ...PRODUCTION_ORIGINS,
  ...(process.env.NODE_ENV === 'development' ? DEVELOPMENT_ORIGINS : [])
]);

// Additional customer domains (to be populated from database)
const CUSTOMER_ALLOWED_ORIGINS = new Set<string>();

/**
 * Validates if an origin is allowed for embed operations
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // Check against static allow-list
  if (ALLOWED_ORIGINS.has(origin)) return true;
  
  // Check against customer-specific domains
  if (CUSTOMER_ALLOWED_ORIGINS.has(origin)) return true;
  
  return false;
}

/**
 * Add customer domain to allowed origins (for business-specific domains)
 */
export function addCustomerOrigin(origin: string): void {
  try {
    // Validate the origin format
    const url = new URL(origin);
    if (url.protocol === 'https:' || (process.env.NODE_ENV === 'development' && url.protocol === 'http:')) {
      CUSTOMER_ALLOWED_ORIGINS.add(origin);
    }
  } catch (error) {
    console.warn('Invalid customer origin:', origin, error);
  }
}

/**
 * Remove customer domain from allowed origins
 */
export function removeCustomerOrigin(origin: string): void {
  CUSTOMER_ALLOWED_ORIGINS.delete(origin);
}

/**
 * Enhanced security headers for embed endpoints with comprehensive protection
 */
export const EMBED_SECURITY_HEADERS = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enhanced XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy for privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Comprehensive permissions policy (restrictive by default)
  'Permissions-Policy': [
    'payment=*',             // Allow payment for booking widgets in sandboxed contexts
    'microphone=()',         // Block microphone access
    'camera=()',             // Block camera access
    'geolocation=()',        // Block geolocation
    'autoplay=()',           // Block autoplay
    'accelerometer=()',      // Block accelerometer
    'gyroscope=()',          // Block gyroscope
    'magnetometer=()',       // Block magnetometer
    'ambient-light-sensor=()', // Block ambient light sensor
    'battery=()',            // Block battery API
    'fullscreen=(self)',     // Allow fullscreen for widgets
    'web-share=()'           // Block web share API
  ].join(', '),
  
  // Enhanced Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://js.stripe.com",
    "style-src 'self' 'unsafe-hashes' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://m.stripe.com https://m.stripe.network",
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Force HTTPS in production
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  }),
  
  // Additional security headers
  'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive, noimageindex',
  'Cross-Origin-Embedder-Policy': 'credentialless', // Better isolation than unsafe-none
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // Allow payment popups
  'Cross-Origin-Resource-Policy': 'cross-origin' // Allow cross-origin embedding
};

/**
 * Specialized headers for different endpoint types
 */
export const EMBED_ENDPOINT_HEADERS = {
  // Headers for embed script endpoints
  script: {
    ...EMBED_SECURITY_HEADERS,
    'Content-Type': 'application/javascript',
    // Scripts are never rendered in a <frame>, header not needed
    'Cache-Control': process.env.NODE_ENV === 'development' 
      ? 'no-cache, no-store, must-revalidate' 
      : 'public, max-age=3600, s-maxage=86400, immutable',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  },
  
  // Headers for configuration endpoints
  config: {
    ...EMBED_SECURITY_HEADERS,
    'Content-Type': 'application/json',
    // JSON is fetched by JS, not framed; header removed
    'Cache-Control': 'public, max-age=300, s-maxage=600',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  },
  
  // Headers for widget pages (embeddable content)
  widget: {
    ...EMBED_SECURITY_HEADERS,
    'Content-Type': 'text/html; charset=utf-8',
    // Remove X-Frame-Options to avoid conflict with CSP frame-ancestors
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    // Enhanced CSP for widget pages with frame-ancestors
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' https://js.stripe.com",
      "style-src 'self' 'unsafe-hashes' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://m.stripe.com https://m.stripe.network",
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
      "frame-ancestors *", // Allow embedding from any origin
      "worker-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  },
  
  // Headers for SDK endpoints
  sdk: {
    ...EMBED_SECURITY_HEADERS,
    'Content-Type': 'application/json',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'public, max-age=300, s-maxage=600',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  }
};

/**
 * Get enhanced security headers for specific endpoint types
 */
export function getEmbedSecurityHeaders(
  endpointType: 'script' | 'config' | 'widget' | 'sdk' = 'config'
): Record<string, string> {
  return EMBED_ENDPOINT_HEADERS[endpointType] || EMBED_SECURITY_HEADERS;
}

/**
 * Enhanced CORS headers with origin validation
 */
export function getEmbedCorsHeaders(
  requestOrigin?: string | null,
  endpointType: 'script' | 'config' | 'widget' | 'sdk' = 'config'
): Record<string, string> {
  const allowedOrigin = requestOrigin && isOriginAllowed(requestOrigin) 
    ? requestOrigin 
    : PRODUCTION_ORIGINS[0]; // Default to main production origin

  const baseHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, Accept, Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours for preflight cache
    'Vary': 'Origin, Access-Control-Request-Headers'
  };

  // Add specialized headers for widget endpoints that need broader access
  if (endpointType === 'widget') {
    return {
      ...baseHeaders,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, Accept, Origin, Authorization'
    };
  }

  return baseHeaders;
}

/**
 * Enhanced message validation for postMessage communication
 */
export interface ValidatedMessage {
  type: string;
  payload?: Record<string, unknown>;
  timestamp: number;
  version: string;
}

export function validatePostMessage(
  event: MessageEvent,
  expectedTypes: string[] = []
): ValidatedMessage | null {
  // Strict origin validation
  if (!isOriginAllowed(event.origin)) {
    console.warn('Rejected message from unauthorized origin:', event.origin);
    return null;
  }

  // Validate message structure
  if (!event.data || typeof event.data !== 'object') {
    console.warn('Invalid message data:', event.data);
    return null;
  }

  const { type, payload, timestamp, version } = event.data;

  // Validate required fields
  if (!type || typeof type !== 'string') {
    console.warn('Invalid message type:', type);
    return null;
  }

  // Validate timestamp (within last 5 minutes)
  if (timestamp && typeof timestamp === 'number') {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    if (Math.abs(now - timestamp) > fiveMinutes) {
      console.warn('Message timestamp too old or in future:', timestamp);
      return null;
    }
  }

  // Validate expected message types
  if (expectedTypes.length > 0 && !expectedTypes.includes(type)) {
    console.warn('Unexpected message type:', type, 'Expected:', expectedTypes);
    return null;
  }

  return {
    type,
    payload: payload || {},
    timestamp: timestamp || Date.now(),
    version: version || 'unknown'
  };
}

/**
 * Create secure postMessage sender
 */
export function createSecurePostMessage(targetOrigin: string) {
  if (!isOriginAllowed(targetOrigin)) {
    throw new Error(`Target origin not allowed: ${targetOrigin}`);
  }

  return function sendMessage(message: Omit<ValidatedMessage, 'timestamp' | 'version'>) {
    const secureMessage: ValidatedMessage = {
      ...message,
      timestamp: Date.now(),
      version: '2.2.0'
    };

    window.parent.postMessage(secureMessage, targetOrigin);
  };
}

/**
 * Rate limiting for embed requests
 */
class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) { // 100 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

export const embedRateLimiter = new RateLimiter();

/**
 * Extract client IP for rate limiting
 */
export function getClientIP(request: Request): string {
  // Check common headers for client IP
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return xForwardedFor?.split(',')[0]?.trim() || 
         xRealIP || 
         cfConnectingIP || 
         'unknown';
} 