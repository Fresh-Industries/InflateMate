'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Code, Calendar, Package, ShoppingCart, Target, Star, Globe, Settings, Palette, Monitor, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface EmbedConfig {
  pageRoutes?: {
    booking?: string;
    inventory?: string;
    product?: string;
  };
  popularRentalsCount?: number;
  showPrices?: boolean;
  showDescriptions?: boolean;
  redirectUrl?: string;
  successMessage?: string;
}

interface WidgetConfig {
  redirectUrl?: string;
  successMessage?: string;
  pageRoutes: {
    booking: string;
    inventory: string;
    product: string;
  };
  popularRentalsCount: number;
  showPrices: boolean;
  showDescriptions: boolean;
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
}

export default function EmbeddedComponents({ 
  businessId, 
  embeddedComponents,
  currentDomain,
  embedConfig,
  theme = 'modern'
}: EmbeddedComponentsProps) {
  
  const [config, setConfig] = useState<WidgetConfig>({
    popularRentalsCount: embedConfig?.popularRentalsCount || 6,
    showPrices: embedConfig?.showPrices ?? true,
    showDescriptions: embedConfig?.showDescriptions ?? true,
    redirectUrl: embedConfig?.redirectUrl || '',
    successMessage: embedConfig?.successMessage || 'Thank you for your booking! We\'ll contact you soon.',
    pageRoutes: {
      booking: embedConfig?.pageRoutes?.booking || '/booking',
      inventory: embedConfig?.pageRoutes?.inventory || '/inventory', 
      product: embedConfig?.pageRoutes?.product || '/inventory'
    }
  });

  const [activeWidget, setActiveWidget] = useState('booking');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const businessDomain = currentDomain || `${businessId}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${businessDomain}`
    : `http://localhost:3001`;

  const generateCode = (widgetType: string, extraParams: Record<string, string> = {}) => {
    // Build data attributes
    const dataAttrs = [
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

    if (config.successMessage && config.successMessage !== 'Thank you for your booking! We\'ll contact you soon.') {
      dataAttrs.push(`data-success-message="${encodeURIComponent(config.successMessage)}"`);
    }

    // Add page routes for linking to business website
    Object.entries(config.pageRoutes).forEach(([key, value]) => {
      if (value) {
        dataAttrs.push(`data-${key}-page-route="${encodeURIComponent(value)}"`);
      }
    });

    if (!config.showPrices) {
      dataAttrs.push(`data-show-prices="false"`);
    }

    if (!config.showDescriptions) {
      dataAttrs.push(`data-show-descriptions="false"`);
    }

    // Add extra parameters
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) {
        const dataKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        dataAttrs.push(`data-${dataKey}="${value}"`);
      }
    });
    
    return `<!-- InflateMate Widget -->
<script src="${baseUrl}/embed/embed.js?v=2.1.0"></script>
<div class="inflatemate-widget" ${dataAttrs.join(' ')}></div>`;
  };



  const copyToClipboard = (widgetType: string, extraParams: Record<string, string> = {}) => {
    const code = generateCode(widgetType, extraParams);
    navigator.clipboard.writeText(code);
    toast.success('Widget code copied to clipboard!');
  };

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // NEW: Save embed configuration
  const saveEmbedConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/businesses/${businessId}/embed-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embedConfig: config }),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      toast.success('Embed configuration saved!');
    } catch (error) {
      console.error('Error saving embed config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
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
      {/* Header Card */}
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
          <div className="flex items-center justify-between mb-6">
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
            <Button 
              onClick={saveEmbedConfig} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Config
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Card className="rounded-xl border border-gray-100 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Widget Configuration
          </CardTitle>
          <CardDescription>
            Customize how your widgets behave and where they redirect users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Website Page Routes */}
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-medium">Your Website Page Routes</Label>
            <p className="text-xs text-gray-600 mb-3">
              Configure the page routes on your website. Widgets will link to your domain + these routes.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs">Booking Page Route</Label>
                <Input
                  placeholder="/booking"
                  value={config.pageRoutes.booking}
                  onChange={(e) => updateConfig({
                    pageRoutes: { ...config.pageRoutes, booking: e.target.value }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will link to: {businessDomain}{config.pageRoutes.booking}
                </p>
              </div>
              <div>
                <Label className="text-xs">Inventory/Catalog Page Route</Label>
                <Input
                  placeholder="/inventory or /products or /rentals"
                  value={config.pageRoutes.inventory}
                  onChange={(e) => updateConfig({
                    pageRoutes: { ...config.pageRoutes, inventory: e.target.value }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will link to: {businessDomain}{config.pageRoutes.inventory}
                </p>
              </div>
              <div>
                <Label className="text-xs">Product Detail Page Route Pattern</Label>
                <Input
                  placeholder="/inventory or /products or /rentals"
                  value={config.pageRoutes.product}
                  onChange={(e) => updateConfig({
                    pageRoutes: { ...config.pageRoutes, product: e.target.value }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will link to: {businessDomain}{config.pageRoutes.product}/[product-id]
                </p>
              </div>
            </div>
          </div>

          {/* Success Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Success Redirect URL (Optional)</Label>
              <Input
                placeholder="https://yoursite.com/thank-you"
                value={config.redirectUrl}
                onChange={(e) => updateConfig({ redirectUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500">Where to redirect after successful booking</p>
            </div>
            <div className="space-y-2">
              <Label>Popular Rentals Count</Label>
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

          <div className="space-y-2">
            <Label>Success Message</Label>
            <Textarea
              placeholder="Thank you for your booking! We'll contact you soon."
              value={config.successMessage}
              onChange={(e) => updateConfig({ successMessage: e.target.value })}
              rows={2}
            />
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Display Options</Label>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Prices</Label>
              <Switch
                checked={config.showPrices}
                onCheckedChange={(checked) => updateConfig({ showPrices: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Descriptions</Label>
              <Switch
                checked={config.showDescriptions}
                onCheckedChange={(checked) => updateConfig({ showDescriptions: checked })}
              />
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
                Generate embed codes for your customized widgets
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {previewMode ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeWidget} onValueChange={setActiveWidget} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Product
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="funnel" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Sales Funnel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="space-y-4 mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Booking Widget</h3>
                <p className="text-sm text-blue-700">
                  Allows customers to book your services directly. Includes date selection, item picking, and customer details form.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('booking')}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('booking')} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Booking Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 mt-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Inventory Widget</h3>
                <p className="text-sm text-green-700">
                  Displays your available inventory in a searchable, filterable grid with booking buttons.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('inventory')}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('inventory')} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Inventory Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="product" className="space-y-4 mt-6">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Product Detail Widget</h3>
                <p className="text-sm text-purple-700">
                  Shows detailed information for a specific product with specifications, images, and booking functionality.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="productId" className="text-sm font-medium">Product ID</Label>
                  <Input
                    id="productId"
                    placeholder="Enter product ID or leave {productId} for dynamic"
                    defaultValue="{productId}"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{productId}'} for dynamic insertion, or specific ID for fixed widget
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('product', { productId: '{productId}' })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('product', { productId: '{productId}' })} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Product Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="popular" className="space-y-4 mt-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Popular Rentals Widget</h3>
                <p className="text-sm text-yellow-700">
                  Showcases your most popular items in an attractive grid. Perfect for landing pages and promotional sections.
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('popular-rentals', { limit: config.popularRentalsCount.toString() })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('popular-rentals', { limit: config.popularRentalsCount.toString() })} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Popular Rentals Widget Code
              </Button>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-4 mt-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Sales Funnel Widget</h3>
                <p className="text-sm text-red-700">
                  Embed your sales funnel popup to capture leads and drive conversions with targeted offers.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="funnelId" className="text-sm font-medium">Sales Funnel ID</Label>
                  <Input
                    id="funnelId"
                    placeholder="Select from your active funnels"
                    defaultValue="your-funnel-id"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can find funnel IDs in Marketing → Sales Funnels
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                  {generateCode('sales-funnel', { funnelId: 'your-funnel-id' })}
                </code>
              </div>
              <Button onClick={() => copyToClipboard('sales-funnel', { funnelId: 'your-funnel-id' })} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Sales Funnel Widget Code
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-medium mb-2">Configure</h3>
                <p className="text-sm text-gray-600">Set up your widget behavior and styling preferences above</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-medium mb-2">Copy Code</h3>
                <p className="text-sm text-gray-600">Generate and copy the embed code for your chosen widget</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-medium mb-2">Embed</h3>
                <p className="text-sm text-gray-600">Paste the code into your website&apos;s HTML where you want the widget</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Widgets automatically inherit your brand colors and theme</li>
                <li>• All widgets are fully responsive and mobile-optimized</li>
                <li>• Widgets link directly to your custom domain ({businessDomain})</li>
                <li>• Use custom redirect URLs to keep users on your website after booking</li>
                <li>• Configure page routes to match your website structure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 