'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Code, Calendar, Package, ShoppingCart, Target } from "lucide-react";
import { toast } from "sonner";

interface EmbeddedComponentsProps {
  businessId: string;
  embeddedComponents: boolean;
  currentDomain?: string | null;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  theme?: string;
}

export default function EmbeddedComponents({ 
  businessId, 
  embeddedComponents,
  currentDomain,
  colors = {},
  theme = 'modern'
}: EmbeddedComponentsProps) {
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedColor, setSelectedColor] = useState(colors.primary || '#4f46e5');
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${currentDomain || process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : 'http://localhost:3000';

  const generateCode = (widgetType: string, extraParams: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    if (selectedTheme !== 'modern') params.append('theme', selectedTheme);
    if (selectedColor !== colors.primary && selectedColor) params.append('primaryColor', selectedColor);
    
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    //  const queryString = params.toString() ? `?${params.toString()}` : '';
    
    return `<script src="${baseUrl}/embed/sdk"></script>
<div id="${widgetType}-widget"></div>
<script>
    InflateMateEmbed.create({
        businessId: '${businessId}',
        type: '${widgetType}',
        container: '#${widgetType}-widget',
        theme: '${selectedTheme}',${selectedColor ? `\n        primaryColor: '${selectedColor}',` : ''}${Object.entries(extraParams).map(([key, value]) => value ? `\n        ${key}: '${value}',` : '').join('')}
        autoResize: true,
        onLoad: function() {
            console.log('${widgetType} widget loaded');
        },
        onError: function(error) {
            console.error('Error loading ${widgetType} widget:', error);
        }
    });
</script>`;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
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
      <Card className="rounded-xl border border-gray-100 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Code className="h-6 w-6" />
            Embedded Components
          </CardTitle>
          <CardDescription>
            Create embeddable widgets that customers can integrate into their websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Enabled
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">
              Embedded components are active for your business
            </p>
          </div>

          {/* Global Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="theme">Default Theme</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="retro">Retro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Primary Color Override</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#4f46e5"
                  className="flex-1"
                />
                <div 
                  className="w-10 h-10 rounded border border-gray-300" 
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to use business default: {colors.primary || '#4f46e5'}
              </p>
            </div>
          </div>

          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="funnel" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Sales Funnel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Widget</CardTitle>
                  <CardDescription>
                    Allow customers to book your services directly from their website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <code className="text-sm whitespace-pre-wrap font-mono">
                      {generateCode('booking')}
                    </code>
                  </div>
                  <Button onClick={() => copyToClipboard(generateCode('booking'))} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Widget</CardTitle>
                  <CardDescription>
                    Display your available inventory items in a browsable format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <code className="text-sm whitespace-pre-wrap font-mono">
                      {generateCode('inventory')}
                    </code>
                  </div>
                  <Button onClick={() => copyToClipboard(generateCode('inventory'))} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Detail Widget</CardTitle>
                  <CardDescription>
                    Show details for a specific product with booking functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productId">Product ID</Label>
                      <Input
                        id="productId"
                        placeholder="Enter product ID"
                        defaultValue="your-product-id"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm whitespace-pre-wrap font-mono">
                        {generateCode('product', { productId: 'your-product-id' })}
                      </code>
                    </div>
                    <Button onClick={() => copyToClipboard(generateCode('product', { productId: 'your-product-id' }))} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Funnel Widget</CardTitle>
                  <CardDescription>
                    Embed your sales funnel to capture leads and drive conversions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="funnelId">Funnel ID</Label>
                      <Input
                        id="funnelId"
                        placeholder="Enter funnel ID"
                        defaultValue="your-funnel-id"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm whitespace-pre-wrap font-mono">
                        {generateCode('sales-funnel', { funnelId: 'your-funnel-id' })}
                      </code>
                    </div>
                    <Button onClick={() => copyToClipboard(generateCode('sales-funnel', { funnelId: 'your-funnel-id' }))} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 