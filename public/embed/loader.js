//public/embed/loader.js

(function(window, document) {
    'use strict';
    
    // Auto-detect the current domain or use a default
    const scriptEl = document.currentScript || document.querySelector('script[src*="embed/loader.js"]');
    const scriptOrigin = (() => { try { return new URL(scriptEl?.src || '').origin; } catch { return 'https://inflatemate.co'; } })();
    const dataHost = scriptEl?.getAttribute('data-api-host');
    const INFLATEMATE_API = window.location.origin.includes('localhost')
      ? 'http://localhost:3000'
      : (dataHost || scriptOrigin);
    
    // Generate unique widget ID for security
    function generateWidgetId() {
      // Use crypto.randomUUID() for better entropy, fallback to current method
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return 'inflatemate-' + crypto.randomUUID();
      }
      // Fallback for older browsers
      return 'inflatemate-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    }
    
    // Validate message origin - aligned with embed-security.ts ALLOWED_ORIGINS
    function isValidOrigin(origin) {
      const allowedOrigins = [
        'https://inflatemate.co',
        'https://www.inflatemate.co',
        'https://staging.inflatemate.co',
        'https://www.staging.inflatemate.co',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ];
      
      // Also check for Vercel preview domains for CI/CD
      if (origin && origin.includes('.vercel.app')) {
        return true;
      }
      
      return allowedOrigins.includes(origin);
    }
    
    // Track initialized widgets to prevent duplicates
    const initializedWidgets = new WeakMap();
    
    class InflateMateWidget {
      constructor(config) {
        this.config = this.validateConfig(config);
        this.widgetId = generateWidgetId();
        this.iframe = null;
        this.container = null;
        this.cleanup = null;
        this.init();
      }
      
      validateConfig(config) {
        if (!config.businessId) throw new Error('businessId is required');
        if (!config.type) throw new Error('type is required');
        
        const validTypes = ['booking', 'inventory', 'popular-rentals', 'product', 'sales-funnel', 'booking-success'];
        if (!validTypes.includes(config.type)) {
          throw new Error(`Invalid widget type: ${config.type}. Valid types are: ${validTypes.join(', ')}`);
        }
        
        // Product widgets require a productId
        if (config.type === 'product' && !config.productId) {
          throw new Error('productId is required for product widgets');
        }
        
        // Sales funnel widgets require a funnelId
        if (config.type === 'sales-funnel' && !config.funnelId) {
          throw new Error('funnelId is required for sales-funnel widgets');
        }
        
        return {
          businessId: config.businessId,
          type: config.type,
          element: config.element || document.body,
          theme: config.theme || 'modern',
          width: config.width || '100%',
          height: config.height || 'auto',
          lazy: config.lazy !== false,
          ...config
        };
      }
      
      init() {
        if (this.config.type === 'sales-funnel') {
          // Sales funnel always loads immediately as overlay, no placeholder needed
          this.load();
        } else if (this.config.lazy) {
          this.setupLazyLoading();
        } else {
          this.load();
        }
      }
      
      setupLazyLoading() {
        const placeholder = this.createPlaceholder();
        this.config.element.appendChild(placeholder);
        
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.load();
            observer.disconnect();
          }
        }, { threshold: 0.1 });
        
        observer.observe(placeholder);
      }
      
      createPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'inflatemate-placeholder';
        placeholder.style.cssText = `
          min-height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: inflatemate-loading 1.5s infinite;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-family: system-ui, -apple-system, sans-serif;
        `;
        
        placeholder.innerHTML = '<div>Loading InflateMate...</div>';
        this.addStyles();
        this.placeholder = placeholder;
        return placeholder;
      }
      
      addStyles() {
        if (document.getElementById('inflatemate-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'inflatemate-styles';
        style.textContent = `
          @keyframes inflatemate-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .inflatemate-error {
            padding: 20px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            color: #c33;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `;
        document.head.appendChild(style);
      }
      
      async load() {
        try {
          const widgetUrl = this.buildWidgetUrl();
          this.iframe = this.createIframe(widgetUrl);
          
          if (this.config.type === 'sales-funnel') {
            document.body.appendChild(this.iframe);
          } else {
            // For other widgets, use normal element placement
            this.container = this.config.element;
            if (this.placeholder) {
              this.placeholder.replaceWith(this.iframe);
            } else {
              this.container.appendChild(this.iframe);
            }
          }
                  
          this.setupMessageListener();
                  
        } catch (error) {
          this.handleError(error);
        }
      }
      
      buildWidgetUrl() {
        const params = new URLSearchParams();
        
        // Add widgetId for security validation
        params.set('widgetId', this.widgetId);
        
        Object.entries(this.config).forEach(([key, value]) => {
          if (value && !['element', 'businessId', 'type', 'lazy', 'productId', 'funnelId'].includes(key)) {
            params.set(key, value);
          }
        });
        
        let baseUrl;
        if (this.config.type === 'booking-success') {
          baseUrl = `${INFLATEMATE_API}/embed/${this.config.businessId}/booking/success`;
        } else if (this.config.type === 'product') {
          // Product widgets use the inventory route structure
          if (!this.config.productId) {
            throw new Error('productId is required for product widgets');
          }
          baseUrl = `${INFLATEMATE_API}/embed/${this.config.businessId}/inventory/${this.config.productId}`;
        } else if (this.config.type === 'sales-funnel') {
          // Sales funnel widgets require a funnel ID
          if (!this.config.funnelId) {
            throw new Error('funnelId is required for sales-funnel widgets');
          }
          baseUrl = `${INFLATEMATE_API}/embed/${this.config.businessId}/sales-funnel/${this.config.funnelId}`;
        } else {
          baseUrl = `${INFLATEMATE_API}/embed/${this.config.businessId}/${this.config.type}`;
        }
        
        return params.toString() ? `${baseUrl}?${params}` : baseUrl;
      }
      
      createIframe(src) {
        const iframe = document.createElement('iframe');
        
        iframe.src = src;
        
        if (this.config.type === 'sales-funnel') {
          iframe.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 24px;
            z-index: 2147483647;
            display: block;
            width: 600px;
            max-width: min(600px, 95vw);
            height: ${this.config.height === 'auto' ? 'auto' : this.config.height};
            border: none;
            border-radius: 12px;
            background: transparent;
            pointer-events: auto;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          `;
        } else {
          iframe.style.cssText = `
            width: 100%;
            max-width: 100%;
            height: ${this.config.height === 'auto' ? '400px' : this.config.height};
            border: none;
            border-radius: 8px;
            background: #fff;
            transition: height 0.3s ease;
            display: block;
          `;
        }
        
        // Dynamic sandboxing: relaxed for widgets that need Clerk/Stripe, strict for others
        const needsStorage = [
          'booking', 'booking-success',                // already good
          'inventory', 'product', 'popular-rentals',   // NEW – these call Clerk
          'sales-funnel'                               // already good
        ];
        const sandbox = needsStorage.includes(this.config.type)
          ? 'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-storage-access-by-user-activation allow-top-navigation'
          : 'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox';
        
        iframe.setAttribute('sandbox', sandbox);
        iframe.setAttribute('loading', 'eager');
        iframe.setAttribute('title', 'InflateMate Widget');
        iframe.setAttribute('allowtransparency', 'true');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        
        // Tell Stripe that payments are allowed for widgets that might need it
        if (needsStorage.includes(this.config.type)) {
          iframe.setAttribute('allow', 'payment *');
        }
        
        return iframe;
      }
      
      setupMessageListener() {
        const messageHandler = (event) => {
          // Validate origin for security
          if (!isValidOrigin(event.origin)) {
            return;
          }
          
          // Validate widgetId to prevent message collisions
          if (event.data.widgetId && event.data.widgetId !== this.widgetId) {
            return;
          }
          
          // Only process messages from this widget's iframe
          if (event.source !== this.iframe.contentWindow) {
            return;
          }
          
          if (event.data.type === 'resize') {
            // For all widgets, set height only (responsive width handling)
            this.iframe.style.height = event.data.height + 'px';
            
            // Handle special sales-funnel positioning
            if (this.config.type === 'sales-funnel') {
              const w = Math.max(200, Math.min(event.data.width || 600, 600));
              this.iframe.style.width = w + 'px';
            }
          }
          
          // Handle external maximize requests
          if (event.data.type === 'maximize-request') {
            this.iframe.contentWindow.postMessage({
              type: 'maximize-request',
              widgetId: this.widgetId
            }, event.origin);
          }
          
          if (event.data.type === 'booking:success') {
            // Handle successful booking completion
            const { redirectUrl, bookingId, businessId } = event.data;
            
            if (redirectUrl) {
              const url = new URL(redirectUrl, window.location.origin);
              if (bookingId) {
                url.searchParams.set('bookingId', bookingId);
              }
              if (businessId) {
                url.searchParams.set('businessId', businessId);
              }
              window.location.href = url.toString();
            } else {
              this.config.onSuccess?.(event.data);
            }
          }
          
          if (event.data.type === 'booking:error') {
            this.config.onError?.(event.data.error);
          }
          
          if (event.data.type === 'navigation') {
            if (event.data.path) {
              const targetUrl = window.location.origin + event.data.path;
              window.location.href = targetUrl;
            } else if (event.data.url) {
              window.location.href = event.data.url;
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        this.cleanup = () => {
          window.removeEventListener('message', messageHandler);
          this.removeClickableOverlay();
        };
      }
      
      createClickableOverlay() {
        if (this.clickableOverlay || this.config.type === 'sales-funnel') return;
        
        this.clickableOverlay = document.createElement('div');
        this.clickableOverlay.style.cssText = `
          position: absolute;
          inset: 0;
          cursor: pointer;
          background: transparent;
          border-radius: 12px;
          pointer-events: auto;
          z-index: 1;
        `;
        
        this.clickableOverlay.addEventListener('click', () => {
          if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
              type: 'maximize-request',
              widgetId: this.widgetId
            }, INFLATEMATE_API);
          }
        });
        
        // Append to the container instead of body for proper scoping
        if (this.container) {
          this.container.appendChild(this.clickableOverlay);
        }
      }
      
      removeClickableOverlay() {
        if (this.clickableOverlay) {
          this.clickableOverlay.remove();
          this.clickableOverlay = null;
        }
      }
      
      handleError(error) {
        console.error('InflateMate Widget Error:', error);
        
        const errorEl = document.createElement('div');
        errorEl.className = 'inflatemate-error';
        errorEl.textContent = 'Unable to load widget. Please try again later.';
        
        if (this.iframe) {
          this.iframe.replaceWith(errorEl);
        } else if (this.placeholder) {
          this.placeholder.replaceWith(errorEl);
        }
      }
      
      destroy() {
        if (this.iframe) this.iframe.remove();
        if (this.placeholder) this.placeholder.remove();
        // no container for sales-funnel
        if (this.container && this.config.type !== 'sales-funnel') {
          this.container.remove();
        }
        this.removeClickableOverlay();
        this.cleanup?.();
      }
    }
    
    // Initialize widgets and prevent duplicates
    function initializeWidgets() {
      // Prevent multiple initializations
      if (window.__InflateMateLoaded) return;
      
      document.querySelectorAll('[data-inflatemate-widget]').forEach(el => {
        // Skip if already initialized
        if (initializedWidgets.has(el)) return;
        
        const config = {
          element: el,
          businessId: el.dataset.businessId,
          type: el.dataset.type,
          theme: el.dataset.theme,
          lazy: el.dataset.lazy !== 'false',
          productId: el.dataset.productId, // Add productId for product widgets
          funnelId: el.dataset.funnelId, // Add funnelId for sales-funnel widgets
        };
        
        // Capture all other data-* attributes and convert them to config parameters
        Object.keys(el.dataset).forEach(key => {
          // Skip the ones we've already handled
          if (!['inflateMateWidget', 'businessId', 'type', 'theme', 'lazy', 'productId', 'funnelId'].includes(key)) {
            // Use the dataset key directly (already converted from kebab-case to camelCase)
            config[key] = el.dataset[key];
          }
        });
        
        const widget = new InflateMateWidget(config);
        initializedWidgets.set(el, widget);
      });
      
      window.__InflateMateLoaded = true;
    }
    
    // Global API
    window.InflateMate = {
      create: (config) => new InflateMateWidget(config),
      init: initializeWidgets,
      
      // New method to reinitialize (useful for SPA navigation)
      reinit: () => {
        window.__InflateMateLoaded = false;
        initializeWidgets();
      }
    };
    
    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeWidgets);
    } else {
      initializeWidgets();
    }
    
    // IMPORTANT: Re-initialize on popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        window.__InflateMateLoaded = false;
        initializeWidgets();
      }, 100);
    });
    
    // IMPORTANT: Listen for Next.js route changes with throttling
    let lastUrl = location.href;
    let routeChangeTimeout;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        clearTimeout(routeChangeTimeout);
        routeChangeTimeout = setTimeout(() => {
          window.__InflateMateLoaded = false;
          initializeWidgets();
        }, 100);
      }
    }).observe(document, { subtree: true, childList: true });
    
  })(window, document);