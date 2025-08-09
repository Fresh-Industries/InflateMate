// lib/security/embed-asset-detection.ts

/**
 * Enhanced Static Asset Detection for Embed System
 * Uses sophisticated pathname-based regex patterns instead of simple file extension checks
 */

// Core static asset patterns - compiled for performance
const CORE_STATIC_ASSETS = /\.(ico|png|jpe?g|gif|svg|webp|avif|bmp|tiff?)$/i;
const FONT_ASSETS = /\.(woff2?|ttf|eot|otf)$/i;
const STYLESHEET_ASSETS = /\.css$/i;
const JAVASCRIPT_ASSETS = /\.js$/i;
const SOURCEMAP_ASSETS = /\.map$/i;
const DATA_ASSETS = /\.(json|xml|txt)$/i;

// Next.js internal assets
const NEXTJS_INTERNAL = /^\/(_next\/|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json)/i;

// Embed-specific asset patterns
const EMBED_ASSETS = {
  // Static embed scripts
  scripts: /^\/(?:embed|api\/embed)\/.+\.(js|ts)$/i,
  
  // Embed configuration endpoints (data, not static assets)
  config: /^\/api\/embed\/config\/[^\/]+\/?$/i,
  
  // Embed widget routes (dynamic content, not static assets)
  widgets: /^\/embed\/[^\/]+\/(?:booking|inventory|sales-funnel|popular-rentals)(?:\/[^\/]+)?\/?$/i,
  
  // Embed SDK endpoints
  sdk: /^\/api\/embed\/(?:sdk|embed\.js)\/?$/i,
  
  // Public embed assets
  public: /^\/embed-(?:resize|utils|polyfill)\.js$/i
};

// CDN and external asset patterns
const EXTERNAL_ASSETS = {
  // Common CDN patterns
  cdn: /^https?:\/\/(?:cdn\.|assets\.|static\.)/i,
  
  // Google Fonts and similar
  webfonts: /^https?:\/\/fonts\.(?:googleapis|gstatic)\.com/i,
  
  // Analytics and tracking pixels
  analytics: /\.(gif|png)\?/i
};

// Comprehensive asset type detection
export const AssetTypes = {
  STATIC_ASSET: 'static_asset',
  EMBED_SCRIPT: 'embed_script',
  EMBED_CONFIG: 'embed_config',
  EMBED_WIDGET: 'embed_widget',
  NEXTJS_INTERNAL: 'nextjs_internal',
  EXTERNAL_ASSET: 'external_asset',
  DYNAMIC_CONTENT: 'dynamic_content'
} as const;

export type AssetType = typeof AssetTypes[keyof typeof AssetTypes];

/**
 * Enhanced asset detection with detailed classification
 */
export function classifyAsset(pathname: string, fullUrl?: string): AssetType {
  // Check Next.js internal assets first
  if (NEXTJS_INTERNAL.test(pathname)) {
    return AssetTypes.NEXTJS_INTERNAL;
  }
  
  // Check embed-specific patterns
  if (EMBED_ASSETS.scripts.test(pathname)) {
    return AssetTypes.EMBED_SCRIPT;
  }
  
  if (EMBED_ASSETS.config.test(pathname)) {
    return AssetTypes.EMBED_CONFIG;
  }
  
  if (EMBED_ASSETS.widgets.test(pathname)) {
    return AssetTypes.EMBED_WIDGET;
  }
  
  if (EMBED_ASSETS.sdk.test(pathname)) {
    return AssetTypes.EMBED_SCRIPT;
  }
  
  if (EMBED_ASSETS.public.test(pathname)) {
    return AssetTypes.STATIC_ASSET;
  }
  
  // Check for external assets
  if (fullUrl) {
    if (EXTERNAL_ASSETS.cdn.test(fullUrl) || 
        EXTERNAL_ASSETS.webfonts.test(fullUrl) ||
        EXTERNAL_ASSETS.analytics.test(fullUrl)) {
      return AssetTypes.EXTERNAL_ASSET;
    }
  }
  
  // Check core static asset patterns
  if (CORE_STATIC_ASSETS.test(pathname) ||
      FONT_ASSETS.test(pathname) ||
      STYLESHEET_ASSETS.test(pathname) ||
      JAVASCRIPT_ASSETS.test(pathname) ||
      SOURCEMAP_ASSETS.test(pathname) ||
      DATA_ASSETS.test(pathname)) {
    return AssetTypes.STATIC_ASSET;
  }
  
  // Default to dynamic content
  return AssetTypes.DYNAMIC_CONTENT;
}

/**
 * Fast static asset detection (for middleware)
 */
export function isStaticAsset(pathname: string): boolean {
  const assetType = classifyAsset(pathname);
  return assetType === AssetTypes.STATIC_ASSET || 
         assetType === AssetTypes.NEXTJS_INTERNAL;
}

/**
 * Check if path is an embed-related route
 */
export function isEmbedRoute(pathname: string): boolean {
  const assetType = classifyAsset(pathname);
  return assetType === AssetTypes.EMBED_SCRIPT ||
         assetType === AssetTypes.EMBED_CONFIG ||
         assetType === AssetTypes.EMBED_WIDGET;
}

/**
 * Get caching strategy based on asset type
 */
export function getCachingHeaders(assetType: AssetType): Record<string, string> {
  switch (assetType) {
    case AssetTypes.STATIC_ASSET:
      return {
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
        'Expires': new Date(Date.now() + 31536000000).toUTCString()
      };
    
    case AssetTypes.EMBED_SCRIPT:
      return {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 1 day CDN
        'Vary': 'Accept-Encoding'
      };
    
    case AssetTypes.EMBED_CONFIG:
      return {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min browser, 10 min CDN
        'Vary': 'Origin'
      };
    
    case AssetTypes.NEXTJS_INTERNAL:
      return {
        'Cache-Control': 'public, max-age=3600, immutable'
      };
    
    case AssetTypes.EMBED_WIDGET:
    case AssetTypes.DYNAMIC_CONTENT:
    default:
      return {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
  }
}

/**
 * Security headers based on asset type
 */
export function getSecurityHeaders(assetType: AssetType): Record<string, string> {
  const baseHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
  
  switch (assetType) {
    case AssetTypes.EMBED_SCRIPT:
      return {
        ...baseHeaders,
        'Content-Type': 'application/javascript',
        'X-XSS-Protection': '1; mode=block'
      };
    
    case AssetTypes.EMBED_CONFIG:
      return {
        ...baseHeaders,
        'Content-Type': 'application/json',
        // JSON responses are fetched by JS, not framed; no X-Frame-Options needed
      };
    
    case AssetTypes.EMBED_WIDGET:
      return {
        ...baseHeaders,
        // Use modern CSP instead of legacy X-Frame-Options for embedding
        'Content-Security-Policy': "frame-ancestors *;" // Allow embedding
      };
    
    case AssetTypes.STATIC_ASSET:
      return {
        ...baseHeaders,
        'Access-Control-Allow-Origin': '*' // Static assets can be loaded cross-origin
      };
    
    default:
      return baseHeaders;
  }
}

/**
 * Validate asset path for security
 */
export function validateAssetPath(pathname: string): boolean {
  // Prevent directory traversal
  if (pathname.includes('..') || pathname.includes('//')) {
    return false;
  }
  
  // Prevent access to sensitive files
  const sensitivePatterns = [
    /\.env/i,
    /\.key/i,
    /\.pem/i,
    /\/\./,  // Hidden files
    /~$/,    // Backup files
    /\.bak$/i,
    /\.log$/i,
    /\.tmp$/i
  ];
  
  return !sensitivePatterns.some(pattern => pattern.test(pathname));
}

/**
 * Extract file extension from pathname
 */
export function getFileExtension(pathname: string): string {
  const match = pathname.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Generate asset fingerprint for cache busting
 */
export function generateAssetFingerprint(content: string | Buffer): string {
  // Simple hash for demonstration - in production, use a proper hash function
  let hash = 0;
  const str = typeof content === 'string' ? content : content.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Performance monitoring for asset detection
 */
export class AssetDetectionMetrics {
  private static metrics = new Map<AssetType, number>();
  
  static record(assetType: AssetType): void {
    const current = this.metrics.get(assetType) || 0;
    this.metrics.set(assetType, current + 1);
  }
  
  static getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((count, type) => {
      result[type] = count;
    });
    return result;
  }
  
  static reset(): void {
    this.metrics.clear();
  }
}

/**
 * Asset detection with performance monitoring
 */
export function detectAssetWithMetrics(pathname: string, fullUrl?: string): AssetType {
  const assetType = classifyAsset(pathname, fullUrl);
  AssetDetectionMetrics.record(assetType);
  return assetType;
}

/**
 * Batch asset classification for multiple paths
 */
export function classifyMultipleAssets(paths: string[]): Map<string, AssetType> {
  const results = new Map<string, AssetType>();
  
  for (const path of paths) {
    results.set(path, classifyAsset(path));
  }
  
  return results;
}

/**
 * Asset optimization recommendations
 */
export function getOptimizationRecommendations(assetType: AssetType): string[] {
  switch (assetType) {
    case AssetTypes.EMBED_SCRIPT:
      return [
        'Consider minification and gzip compression',
        'Implement versioning for cache busting',
        'Use CDN for global distribution'
      ];
    
    case AssetTypes.STATIC_ASSET:
      return [
        'Optimize image compression',
        'Use WebP format for images',
        'Implement progressive loading'
      ];
    
    case AssetTypes.EMBED_CONFIG:
      return [
        'Minimize JSON payload size',
        'Implement ETags for conditional requests',
        'Consider API response compression'
      ];
    
    default:
      return ['Monitor performance metrics', 'Implement appropriate caching'];
  }
} 