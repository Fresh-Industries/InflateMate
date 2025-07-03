(function() {
  'use strict';

  // Configuration and state
  const EMBED_CONFIG = {
    baseUrl: window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : 'https://app.inflatemate.com',
    version: '2.1.0'
  };

  // Widget registry
  const widgets = new Map();
  let widgetCounter = 0;

  // Utility functions
  const utils = {
    generateId: () => `inflatemate-widget-${++widgetCounter}`,
    
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
      style.textContent = `
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
      `;
      document.head.appendChild(style);
    },

    buildWidgetUrl: (businessId, type, config) => {
      const baseUrl = `${EMBED_CONFIG.baseUrl}/embed/${businessId}/${type}`;
      const params = new URLSearchParams();
      
      // Add all configuration as URL parameters
      Object.entries(config).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert camelCase to kebab-case for URL params
          const paramKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          params.append(paramKey, String(value));
        }
      });
      
      return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    },

    showError: (container, message) => {
      container.innerHTML = `
        <div class="inflatemate-error">
          <strong>Widget Error:</strong> ${message}
        </div>
      `;
    },

    showLoading: (container, message = 'Loading widget...') => {
      container.innerHTML = `
        <div class="inflatemate-widget-loading">
          <div class="inflatemate-spinner"></div>
          <span>${message}</span>
        </div>
      `;
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
      
      const url = utils.buildWidgetUrl(businessId, `inventory/${config.productId}`, config);
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

    'sales-funnel': (businessId, config, container) => {
      if (!config.funnelId) {
        utils.showError(container, 'Funnel ID is required for sales funnel widget');
        return null;
      }
      
      const url = utils.buildWidgetUrl(businessId, `sales-funnel/${config.funnelId}`, config);
      const iframe = utils.createIframe(url, {
        title: 'Sales Funnel Widget',
        minHeight: '400px',
        ...config
      });
      return iframe;
    }
  };

  // Message handling for iframe communication
  const messageHandler = (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    
    const { type, height, message, redirectUrl, bookingData } = event.data;
    
    switch (type) {
      case 'INFLATEMATE_RESIZE':
        // Find the iframe that sent this message
        const iframe = Array.from(document.querySelectorAll('iframe')).find(
          frame => frame.contentWindow === event.source
        );
        if (iframe && height) {
          iframe.style.height = `${Math.max(height, 200)}px`;
        }
        break;
        
      case 'INFLATEMATE_LOADED':
        // Widget loaded successfully
        console.log('InflateMate widget loaded successfully');
        break;
        
      case 'INFLATEMATE_BOOKING_SUCCESS':
        // Handle booking success
        handleBookingSuccess(message, redirectUrl, bookingData);
        break;
        
      default:
        console.log('Unknown message type:', type);
    }
  };

  // Booking success handler
  const handleBookingSuccess = (message, redirectUrl, bookingData) => {
    // Show success message
    if (message) {
      showSuccessNotification(message);
    }
    
    // Trigger custom event for external handling
    const customEvent = new CustomEvent('inflatemate:booking:success', {
      detail: { message, redirectUrl, bookingData }
    });
    window.dispatchEvent(customEvent);
    
    // Handle redirect
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // Give time to show success message
    }
  };

  // Success notification
  const showSuccessNotification = (message) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      max-width: 400px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      animation: inflatemate-slide-in 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center;">
        <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>${message}</span>
      </div>
    `;
    
    // Add slide-in animation
    if (!document.getElementById('inflatemate-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'inflatemate-notification-styles';
      style.textContent = `
        @keyframes inflatemate-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes inflatemate-slide-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'inflatemate-slide-out 0.3s ease-out forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  };

  // Main widget initialization
  const initializeWidget = (element) => {
    const config = utils.parseDataAttributes(element);
    const { businessId, type } = config;
    
    if (!businessId || !type) {
      utils.showError(element, 'Business ID and widget type are required');
      return;
    }
    
    if (!widgetHandlers[type]) {
      utils.showError(element, `Unknown widget type: ${type}`);
      return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.className = 'inflatemate-widget-container';
    container.id = utils.generateId();
    
    // Show loading state
    utils.showLoading(container, `Loading ${type} widget...`);
    
    // Replace the original element
    element.parentNode.replaceChild(container, element);
    
    // Initialize the specific widget
    try {
      const widget = widgetHandlers[type](businessId, config, container);
      
      if (widget) {
        // Replace loading with actual widget
        container.innerHTML = '';
        container.appendChild(widget);
        
        // Store widget reference
        widgets.set(container.id, {
          type,
          businessId,
          config,
          element: widget,
          container
        });
        
        // Add error handling for iframe
        widget.addEventListener('error', () => {
          utils.showError(container, 'Failed to load widget. Please try again later.');
        });
        
        // Timeout fallback
        setTimeout(() => {
          if (widget.style.height === (config.minHeight || '400px')) {
            // If height hasn't changed, the widget might not have loaded properly
            console.warn('Widget may not have loaded properly');
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error initializing widget:', error);
      utils.showError(container, 'Failed to initialize widget');
    }
  };

  // Auto-initialize widgets when DOM is ready
  const initializeAllWidgets = () => {
    utils.addResponsiveStyles();
    
    const widgetElements = document.querySelectorAll('.inflatemate-widget');
    widgetElements.forEach(initializeWidget);
  };

  // Public API
  window.InflateMate = {
    version: EMBED_CONFIG.version,
    
    // Manual widget initialization
    init: initializeAllWidgets,
    
    // Initialize specific element
    initElement: initializeWidget,
    
    // Get widget instances
    getWidgets: () => Array.from(widgets.values()),
    
    // Configure global settings
    configure: (options) => {
      Object.assign(EMBED_CONFIG, options);
    },
    
    // Utility to create widget programmatically
    createWidget: (type, businessId, config = {}, container = null) => {
      if (!container) {
        container = document.createElement('div');
        container.className = 'inflatemate-widget-container';
        container.id = utils.generateId();
      }
      
      const fullConfig = { ...config, businessId, type };
      
      if (widgetHandlers[type]) {
        const widget = widgetHandlers[type](businessId, fullConfig, container);
        if (widget) {
          container.appendChild(widget);
          widgets.set(container.id, {
            type,
            businessId,
            config: fullConfig,
            element: widget,
            container
          });
        }
        return container;
      }
      
      return null;
    }
  };

  // Listen for iframe messages
  window.addEventListener('message', messageHandler, false);

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllWidgets);
  } else {
    // DOM is already ready
    setTimeout(initializeAllWidgets, 0);
  }

  // Also initialize when new widgets are added dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.classList && node.classList.contains('inflatemate-widget')) {
            initializeWidget(node);
          }
          
          // Check for nested widgets
          const nestedWidgets = node.querySelectorAll && node.querySelectorAll('.inflatemate-widget');
          if (nestedWidgets) {
            nestedWidgets.forEach(initializeWidget);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log(`InflateMate Embed SDK v${EMBED_CONFIG.version} loaded`);
})(); 