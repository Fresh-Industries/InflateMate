// lib/security/content-sanitizer.ts

import DOMPurify from 'dompurify';

/**
 * Content Sanitization Utilities for XSS Defense
 * Centralizes all content sanitization across the embed system
 */

// Module-level flag to prevent re-initialization
let domPurifyInitialized = false;

// Safe HTML sanitization config for different content types
const SANITIZE_CONFIGS = {
  // For display content (descriptions, messages, etc.)
  display: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false
  },
  
  // For basic text content (names, titles, etc.)
  text: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false
  },
  
  // For rich content (if needed in future)
  rich: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a'
    ],
    ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false
  }
};

/**
 * Initialize DOMPurify with security-focused configuration
 * Guard with module-level boolean to avoid re-adding hooks
 */
function initializeDOMPurify() {
  // Guard against multiple initializations
  if (domPurifyInitialized) {
    return;
  }
  
  // Add custom hooks for additional security
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    // Remove any script elements that might have been missed
    if (node instanceof Element && node.tagName && node.tagName.toLowerCase() === 'script') {
      node.remove();
    }
    
    // Remove any elements with dangerous attributes
    if (node instanceof Element && (
      node.hasAttribute('onclick') ||
      node.hasAttribute('onload') ||
      node.hasAttribute('onerror') ||
      node.hasAttribute('onmouseover')
    )) {
      // Remove all event handler attributes
      const attrs = node.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        if (attr.name.startsWith('on')) {
          node.removeAttribute(attr.name);
        }
      }
    }
  });

  DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
    // Ensure all links are safe
    if (node instanceof Element && node.tagName && node.tagName.toLowerCase() === 'a') {
      const href = node.getAttribute('href');
      if (href) {
        // Only allow safe protocols
        const safeProtocols = ['http:', 'https:', 'mailto:'];
        try {
          const url = new URL(href, window.location.href);
          if (!safeProtocols.includes(url.protocol)) {
            node.removeAttribute('href');
          } else {
            // Add security attributes to external links
            if (url.origin !== window.location.origin) {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
            }
          }
        } catch (error) {
          // Invalid URL, remove href
          node.removeAttribute('href');
          console.error('Invalid URL:', error);
        }
      }
    }
  });
  
  // Mark as initialized
  domPurifyInitialized = true;
}

/**
 * Sanitize content based on type
 */
export function sanitizeContent(
  content: string | null | undefined,
  type: keyof typeof SANITIZE_CONFIGS = 'display'
): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Initialize DOMPurify if running in browser
  if (typeof window !== 'undefined' && typeof DOMPurify !== 'undefined') {
    initializeDOMPurify();
  }

  const config = SANITIZE_CONFIGS[type];
  return DOMPurify.sanitize(content, config);
}

/**
 * Sanitize business name for display
 */
export function sanitizeBusinessName(name: string | null | undefined): string {
  return sanitizeContent(name, 'text');
}

/**
 * Sanitize business description for display
 */
export function sanitizeBusinessDescription(description: string | null | undefined): string {
  return sanitizeContent(description, 'display');
}

/**
 * Sanitize product/inventory names and descriptions
 */
export function sanitizeProductName(name: string | null | undefined): string {
  return sanitizeContent(name, 'text');
}

export function sanitizeProductDescription(description: string | null | undefined): string {
  return sanitizeContent(description, 'display');
}

/**
 * Sanitize customer-provided data
 */
export function sanitizeCustomerName(name: string | null | undefined): string {
  return sanitizeContent(name, 'text');
}

export function sanitizeCustomerMessage(message: string | null | undefined): string {
  return sanitizeContent(message, 'display');
}

/**
 * Sanitize sales funnel content
 */
export function sanitizeFunnelTitle(title: string | null | undefined): string {
  return sanitizeContent(title, 'text');
}

export function sanitizeFunnelText(text: string | null | undefined): string {
  return sanitizeContent(text, 'display');
}

/**
 * Sanitize configuration values that might be user-controlled
 */
export function sanitizeConfigValue(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  // For config values, be extra strict - only allow alphanumeric, hyphens, and underscores
  return value.replace(/[^a-zA-Z0-9\-_]/g, '');
}

/**
 * Sanitize color values (hex, rgb, hsl)
 */
export function sanitizeColorValue(color: string | null | undefined): string {
  if (!color || typeof color !== 'string') {
    return '';
  }

  // Allow only valid CSS color formats
  const colorRegex = /^(#[0-9a-fA-F]{3,6}|rgb\([0-9\s,]+\)|rgba\([0-9\s,.]+\)|hsl\([0-9\s,%]+\)|hsla\([0-9\s,.%]+\)|[a-zA-Z]+)$/;
  
  if (colorRegex.test(color.trim())) {
    return color.trim();
  }
  
  return '';
}

/**
 * Sanitize URL parameters for embed widgets
 */
export function sanitizeUrlParam(param: string | null | undefined): string {
  if (!param || typeof param !== 'string') {
    return '';
  }

  // URL encode and limit length
  const sanitized = encodeURIComponent(param).substring(0, 100);
  return sanitized;
}

/**
 * Server-side content sanitization (for Node.js environments)
 */
export function sanitizeContentServer(
  content: string | null | undefined,
  type: keyof typeof SANITIZE_CONFIGS = 'display'
): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // For server-side, use basic HTML entity encoding
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  let sanitized = content.replace(/[&<>"'`=\/]/g, (s) => entityMap[s] || s);

  // For text type, strip all HTML tags
  if (type === 'text') {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  return sanitized;
}

/**
 * Validate and sanitize file upload names
 */
export function sanitizeFileName(filename: string | null | undefined): string {
  if (!filename || typeof filename !== 'string') {
    return 'untitled';
  }

  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[\/\\:*?"<>|]/g, '') // Remove dangerous file system characters
    .replace(/\.\./g, '') // Remove directory traversal
    .substring(0, 255) // Limit length
    .trim();
}

/**
 * Create a safe component props sanitizer
 */
export function sanitizeComponentProps<T extends Record<string, unknown>>(
  props: T,
  sanitizers: Partial<Record<keyof T, (value: unknown) => string>>
): T {
  const sanitizedProps = { ...props };

  for (const [key, sanitizer] of Object.entries(sanitizers)) {
    if (key in sanitizedProps && sanitizer) {
      sanitizedProps[key as keyof T] = sanitizer(sanitizedProps[key as keyof T]) as T[keyof T];
    }
  }

  return sanitizedProps;
}

/**
 * Logging for sanitization events (development only)
 */
export function logSanitization(
  originalContent: string,
  sanitizedContent: string,
  type: string,
  context?: string
): void {
  if (process.env.NODE_ENV === 'development' && originalContent !== sanitizedContent) {
    console.warn('Content sanitized:', {
      type,
      context,
      original: originalContent.substring(0, 100),
      sanitized: sanitizedContent.substring(0, 100),
      lengthChange: originalContent.length - sanitizedContent.length
    });
  }
} 