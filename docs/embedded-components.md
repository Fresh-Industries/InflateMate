# InflateMate: Iframe Embed Components Implementation Plan

## 🎯 Goal
Build iframe-embeddable components that clients can copy and paste into their websites to:
- Book services
- Browse inventory
- View a specific item
- Engage with a popup sales funnel

This allows clients to embed key parts of their business site without needing to host or build custom frontend logic.

## 📋 Components to Make Embeddable

1. **Sales Funnel Popup** (`@/SalesFunnel`)
2. **Booking Form** (`@customer-booking-form.tsx`)
3. **Product Detail Page** (`@/[productId]`)
4. **Inventory Listing** (`@page.tsx`)

## 🏗️ Architecture Overview

### Core Components:
1. **Embed Routes**: Special Next.js routes that render components in iframe-ready format
2. **Embed SDK**: JavaScript library that clients include on their sites
3. **PostMessage Communication**: Secure communication between iframe and parent window
4. **Auto-resizing**: Dynamic height adjustment based on content
5. **Configuration System**: Allow customization via URL parameters and postMessage

## 📁 File Structure

```
app/
├── embed/
│   ├── [businessId]/
│   │   ├── booking/
│   │   │   └── page.tsx                    # Embeddable booking form
│   │   ├── inventory/
│   │   │   ├── page.tsx                    # Embeddable inventory list
│   │   │   └── [productId]/
│   │   │       └── page.tsx                # Embeddable product detail
│   │   ├── sales-funnel/
│   │   │   └── [funnelId]/
│   │   │       └── page.tsx                # Embeddable sales funnel
│   │   └── layout.tsx                      # Minimal layout for embeds
│   └── sdk/
│       └── route.ts                        # Serves the embed SDK
├── api/
│   └── embed/
│       └── config/
│           └── [businessId]/
│               └── route.ts                # Configuration endpoint
└── public/
    └── embed/
        ├── inflatemate-embed.js           # Main SDK file
        └── inflatemate-embed.min.js       # Minified SDK
```

## 🔧 Implementation Details

### 1. Embed Layout (`app/embed/[businessId]/layout.tsx`)

```tsx
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { notFound } from 'next/navigation';

export default async function EmbedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  
  try {
    const business = await getBusinessByDomain(businessId);
    
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{business.name} - Embedded Widget</title>
          <script dangerouslySetInnerHTML={{
            __html: `
              // Auto-resize iframe communication
              function sendHeight() {
                const height = document.documentElement.scrollHeight;
                window.parent.postMessage({
                  type: 'INFLATEMATE_RESIZE',
                  height: height
                }, '*');
              }
              
              // Send height on load and resize
              window.addEventListener('load', sendHeight);
              window.addEventListener('resize', sendHeight);
              
              // MutationObserver for dynamic content changes
              const observer = new MutationObserver(sendHeight);
              document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true
                });
              });
            `
          }} />
          <style dangerouslySetInnerHTML={{
            __html: `
              body { margin: 0; padding: 0; }
              * { box-sizing: border-box; }
            `
          }} />
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  } catch (error) {
    return notFound();
  }
}
```

### 2. Embeddable Booking Form (`app/embed/[businessId]/booking/page.tsx`)

```tsx
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { NewBookingForm } from '@/app/[domain]/booking/_components/customer-booking-form';
import { makeScale } from '@/app/[domain]/_themes/utils';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedBookingPage({ params, searchParams }: PageProps) {
  const { businessId } = await params;
  const search = await searchParams;

  try {
    const business = await getBusinessByDomain(businessId);
    const siteConfig = business.siteConfig || {};
    
    // Extract configuration from URL params
    const primaryColor = (search.primaryColor as string) || siteConfig.colors?.primary || '#4f46e5';
    const themeName = (search.theme as string) || siteConfig.themeName?.name || 'modern';
    
    // Build color scales
    const colors = {
      primary: makeScale(primaryColor),
      accent: makeScale(siteConfig.colors?.accent || '#f97316'),
      secondary: makeScale(siteConfig.colors?.secondary || '#06b6d4'),
      background: makeScale(siteConfig.colors?.background || '#ffffff'),
      text: makeScale(siteConfig.colors?.text || '#333333')
    };

    return (
      <div className="p-4">
        <NewBookingForm 
          businessId={business.id}
          themeName={themeName}
          colors={colors}
        />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
```

### 3. Embeddable Sales Funnel (`app/embed/[businessId]/sales-funnel/[funnelId]/page.tsx`)

```tsx
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { SalesFunnelPopup } from '@/app/[domain]/_components/SalesFunnel';
import { makeScale } from '@/app/[domain]/_themes/utils';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ businessId: string; funnelId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedSalesFunnelPage({ params, searchParams }: PageProps) {
  const { businessId, funnelId } = await params;
  const search = await searchParams;

  try {
    const [business, funnel] = await Promise.all([
      getBusinessByDomain(businessId),
      prisma.salesFunnel.findFirst({
        where: { id: funnelId, businessId }
      })
    ]);

    if (!funnel || !funnel.isActive) {
      return notFound();
    }

    const siteConfig = business.siteConfig || {};
    const primaryColor = (search.primaryColor as string) || siteConfig.colors?.primary || '#4f46e5';
    const themeName = (search.theme as string) || siteConfig.themeName?.name || 'modern';
    
    const colors = {
      primary: makeScale(primaryColor),
      accent: makeScale(siteConfig.colors?.accent || '#f97316'),
      secondary: makeScale(siteConfig.colors?.secondary || '#06b6d4'),
      background: makeScale(siteConfig.colors?.background || '#ffffff'),
      text: makeScale(siteConfig.colors?.text || '#333333')
    };

    const theme = themeConfig[themeName] || themeConfig.modern;

    return (
      <div className="min-h-screen">
        <SalesFunnelPopup
          businessId={business.id}
          funnel={{
            ...funnel,
            theme
          }}
          colors={colors}
          theme={theme}
        />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
```

### 4. Embed SDK (`public/embed/inflatemate-embed.js`)

```javascript
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
      this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
      
      this.container.appendChild(this.iframe);
    }

    getEmbedUrl() {
      const baseUrl = 'https://your-domain.com'; // Replace with actual domain
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
      window.addEventListener('message', (event) => {
        if (event.source !== this.iframe.contentWindow) return;
        
        const { type, height } = event.data;
        
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
            this.config.onError(event.data.error);
            break;
        }
      });

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
    }

    postMessage(message) {
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage(message, '*');
      }
    }
  }

  // Expose to global scope
  window.InflateMateEmbed = InflateMateEmbed;

})(window);
```

### 5. SDK Delivery Route (`app/embed/sdk/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sdkPath = path.join(process.cwd(), 'public', 'embed', 'inflatemate-embed.js');
    const sdkContent = fs.readFileSync(sdkPath, 'utf8');
    
    return new NextResponse(sdkContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000', // 1 year
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new NextResponse('SDK not found', { status: 404 });
  }
}
```

## 📖 Usage Examples

### 1. Booking Form Widget

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script src="https://yourdomain.com/embed/sdk"></script>
</head>
<body>
    <h1>Book Your Event</h1>
    <div id="booking-widget"></div>
    
    <script>
        InflateMateEmbed.create({
            businessId: 'your-business-id',
            type: 'booking',
            container: '#booking-widget',
            theme: 'modern',
            primaryColor: '#3b82f6',
            width: '100%',
            height: '600px',
            onLoad: function() {
                console.log('Booking widget loaded');
            },
            onResize: function(height) {
                console.log('Widget resized to:', height);
            }
        });
    </script>
</body>
</html>
```

### 2. Product Detail Widget

```html
<div id="product-widget"></div>
<script>
    InflateMateEmbed.create({
        businessId: 'your-business-id',
        type: 'product',
        productId: 'product-123',
        container: '#product-widget',
        theme: 'playful',
        primaryColor: '#f59e0b'
    });
</script>
```

### 3. Sales Funnel Popup

```html
<div id="funnel-widget"></div>
<script>
    InflateMateEmbed.create({
        businessId: 'your-business-id',
        type: 'sales-funnel',
        funnelId: 'funnel-456',
        container: '#funnel-widget',
        autoResize: true
    });
</script>
```

## 🔒 Security Considerations

1. **CORS Configuration**: Properly configure CORS headers for embed routes
2. **Content Security Policy**: Set appropriate CSP headers
3. **Iframe Sandbox**: Use sandbox attributes to restrict iframe capabilities
4. **Origin Validation**: Validate origin for postMessage communications
5. **Rate Limiting**: Implement rate limiting on embed endpoints

## 🎨 Customization Options

### URL Parameters:
- `theme`: Theme name (modern, playful, retro)
- `primaryColor`: Hex color for primary brand color
- `accentColor`: Hex color for accent elements
- `backgroundColor`: Background color
- `textColor`: Text color

### PostMessage Configuration:
```javascript
// Send configuration updates
widget.postMessage({
    type: 'INFLATEMATE_UPDATE_CONFIG',
    config: {
        primaryColor: '#new-color',
        theme: 'new-theme'
    }
});
```

## 📊 Analytics & Tracking

1. **Embed Analytics**: Track widget loads, interactions, conversions
2. **Performance Monitoring**: Monitor load times and errors
3. **Usage Metrics**: Track which widgets are most popular
4. **A/B Testing**: Support for testing different widget configurations

## 🚀 Implementation Phases

### Phase 1: Core Infrastructure
- [ ] Create embed routes structure
- [ ] Build basic iframe communication
- [ ] Implement auto-resizing
- [ ] Create minimal SDK

### Phase 2: Widget Implementation
- [ ] Embeddable booking form
- [ ] Embeddable inventory listing
- [ ] Embeddable product detail page
- [ ] Basic customization options

### Phase 3: Advanced Features
- [ ] Sales funnel popup widget
- [ ] Advanced theming system
- [ ] Analytics integration
- [ ] Performance optimization

### Phase 4: Developer Experience
- [ ] Comprehensive documentation
- [ ] Code examples and demos
- [ ] WordPress plugin
- [ ] React/Vue.js wrapper components

## 🔧 Technical Requirements

1. **Next.js App Router**: Use for embed routes
2. **PostMessage API**: For iframe communication
3. **Responsive Design**: Ensure widgets work on all devices
4. **Performance**: Optimize for fast loading
5. **Accessibility**: Ensure embed widgets are accessible
6. **Browser Support**: Support modern browsers (IE11+ if needed)

## 📝 Documentation Needs

1. **Integration Guide**: How to embed widgets
2. **Customization Guide**: Theming and styling options
3. **API Reference**: SDK methods and options
4. **Troubleshooting**: Common issues and solutions
5. **Examples**: Real-world implementation examples
