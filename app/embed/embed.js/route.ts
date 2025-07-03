import { NextResponse } from 'next/server';

export async function GET() {
  const embedJs = `(function() {
  'use strict';

  // Configuration and state
  const EMBED_CONFIG = {
    baseUrl: '${process.env.NEXT_PUBLIC_API_HOST || 'https://inflatemate.co'}',
    version: '2.1.0'
  };

  // Widget registry
  const widgets = new Map();
  let widgetCounter = 0;

  // Utility functions
  const utils = {
    generateId: () => \`inflatemate-widget-\${++widgetCounter}\`,
    
    parseDataAttributes: (element) => {
      const data = {};
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-')) {
          const key = attr.name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          let value = attr.value;
          
          // Parse boolean values
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          // Parse numbers
          else if (!isNaN(value) && value !== '') value = Number(value);
          
          data[key] = value;
        }
      }
      return data;
    },

    createIframe: (src, config = {}) => {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.minHeight = config.minHeight || '400px';
      iframe.style.borderRadius = config.borderRadius || '12px';
      iframe.style.backgroundColor = config.backgroundColor || '#ffffff';
      iframe.style.boxShadow = config.boxShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowtransparency', 'true');
      
      // Accessibility
      iframe.setAttribute('title', config.title || 'InflateMate Widget');
      iframe.setAttribute('role', 'application');
      
      return iframe;
    },

    addResponsiveStyles: () => {
      if (document.getElementById('inflatemate-responsive-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'inflatemate-responsive-styles';
      style.textContent = \`
        .inflatemate-widget-container {
          position: relative;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }
        
        .inflatemate-widget-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
        }
        
        .inflatemate-spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 3px solid white;
          width: 24px;
          height: 24px;
          animation: inflatemate-spin 1s linear infinite;
          margin-right: 12px;
        }
        
        @keyframes inflatemate-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .inflatemate-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 16px;
          border-radius: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .inflatemate-widget-container {
            margin: 0 -16px;
            border-radius: 0;
          }
          
          .inflatemate-widget-container iframe {
            border-radius: 0;
          }
        }
      \`;
      document.head.appendChild(style);
    },

    buildWidgetUrl: (businessId, type, config) => {
      const baseUrl = \`\${EMBED_CONFIG.baseUrl}/embed/\${businessId}/\${type}\`;
      const params = new URLSearchParams();
      
      // Add all configuration as URL parameters
      Object.entries(config).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert camelCase to kebab-case for URL params
          const paramKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          params.append(paramKey, String(value));
        }
      });
      
      return params.toString() ? \`\${baseUrl}?\${params.toString()}\` : baseUrl;
    },

    showError: (container, message) => {
      container.innerHTML = \`
        <div class="inflatemate-error">
          <strong>Widget Error:</strong> \${message}
        </div>
      \`;
    },

    showLoading: (container, message = 'Loading widget...') => {
      container.innerHTML = \`
        <div class="inflatemate-widget-loading">
          <div class="inflatemate-spinner"></div>
          <span>\${message}</span>
        </div>
      \`;
    }
  };

  // Widget type handlers
  const widgetHandlers = {
    booking: (businessId, config) => {
      const url = utils.buildWidgetUrl(businessId, 'booking', config);
      const iframe = utils.createIframe(url, {
        title: 'Booking Widget',
        minHeight: '600px',
        ...config
      });
      return iframe;
    },

    inventory: (businessId, config) => {
      const url = utils.buildWidgetUrl(businessId, 'inventory', config);
      const iframe = utils.createIframe(url, {
        title: 'Inventory Widget',
        minHeight: '500px',
        ...config
      });
      return iframe;
    },

    product: (businessId, config, container) => {
      if (!config.productId) {
        utils.showError(container, 'Product ID is required for product widget');
        return null;
      }
      
      const url = utils.buildWidgetUrl(businessId, \`inventory/\${config.productId}\`, config);
      const iframe = utils.createIframe(url, {
        title: 'Product Detail Widget',
        minHeight: '700px',
        ...config
      });
      return iframe;
    },

    'popular-rentals': (businessId, config) => {
      const url = utils.buildWidgetUrl(businessId, 'popular-rentals', config);
      const iframe = utils.createIframe(url, {
        title: 'Popular Rentals Widget',
        minHeight: '450px',
        ...config
      });
      return iframe;
    },

    'quote-request': (businessId, config) => {
      const url = utils.buildWidgetUrl(businessId, 'quote-request', config);
      const iframe = utils.createIframe(url, {
        title: 'Quote Request Widget',
        minHeight: '500px',
        ...config
      });
      return iframe;
    }
  };

  // Event handling for iframe communication
  const messageHandler = (event) => {
    // Only accept messages from our own domain
    if (!event.origin.includes(new URL(EMBED_CONFIG.baseUrl).hostname)) {
      return;
    }

    const { type, payload } = event.data;
    
    if (type === 'BOOKING_SUCCESS') {
      handleBookingSuccess(payload.message, payload.redirectUrl, payload.bookingData);
    } else if (type === 'RESIZE_WIDGET') {
      const iframe = document.querySelector(\`iframe[src*="\${payload.widgetId}"]\`);
      if (iframe && payload.height) {
        iframe.style.height = payload.height + 'px';
      }
    } else if (type === 'WIDGET_ERROR') {
      console.error('Widget Error:', payload.message);
    }
  };

  const handleBookingSuccess = (message, redirectUrl, bookingData) => {
    // Show success notification
    showSuccessNotification(message || 'Booking successful!');
    
    // Handle redirect after a short delay
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }
    
    // Trigger custom event for integrations
    const event = new CustomEvent('inflatemateBookingSuccess', {
      detail: { message, redirectUrl, bookingData }
    });
    document.dispatchEvent(event);
  };

  const showSuccessNotification = (message) => {
    // Remove existing notifications
    const existing = document.querySelector('.inflatemate-success-notification');
    if (existing) {
      existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'inflatemate-success-notification';
    notification.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 500;
      z-index: 10000;
      max-width: 400px;
      animation: inflatemate-slide-in 0.3s ease-out;
    \`;
    
    notification.innerHTML = \`
      <div style="display: flex; align-items: center;">
        <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>\${message}</span>
      </div>
    \`;

    // Add animation styles if not already present
    if (!document.getElementById('inflatemate-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'inflatemate-notification-styles';
      style.textContent = \`
        @keyframes inflatemate-slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes inflatemate-slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      \`;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'inflatemate-slide-out 0.3s ease-out';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  };

  // Main widget initialization
  const initializeWidget = (element) => {
    const widgetId = utils.generateId();
    const config = utils.parseDataAttributes(element);
    
    if (!config.businessId) {
      utils.showError(element, 'Business ID is required');
      return;
    }
    
    if (!config.type) {
      utils.showError(element, 'Widget type is required');
      return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.className = 'inflatemate-widget-container';
    container.id = widgetId;
    
    // Show loading state
    utils.showLoading(container);
    
    // Replace the original element
    element.parentNode.replaceChild(container, element);
    
    // Initialize the specific widget type
    const handler = widgetHandlers[config.type];
    if (!handler) {
      utils.showError(container, \`Unknown widget type: \${config.type}\`);
      return;
    }
    
    try {
      const widget = handler(config.businessId, config, container);
      if (widget) {
        // Clear loading and add the widget
        container.innerHTML = '';
        container.appendChild(widget);
        
        // Store widget reference
        widgets.set(widgetId, {
          element: container,
          widget,
          config
        });
        
        // Set up error handling for iframe
        widget.addEventListener('error', () => {
          utils.showError(container, 'Failed to load widget');
        });
        
        // Optional: Set up load event
        widget.addEventListener('load', () => {
          console.log(\`Widget \${config.type} loaded successfully\`);
        });
      }
    } catch (error) {
      console.error('Widget initialization error:', error);
      utils.showError(container, 'Failed to initialize widget');
    }
  };

  // Initialize all widgets on the page
  const initializeAllWidgets = () => {
    const elements = document.querySelectorAll('.inflatemate-widget');
    elements.forEach(initializeWidget);
  };

  // Set up event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('message', messageHandler);
    utils.addResponsiveStyles();
    
    // Initialize widgets when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAllWidgets);
    } else {
      initializeAllWidgets();
    }
  }

  // Public API
  window.InflateMate = window.InflateMate || {
    init: initializeAllWidgets,
    createWidget: (element, config) => {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (element) {
        // Set data attributes from config
        Object.entries(config).forEach(([key, value]) => {
          const dataKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          element.setAttribute(\`data-\${dataKey}\`, String(value));
        });
        initializeWidget(element);
      }
    },
    config: EMBED_CONFIG,
    version: EMBED_CONFIG.version
  };

})();`;

  return new NextResponse(embedJs, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 