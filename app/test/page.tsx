'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Package, 
  Star, 
  Eye,
  Settings,
  Copy,
  RefreshCw
} from 'lucide-react';

// Types
interface WidgetConfig {
  businessId: string;
  type: string;
  theme?: string;
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  limit?: number;
  showPrices?: boolean;
  showDescriptions?: boolean;
  successMessage?: string;
  redirectUrl?: string;
  productId?: string;
  funnelId?: string;
}

interface EmbedConfig {
  businessId: string;
  businessName: string;
  availableWidgets: string[];
  theme: string;
  colors: Record<string, string>;
  embedUrls: {
    booking: string;
    inventory: string;
    popularRentals: string;
  };
}

interface SalesFunnelResponse {
  id: string;
  name: string;
  isActive: boolean;
  popupTitle: string;
  popupText: string;
  popupImage?: string;
  formTitle: string;
  thankYouMessage: string;
  couponId?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

// Test business ID - replace with a real one from your database
const TEST_BUSINESS_ID = 'cmb5lnorg000bcvbcwbpxii0p';

// Available themes from the simplified system
const AVAILABLE_THEMES = [
  { name: 'modern', displayName: 'Modern', description: 'Clean, professional design' },
  { name: 'playful', displayName: 'Playful', description: 'Fun, colorful design perfect for parties' },
  { name: 'retro', displayName: 'Retro', description: 'Vintage-inspired design' }
];

// InflateMate API interface
interface InflateMateAPI {
  create: (config: Record<string, unknown>) => { destroy?: () => void };
  init: () => void;
}

interface WindowWithInflateMate extends Window {
  InflateMate?: InflateMateAPI;
}

export default function EmbedTestPage() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(true);
  const [widgetInstances, setWidgetInstances] = useState<Array<{ destroy?: () => void }>>([]);
  const [availableFunnels, setAvailableFunnels] = useState<Array<{ id: string; name: string; isActive: boolean }>>([]);
  
  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    businessId: TEST_BUSINESS_ID,
    type: 'booking',
    theme: 'modern',
    primaryColor: '#4f46e5',
    accentColor: '#f97316',
    secondaryColor: '#06b6d4',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    limit: 6,
    showPrices: true,
    showDescriptions: true,
    successMessage: 'Thank you for your booking! We\'ll contact you soon.',
    redirectUrl: '',
  });

  // Load embed configuration
  useEffect(() => {
    if (scriptsLoaded) {
      fetchEmbedConfig();
      fetchAvailableFunnels(); // Also fetch available funnels for testing
    }
  }, [scriptsLoaded]);

  const fetchEmbedConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/embed/${TEST_BUSINESS_ID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
      }
      const config = await response.json();
      setEmbedConfig(config);
      
      // Update widget config with business defaults
      setWidgetConfig(prev => ({
        ...prev,
        theme: config.theme || 'modern',
        primaryColor: config.colors?.primary || '#4f46e5',
        accentColor: config.colors?.accent || '#f97316',
        secondaryColor: config.colors?.secondary || '#06b6d4',
        backgroundColor: config.colors?.background || '#ffffff',
        textColor: config.colors?.text || '#333333',
      }));
      
      console.log('📋 Embed Configuration loaded:', config);
    } catch (error) {
      console.error('❌ Failed to load embed configuration:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableFunnels = async () => {
    try {
      const response = await fetch(`/api/businesses/${TEST_BUSINESS_ID}/sales-funnels`);
      if (response.ok) {
        const funnels: SalesFunnelResponse[] = await response.json();
        setAvailableFunnels(funnels.map((f) => ({ 
          id: f.id, 
          name: f.name, 
          isActive: f.isActive 
        })));
        console.log('📋 Available Sales Funnels:', funnels);
      }
    } catch (error) {
      console.log('⚠️ Could not fetch sales funnels (may need authentication):', error);
    }
  };

  const generateWidgetHTML = (config: WidgetConfig) => {
    const attributes = Object.entries(config)
      .filter(([key, value]) => value !== undefined && value !== '' && key !== 'type' && key !== 'businessId')
      .map(([key, value]) => {
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `data-${kebabKey}="${value}"`;
      })
      .join('\n     ');

    return `<div data-inflatemate-widget
     data-business-id="${config.businessId}"
     data-type="${config.type}"${attributes ? '\n     ' + attributes : ''}>
</div>

<script src="/embed/loader.js"></script>`;
  };

  const addDynamicWidget = () => {
    const container = document.getElementById('dynamic-widget-container');
    if (!container) {
      alert('Widget container not found');
      return;
    }

    // Validate sales funnel widget has funnelId
    if (widgetConfig.type === 'sales-funnel' && !widgetConfig.funnelId) {
      container.innerHTML = `
        <div class="p-4 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded">
          <strong>Configuration Required:</strong> Sales funnel widgets need a Funnel ID. 
          ${availableFunnels.length > 0 ? 'Please select one from the dropdown above.' : 'Click "Load Available Funnels" to see available options or enter a funnel ID manually.'}
        </div>
      `;
      return;
    }

    // Clear existing widget
    container.innerHTML = '';

    // Use the new InflateMate.create API
    const w = window as WindowWithInflateMate;
    
    if (w.InflateMate && w.InflateMate.create) {
      try {
        // Create a container div
        const widgetDiv = document.createElement('div');
        container.appendChild(widgetDiv);

        // Create widget instance
        const widget = w.InflateMate.create({
          element: widgetDiv,
          businessId: widgetConfig.businessId,
          type: widgetConfig.type,
          theme: widgetConfig.theme,
          primaryColor: widgetConfig.primaryColor,
          accentColor: widgetConfig.accentColor,
          secondaryColor: widgetConfig.secondaryColor,
          backgroundColor: widgetConfig.backgroundColor,
          textColor: widgetConfig.textColor,
          limit: widgetConfig.limit,
          showPrices: widgetConfig.showPrices,
          showDescriptions: widgetConfig.showDescriptions,
          successMessage: widgetConfig.successMessage,
          redirectUrl: widgetConfig.redirectUrl,
          productId: widgetConfig.productId,
          funnelId: widgetConfig.funnelId,
          onSuccess: (data: { successMessage?: string }) => {
            console.log('🎉 Widget success:', data);
            alert(`Success: ${data.successMessage || 'Widget completed successfully!'}`);
          },
          onError: (error: string) => {
            console.error('❌ Widget error:', error);
            alert(`Error: ${error}`);
          }
        });
        
        setWidgetInstances(prev => [...prev, widget]);
        console.log('🔄 Dynamic widget created:', widgetConfig);
      } catch (error) {
        console.error('❌ Failed to create widget:', error);
        container.innerHTML = `
          <div class="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
            <strong>Widget Error:</strong> ${error}
          </div>
        `;
      }
    } else {
      console.error('❌ InflateMate API not available');
      container.innerHTML = `
        <div class="p-4 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded">
          <strong>API Error:</strong> InflateMate API not available. Make sure the loader script is loaded.
        </div>
      `;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log('📋 Code copied to clipboard');
  };

  const refreshConfig = () => {
    fetchEmbedConfig();
  };

  const clearDynamicWidget = () => {
    const container = document.getElementById('dynamic-widget-container');
    if (container) {
      container.innerHTML = `
        <p class="text-gray-500 text-center py-20">
          Configure your widget settings and click "Preview Widget" to see it here
        </p>
      `;
    }
    
    // Destroy widget instances
    widgetInstances.forEach(widget => {
      if (widget && widget.destroy) {
        widget.destroy();
      }
    });
    setWidgetInstances([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          🎪 InflateMate Embed Test Suite
          <Badge variant="secondary">v3.0.0 - Simplified</Badge>
        </h1>
        <p className="text-gray-600 text-lg">
          Testing environment for the new simplified embed widget system
        </p>
      </div>

      {/* Load embed script */}
      <Script 
        src="/embed/loader.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ InflateMate embed script loaded successfully');
          setScriptsLoaded(true);
          
          // Log available API
          const w = window as WindowWithInflateMate;
          if (w.InflateMate) {
            console.log('📋 Available InflateMate API:', Object.keys(w.InflateMate));
          }
        }}
        onError={(error) => {
          console.error('❌ Failed to load InflateMate embed script:', error);
          setError('Failed to load embed script');
        }}
      />

      {/* Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className={scriptsLoaded ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {scriptsLoaded ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <p className="font-medium">Embed Script</p>
                <p className="text-sm text-gray-600">
                  {scriptsLoaded ? 'Loaded' : 'Loading...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={embedConfig ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {embedConfig ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <p className="font-medium">Configuration</p>
                <p className="text-sm text-gray-600">
                  {embedConfig ? 'Loaded' : isLoading ? 'Loading...' : 'Error'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Debug Mode</p>
                <Switch 
                  checked={debugMode} 
                  onCheckedChange={setDebugMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium">Actions</p>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={refreshConfig}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearDynamicWidget}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Configuration Summary */}
      {embedConfig && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              📊 Business Configuration
              <Badge>Simplified API</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Business Info</h4>
                <p><strong>Name:</strong> {embedConfig.businessName}</p>
                <p><strong>ID:</strong> {embedConfig.businessId}</p>
                <p><strong>Theme:</strong> {embedConfig.theme}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Available Widgets</h4>
                {embedConfig.availableWidgets.map((widget) => (
                  <div key={widget} className="flex items-center gap-2 mb-1">
                    <Badge variant="default">
                      {widget}
                    </Badge>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Default Colors</h4>
                <div className="space-y-1">
                  {Object.entries(embedConfig.colors).map(([name, color]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{name}: {color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Testing Interface */}
      <Tabs defaultValue="interactive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="interactive">Interactive Testing</TabsTrigger>
          <TabsTrigger value="examples">Widget Examples</TabsTrigger>
          <TabsTrigger value="generator">Code Generator</TabsTrigger>
          <TabsTrigger value="debug">Debug Console</TabsTrigger>
        </TabsList>

        {/* Interactive Testing Tab */}
        <TabsContent value="interactive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget Configuration Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Widget Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Widget Type */}
                <div>
                  <Label htmlFor="widget-type">Widget Type</Label>
                  <Select 
                    value={widgetConfig.type} 
                    onValueChange={(value) => setWidgetConfig(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="widget-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">🗓️ Booking Widget</SelectItem>
                      <SelectItem value="inventory">📦 Inventory Browse</SelectItem>
                      <SelectItem value="popular-rentals">⭐ Popular Rentals</SelectItem>
                      <SelectItem value="sales-funnel">🎯 Sales Funnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme */}
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={widgetConfig.theme} 
                    onValueChange={(value) => setWidgetConfig(prev => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_THEMES.map((theme) => (
                        <SelectItem key={theme.name} value={theme.name}>
                          {theme.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={widgetConfig.primaryColor}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <Input
                      id="accent-color"
                      type="color"
                      value={widgetConfig.accentColor}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Widget-specific options */}
                {widgetConfig.type === 'popular-rentals' && (
                  <>
                    <div>
                      <Label htmlFor="limit">Item Limit</Label>
                      <Input
                        id="limit"
                        type="number"
                        min="1"
                        max="12"
                        value={widgetConfig.limit || 6}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 6;
                          setWidgetConfig(prev => ({ ...prev, limit: value }));
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-prices"
                        checked={widgetConfig.showPrices}
                        onCheckedChange={(checked) => setWidgetConfig(prev => ({ ...prev, showPrices: checked }))}
                      />
                      <Label htmlFor="show-prices">Show Prices</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-descriptions"
                        checked={widgetConfig.showDescriptions}
                        onCheckedChange={(checked) => setWidgetConfig(prev => ({ ...prev, showDescriptions: checked }))}
                      />
                      <Label htmlFor="show-descriptions">Show Descriptions</Label>
                    </div>
                  </>
                )}

                {widgetConfig.type === 'sales-funnel' && (
                  <div>
                    <Label htmlFor="funnel-id">Funnel ID</Label>
                    {availableFunnels.length > 0 ? (
                      <Select 
                        value={widgetConfig.funnelId || ''} 
                        onValueChange={(value) => setWidgetConfig(prev => ({ ...prev, funnelId: value }))}
                      >
                        <SelectTrigger id="funnel-id">
                          <SelectValue placeholder="Select a funnel" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFunnels.filter(f => f.isActive).map((funnel) => (
                            <SelectItem key={funnel.id} value={funnel.id}>
                              {funnel.name} ({funnel.id.slice(-8)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="funnel-id"
                        type="text"
                        placeholder="Enter sales funnel ID"
                        value={widgetConfig.funnelId || ''}
                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, funnelId: e.target.value }))}
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                                             {availableFunnels.length > 0 
                         ? `${availableFunnels.length} funnel(s) available` 
                         : "You&apos;ll need a valid funnel ID from your business dashboard"
                       }
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={fetchAvailableFunnels}
                      className="mt-2 w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Load Available Funnels
                    </Button>
                  </div>
                )}

                {/* Success Message */}
                <div>
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    value={widgetConfig.successMessage}
                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                    rows={2}
                  />
                </div>

                <Button onClick={addDynamicWidget} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Widget
                </Button>
              </CardContent>
            </Card>

            {/* Widget Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Widget Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  id="dynamic-widget-container" 
                  className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
                >
                  <p className="text-gray-500 text-center py-20">
                    Configure your widget settings and click &quot;Preview Widget&quot; to see it here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Widget Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Widget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] border rounded bg-gray-50 p-2">
                  <div 
                    data-inflatemate-widget
                    data-business-id={TEST_BUSINESS_ID}
                    data-type="booking"
                    data-theme="modern"
                    data-primary-color="#4f46e5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Widget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] border rounded bg-gray-50 p-2">
                  <div 
                    data-inflatemate-widget
                    data-business-id={TEST_BUSINESS_ID}
                    data-type="inventory"
                    data-theme="playful"
                    data-primary-color="#f97316"
                    data-show-prices="true"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Popular Rentals Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Popular Rentals Widget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] border rounded bg-gray-50 p-2">
                  <div 
                    data-inflatemate-widget
                    data-business-id={TEST_BUSINESS_ID}
                    data-type="popular-rentals"
                    data-theme="retro"
                    data-primary-color="#059669"
                    data-limit="3"
                    data-show-prices="true"
                    data-show-descriptions="true"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sales Funnel Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Sales Funnel Widget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] border rounded bg-gray-50 p-2">
                  {availableFunnels.length > 0 ? (
                    <div 
                      data-inflatemate-widget
                      data-business-id={TEST_BUSINESS_ID}
                      data-type="sales-funnel"
                      data-funnel-id={availableFunnels.find(f => f.isActive)?.id || ''}
                      data-theme="modern"
                      data-primary-color="#8b5cf6"
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-2">⚠️ Sales Funnel Widget requires a valid Funnel ID</p>
                      <p className="text-sm mb-4">Use the Interactive Testing tab to load available funnels</p>
                      <Button onClick={fetchAvailableFunnels} size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Load Available Funnels
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Code Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated HTML Code
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(generateWidgetHTML(widgetConfig))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                <code>{generateWidgetHTML(widgetConfig)}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Add the widget HTML to your page:</h4>
                  <p className="text-sm text-gray-600">
                    Copy the generated HTML above and paste it into your website where you want the widget to appear.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Include the embed script:</h4>
                  <p className="text-sm text-gray-600">
                    The loader script will automatically initialize any widgets with the data-inflatemate-widget attribute.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Programmatic API (optional):</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs">
{`const widget = InflateMate.create({
  element: document.getElementById('my-widget'),
  businessId: '${TEST_BUSINESS_ID}',
  type: 'booking',
  theme: 'modern'
});`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Console Tab */}
        <TabsContent value="debug" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Configuration:</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto max-h-64">
                    <code>{JSON.stringify(embedConfig, null, 2)}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Widget State:</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(widgetConfig, null, 2)}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Active Widget Instances:</h4>
                  <p className="text-sm text-gray-600">
                    {widgetInstances.length} widget(s) currently active
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Console Messages:</h4>
                                      <p className="text-sm text-gray-600">
                      Open your browser&apos;s developer console to see detailed embed system logs.
                    </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 