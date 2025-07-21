//public/embed-resize.js
(function() {
  'use strict';

  let lastHeight = 0;
  let lastWidth = 0;
  
  function sendDimensions() {
    // Prefer the visible popup box – falls back to <body> size
    const popup = document.querySelector('[data-popup="true"]');
    if (!popup) return;
    
    const rect = popup.getBoundingClientRect();
    
    // Check if popup is in minimized state by looking at data attribute
    const isMinimized = popup.getAttribute('data-minimized') === 'true';
    
    const newHeight = Math.ceil(rect.height);
    const newWidth = Math.ceil(rect.width);

    // Send dimensions when height OR width changes significantly
    if (Math.abs(newHeight - lastHeight) > 2 || Math.abs(newWidth - lastWidth) > 2) {
      lastHeight = newHeight;
      lastWidth = newWidth;
      
      window.parent.postMessage(
        { 
          type: 'resize', 
          height: newHeight, 
          width: newWidth,
          minimized: isMinimized 
        },
        '*'
      );
    }
  }

  // Debounced version
  let timeout;
  function debouncedSendDimensions() {
    clearTimeout(timeout);
    timeout = setTimeout(sendDimensions, 50);
  }

  function setupDimensionMonitoring() {
    // Initial dimensions
    setTimeout(sendDimensions, 100);
    
    // Use ResizeObserver if available
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(debouncedSendDimensions);
      resizeObserver.observe(document.body);
      
      // Also observe the popup element specifically
      // const popup = document.querySelector('[data-popup="true"]');
      // if (popup) {
      //   resizeObserver.observe(popup);
      // }
    }
    
    // Event listeners
    window.addEventListener('load', debouncedSendDimensions);
    window.addEventListener('resize', debouncedSendDimensions);
    
    // Monitor for DOM changes and attribute changes
    const observer = new MutationObserver(debouncedSendDimensions);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-minimized']
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDimensionMonitoring);
  } else {
    setupDimensionMonitoring();
  }
})();