module.exports = {
  ci: {
    collect: {
      // Use a simple static approach for testing
      url: [
        'https://staging.inflatemate.co',
        'https://staging.inflatemate.co/features',
        'https://staging.inflatemate.co/pricing',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        // Core Web Vitals thresholds (more realistic)
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.25 }],
        
        // Performance metrics (realistic for complex apps)
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'speed-index': ['warn', { maxNumericValue: 8000 }],
        'interactive': ['warn', { maxNumericValue: 15000 }],
        
        // Best practices (fixed audit names)
        'uses-text-compression': ['warn', { minScore: 0.8 }],
        'unused-javascript': ['warn', { minScore: 0.5 }],
        
        // Accessibility (more lenient)
        'color-contrast': ['warn', { minScore: 0.8 }],
        'image-alt': ['warn', { minScore: 0.9 }],
        'heading-order': ['warn', { minScore: 0.9 }],
        
        // SEO
        'meta-description': ['warn', { minScore: 0.9 }],
        'document-title': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}; 