'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Code, Calendar, Package, ShoppingCart, Target, Star, Globe, Palette, Monitor, CheckCircle, Check, Zap } from "lucide-react";
import { toast } from "sonner";

interface EmbedConfig {
  pageRoutes?: {
    booking?: string;
    inventory?: string;
    product?: string;
  };
  popularRentalsCount?: number;
  redirectUrl?: string;
}

interface WidgetConfig {
  redirectUrl: string;
  pageRoutes: {
    booking: string;
    inventory: string;
    product: string;
  };
  popularRentalsCount: number;
}

interface EmbeddedComponentsProps {
  businessId: string;
  embeddedComponents: boolean;
  currentDomain?: string | null;
  embedConfig?: EmbedConfig;
  theme?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  onUpdateEmbedConfig?: (config: EmbedConfig) => void;
}

export default function EmbeddedComponents({ 
  businessId, 
  embeddedComponents,
  currentDomain,
  embedConfig,
  theme = 'modern',
  onUpdateEmbedConfig
}: EmbeddedComponentsProps) {
  
  const [config, setConfig] = useState<WidgetConfig>({
    popularRentalsCount: embedConfig?.popularRentalsCount || 6,
    redirectUrl: embedConfig?.redirectUrl || '/success',
    pageRoutes: {
      booking: embedConfig?.pageRoutes?.booking || '/booking',
      inventory: embedConfig?.pageRoutes?.inventory || '/inventory', 
      product: embedConfig?.pageRoutes?.product || '/inventory'
    }
  });

  const [activeWidget, setActiveWidget] = useState('booking');

  const businessDomain = currentDomain || `${businessId}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${businessDomain}`
    : `http://localhost:3001`;

  const generateCode = (widgetType: string, extraParams: Record<string, string> = {}) => {
    // Build data attributes
    const dataAttrs = [
      `data-inflatemate-widget`,
      `data-business-id="${businessId}"`,
      `data-type="${widgetType}"`
    ];

    // Theme (only if different from default)
    if (theme && theme !== 'modern') {
      dataAttrs.push(`data-theme="${theme}"`);
    }

    // Widget-specific configuration
    if (config.redirectUrl) {
      dataAttrs.push(`data-redirect-url="${encodeURIComponent(config.redirectUrl)}"`);
    }

    // Add page routes for linking to business website
    Object.entries(config.pageRoutes).forEach(([key, value]) => {
      if (value) {
        dataAttrs.push(`data-${key}-page-route="${encodeURIComponent(value)}"`);
      }
    });

    // Add extra parameters
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) {
        const dataKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        dataAttrs.push(`data-${dataKey}="${value}"`);
      }
    });
    
    return `<!-- InflateMate Widget -->
<script src="${baseUrl}/embed/loader.js"></script>
<div ${dataAttrs.join(' ')}></div>`;
  };

  const copyToClipboard = (widgetType: string, extraParams: Record<string, string> = {}) => {
    const code = generateCode(widgetType, extraParams);
    navigator.clipboard.writeText(code);
    toast.success('Widget code copied to clipboard!');
  };

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    // Notify parent of changes
    if (onUpdateEmbedConfig) {
      const embedConfigUpdate: EmbedConfig = {
        popularRentalsCount: newConfig.popularRentalsCount,
        redirectUrl: newConfig.redirectUrl,
        pageRoutes: newConfig.pageRoutes
      };
      onUpdateEmbedConfig(embedConfigUpdate);
    }
  };

  if (!embeddedComponents) {
    return (
      <Card className="rounded-xl border border-gray-100 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Code className="h-6 w-6" />
            Embedded Components
          </CardTitle>
          <CardDescription>
            Embedded components are currently disabled. Enable them in your business settings to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Code className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              Enable embedded components in Settings → General to start creating embeddable widgets.
            </p>
            <Button variant="outline" onClick={() => window.location.href = `/dashboard/${businessId}/settings`}>
              Go to Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card with Domain Info */}
      <Card className="rounded-xl border border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-600" />
            Embedded Components
            <Badge className="bg-green-100 text-green-800 ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            Create powerful, customizable widgets that integrate seamlessly into any website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Domain</p>
                <p className="text-xs text-gray-600">{businessDomain}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Palette className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Theme</p>
                <p className="text-xs text-gray-600 capitalize">{theme}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Monitor className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Responsive</p>
                <p className="text-xs text-gray-600">Auto-sizing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Card className="rounded-xl border border-gray-100 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Widget Configuration
          </CardTitle>
          <CardDescription>
            Configure how your widgets behave and where they redirect users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Popular Rentals</Label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Items to Display</Label>
                  <Select 
                    value={config.popularRentalsCount.toString()} 
                    onValueChange={(value) => updateConfig({ popularRentalsCount: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 items</SelectItem>
                      <SelectItem value="6">6 items</SelectItem>
                      <SelectItem value="9">9 items</SelectItem>
                      <SelectItem value="12">12 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base font-medium">Website Integration</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Booking Page Route</Label>
                  <Input
                    placeholder="/booking"
                    value={config.pageRoutes.booking}
                    onChange={(e) => updateConfig({
                      pageRoutes: { ...config.pageRoutes, booking: e.target.value }
                    })}
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    → {businessDomain}{config.pageRoutes.booking}
                  </p>
                </div>
                <div>
                  <Label className="text-xs">Inventory Page Route</Label>
                  <Input
                    placeholder="/inventory or /products or /rentals"
                    value={config.pageRoutes.inventory}
                    onChange={(e) => updateConfig({
                      pageRoutes: { ...config.pageRoutes, inventory: e.target.value }
                    })}
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    → {businessDomain}{config.pageRoutes.inventory}
                  </p>
                </div>
                <div>
                  <Label className="text-xs">Product Page Route Pattern</Label>
                  <Input
                    placeholder="/inventory or /products or /rentals"
                    value={config.pageRoutes.product}
                    onChange={(e) => updateConfig({
                      pageRoutes: { ...config.pageRoutes, product: e.target.value }
                    })}
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    → {businessDomain}{config.pageRoutes.product}/[product-id]
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Configuration */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Success Redirect Path (Required)</Label>
              <Input
                placeholder="/success"
                value={config.redirectUrl}
                onChange={(e) => updateConfig({ redirectUrl: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500">
                Redirect customers to this page after successful booking → {businessDomain}{config.redirectUrl || '/success'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widget Generator */}
      <Card className="rounded-xl border border-gray-100 bg-white shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Widget Generator</CardTitle>
              <CardDescription>
                Copy and paste these codes into your website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeWidget} onValueChange={setActiveWidget} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="booking" className="flex items-center gap-2 text-xs lg:text-sm">
                <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Booking</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2 text-xs lg:text-sm">
                <Package className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center gap-2 text-xs lg:text-sm">
                <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Product</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2 text-xs lg:text-sm">
                <Star className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Popular</span>
              </TabsTrigger>
              <TabsTrigger value="funnel" className="flex items-center gap-2 text-xs lg:text-sm">
                <Target className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Funnel</span>
              </TabsTrigger>
              <TabsTrigger value="success" className="flex items-center gap-2 text-xs lg:text-sm">
                <Check className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Success</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="space-y-4 mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Booking Widget</h3>
                <p className="text-sm text-blue-700">
                  Complete booking form with date selection, item picking, and payment processing.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('booking')}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('booking')} className="gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Booking Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 mt-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Inventory Widget</h3>
                <p className="text-sm text-green-700">
                  Searchable catalog of all your available rental items.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('inventory')}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('inventory')} className="gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Inventory Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="product" className="space-y-4 mt-6">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Product Detail Widget</h3>
                <p className="text-sm text-purple-700">
                  Detailed product page with specs, images, and booking button.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="productId" className="text-sm font-medium">Product ID</Label>
                  <Input
                    id="productId"
                    placeholder="Enter specific product ID or use {productId}"
                    defaultValue="{productId}"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{productId}'} for dynamic insertion
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('product', { productId: '{productId}' })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('product', { productId: '{productId}' })} className="gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Product Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="popular" className="space-y-4 mt-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Popular Rentals Widget</h3>
                <p className="text-sm text-yellow-700">
                  Showcase your most popular items ({config.popularRentalsCount} items displayed).
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('popular-rentals', { limit: config.popularRentalsCount.toString() })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('popular-rentals', { limit: config.popularRentalsCount.toString() })} className="gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Popular Rentals Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-4 mt-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Sales Funnel Widget</h3>
                <p className="text-sm text-red-700">
                  Lead capture popup with special offers and promotions.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="funnelId" className="text-sm font-medium">Sales Funnel ID</Label>
                  <Input
                    id="funnelId"
                    placeholder="your-funnel-id"
                    defaultValue="your-funnel-id"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find this in Marketing → Sales Funnels
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('sales-funnel', { funnelId: 'your-funnel-id' })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('sales-funnel', { funnelId: 'your-funnel-id' })} className="gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Sales Funnel Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="success" className="space-y-4 mt-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Booking Success Page</h3>
                <p className="text-sm text-green-700">
                  Confirmation page showing booking details and next steps.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="bookingId" className="text-sm font-medium">Booking ID</Label>
                  <Input
                    id="bookingId"
                    placeholder="Use {bookingId} for dynamic insertion"
                    defaultValue="{bookingId}"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use in redirect URLs after successful payment
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('booking-success', { bookingId: '{bookingId}' })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('booking-success', { bookingId: '{bookingId}' })} className="gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Success Page Widget Code
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card className="rounded-xl border border-gray-100 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Integration Guide</CardTitle>
          <CardDescription>
            How to add widgets to your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-medium mb-2">Configure</h3>
              <p className="text-sm text-gray-600">Set your preferences in the configuration panel above</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-medium mb-2">Copy Code</h3>
              <p className="text-sm text-gray-600">Choose a widget and copy the generated embed code</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-medium mb-2">Embed</h3>
              <p className="text-sm text-gray-600">Paste the code into your website&apos;s HTML</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">✨ Key Features</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Automatically matches your brand colors and theme</li>
              <li>• Fully responsive and mobile-optimized</li>
              <li>• Links directly to your website ({businessDomain})</li>
              <li>• Secure payment processing with Stripe</li>
              <li>• Real-time availability checking</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 