//public/embed-resize.js
(function() {
  'use strict';

  // Prevent multiple script executions
  if (window.__InflateMateResizeLoaded) return;
  window.__InflateMateResizeLoaded = true;

  let lastHeight = 0;
  let lastWidth = 0;
  let resizeFrame = null;
  let resizeObserver = null;
  let mutationObserver = null;
  
  // Get widgetId from URL params for security validation
  const urlParams = new URLSearchParams(window.location.search);
  const widgetId = urlParams.get('widgetId');
  
  function sendDimensions() {
    // Prefer the visible popup box – falls back to <body> size
    const popup = document.querySelector('[data-popup="true"]') || document.body;
    
    // Check if popup is in minimized state by looking at data attribute
    const isMinimized = popup.getAttribute('data-minimized') === 'true';
    
    // use bounding box while collapsed, scroll* while expanded
    const rect = popup.getBoundingClientRect();
    const newHeight = Math.ceil(isMinimized ? rect.height : popup.scrollHeight);
    const newWidth = Math.ceil(isMinimized ? rect.width : (popup.scrollWidth || popup.offsetWidth));

    // Send dimensions when height OR width changes significantly
    if (Math.abs(newHeight - lastHeight) > 2 || Math.abs(newWidth - lastWidth) > 2) {
      lastHeight = newHeight;
      lastWidth = newWidth;
      
      const message = { 
        type: 'resize', 
        height: newHeight, 
        width: newWidth,
        minimized: isMinimized
      };
      
      // Add widgetId for security validation if available
      if (widgetId) {
        message.widgetId = widgetId;
      }
      
      // Send to '*' - parent validates event.origin + widgetId for security
      // This avoids issues with strict referrer policies that block document.referrer
      window.parent.postMessage(message, '*');
    }
  }

  // Use requestAnimationFrame to prevent ResizeObserver loop limit exceeded
  function debouncedSendDimensions() {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = requestAnimationFrame(() => {
      sendDimensions();
      resizeFrame = null;
    });
  }

  function setupDimensionMonitoring() {
    // Use requestAnimationFrame instead of setTimeout for initial dimensions
    requestAnimationFrame(sendDimensions);
    
    // Send a second "post-paint" size after fonts/images settle
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(sendDimensions, 0));
    }
    setTimeout(sendDimensions, 250);
    
    // Use ResizeObserver if available - observe only the popup element
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(debouncedSendDimensions);
      
      // Observer the popup element specifically when it appears
      const observePopup = () => {
        const popup = document.querySelector('[data-popup="true"]');
        if (popup && !popup.__resizeObserved) {
          resizeObserver.observe(popup);
          popup.__resizeObserved = true;
        }
      };
      
      // Initial observation
      observePopup();
      
      // Only observe popup element, not document.body to prevent loops
      const popup = document.querySelector('[data-popup="true"]');
      if (popup) {
        resizeObserver.observe(popup);
      }
    }
    
    // Event listeners
    window.addEventListener('load', debouncedSendDimensions);
    window.addEventListener('resize', debouncedSendDimensions);
    
    // Monitor for DOM changes with scoped observation
    mutationObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach(mutation => {
        // Only trigger resize for relevant changes - narrow attributeFilter
        if (mutation.type === 'attributes' && 
            ['data-minimized', 'style'].includes(mutation.attributeName)) {
          shouldUpdate = true;
        } else if (mutation.type === 'childList' && 
                   (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        debouncedSendDimensions();
      }
    });
    
    // Observe only the popup element and its children, not the whole document
    const popup = document.querySelector('[data-popup="true"]');
    const observeTarget = popup || document.body;
    
    mutationObserver.observe(observeTarget, {
      childList: true,
      subtree: popup ? true : false, // Only use subtree if observing popup
      attributes: true,
      attributeFilter: ['style', 'data-minimized'] // Narrow to essential attributes only
    });
  }

  function cleanup() {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = null;
    }
    
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDimensionMonitoring);
  } else {
    setupDimensionMonitoring();
  }
  
  // Clean up before page unload to prevent memory leaks
  window.addEventListener('beforeunload', cleanup);
  
  // Clean up when navigating away (for SPAs)
  window.addEventListener('pagehide', cleanup);
})();