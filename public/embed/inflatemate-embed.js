(function(window) {
  'use strict';

  const InflateMateEmbed = {
    version: '1.0.0',
    
    // Create embeddable widget
    create: function(options) {
      const config = {
        businessId: options.businessId,
        type: options.type, // 'booking', 'inventory', 'product', 'sales-funnel'
        container: options.container,
        width: options.width || '100%',
        height: options.height || '600px',
        theme: options.theme || 'modern',
        primaryColor: options.primaryColor,
        autoResize: options.autoResize !== false,
        onLoad: options.onLoad || function() {},
        onError: options.onError || function() {},
        onResize: options.onResize || function() {},
        ...options
      };

      return new EmbedWidget(config);
    }
  };

  class EmbedWidget {
    constructor(config) {
      this.config = config;
      this.iframe = null;
      this.container = null;
      this.isLoaded = false;
      
      this.init();
    }

    init() {
      // Find container
      this.container = typeof this.config.container === 'string' 
        ? document.querySelector(this.config.container)
        : this.config.container;

      if (!this.container) {
        console.error('InflateMate Embed: Container not found');
        this.config.onError('Container not found');
        return;
      }

      this.createIframe();
      this.setupEventListeners();
    }

    createIframe() {
      this.iframe = document.createElement('iframe');
      
      // Build embed URL
      const baseUrl = this.getEmbedUrl();
      const params = new URLSearchParams();
      
      if (this.config.theme) params.append('theme', this.config.theme);
      if (this.config.primaryColor) params.append('primaryColor', this.config.primaryColor);
      if (this.config.accentColor) params.append('accentColor', this.config.accentColor);
      if (this.config.backgroundColor) params.append('backgroundColor', this.config.backgroundColor);
      if (this.config.textColor) params.append('textColor', this.config.textColor);
      if (this.config.productId) params.append('productId', this.config.productId);
      if (this.config.funnelId) params.append('funnelId', this.config.funnelId);
      
      const url = `${baseUrl}?${params.toString()}`;

      // Configure iframe
      this.iframe.src = url;
      this.iframe.style.width = this.config.width;
      this.iframe.style.height = this.config.height;
      this.iframe.style.border = 'none';
      this.iframe.style.overflow = 'hidden';
      this.iframe.setAttribute('scrolling', 'no');
      this.iframe.setAttribute('frameborder', '0');
      
      // Security attributes
      this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
      
      this.container.appendChild(this.iframe);
    }

    getEmbedUrl() {
      const baseUrl = window.location.origin; // Use current domain
      const { businessId, type } = this.config;
      
      switch (type) {
        case 'booking':
          return `${baseUrl}/embed/${businessId}/booking`;
        case 'inventory':
          return `${baseUrl}/embed/${businessId}/inventory`;
        case 'product':
          return `${baseUrl}/embed/${businessId}/inventory/${this.config.productId}`;
        case 'sales-funnel':
          return `${baseUrl}/embed/${businessId}/sales-funnel/${this.config.funnelId}`;
        default:
          throw new Error(`Unknown embed type: ${type}`);
      }
    }

    setupEventListeners() {
      // Listen for messages from iframe
      const messageHandler = (event) => {
        // Verify the message is from our iframe
        if (event.source !== this.iframe.contentWindow) return;
        
        const { type, height, error } = event.data;
        
        switch (type) {
          case 'INFLATEMATE_RESIZE':
            if (this.config.autoResize && height) {
              this.iframe.style.height = `${height}px`;
              this.config.onResize(height);
            }
            break;
          case 'INFLATEMATE_LOADED':
            this.isLoaded = true;
            this.config.onLoad();
            break;
          case 'INFLATEMATE_ERROR':
            this.config.onError(error || 'Unknown error');
            break;
        }
      };

      window.addEventListener('message', messageHandler);

      // Store reference for cleanup
      this.messageHandler = messageHandler;

      // Handle iframe load
      this.iframe.addEventListener('load', () => {
        if (!this.isLoaded) {
          this.isLoaded = true;
          this.config.onLoad();
        }
      });

      this.iframe.addEventListener('error', () => {
        this.config.onError('Failed to load widget');
      });
    }

    // Public methods
    destroy() {
      if (this.iframe && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      
      // Clean up event listener
      if (this.messageHandler) {
        window.removeEventListener('message', this.messageHandler);
      }
    }

    postMessage(message) {
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage(message, '*');
      }
    }

    // Update configuration
    updateConfig(newConfig) {
      Object.assign(this.config, newConfig);
      
      // Send configuration update to iframe
      this.postMessage({
        type: 'INFLATEMATE_UPDATE_CONFIG',
        config: newConfig
      });
    }

    // Resize iframe manually
    resize(width, height) {
      if (width) this.iframe.style.width = typeof width === 'number' ? `${width}px` : width;
      if (height) this.iframe.style.height = typeof height === 'number' ? `${height}px` : height;
    }
  }

  // Utility function to create multiple widgets
  InflateMateEmbed.createMultiple = function(widgetConfigs) {
    return widgetConfigs.map(config => InflateMateEmbed.create(config));
  };

  // Expose to global scope
  window.InflateMateEmbed = InflateMateEmbed;

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return InflateMateEmbed;
    });
  }

  // CommonJS support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InflateMateEmbed;
  }

})(window); 