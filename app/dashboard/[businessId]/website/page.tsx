import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Palette,
  Image as ImageIcon,
  Type,
  Settings2,
  Eye,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WebsitePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground">
            Customize your public website and online presence
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Eye className="h-4 w-4" /> Preview Site
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none">
            <Globe className="h-4 w-4" /> Publish Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-6">
        {/* Main Editor */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Website Content</CardTitle>
              <CardDescription className="hidden sm:block">
                Customize your website sections and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Section Editor */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">Hero Section</h3>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="space-y-4 border rounded-lg p-3 sm:p-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Headline</Label>
                    <Input
                      id="hero-title"
                      defaultValue="Premium Bounce Houses for Unforgettable Parties"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      defaultValue="Make your next event extraordinary with our high-quality bounce houses and exceptional service."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-image">Background Image</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-full sm:w-40 h-40 sm:h-24 rounded-lg border bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button variant="outline" className="w-full sm:w-auto">Change Image</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section Editor */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">Features Section</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 border rounded-lg p-3 sm:p-4">
                  <div className="space-y-2">
                    <Label>Feature Cards</Label>
                    {[1, 2, 3].map((feature) => (
                      <div
                        key={feature}
                        className="flex flex-col sm:flex-row items-start gap-4 p-3 sm:p-4 border rounded-lg"
                      >
                        <div className="flex-1 space-y-2 w-full">
                          <Input defaultValue={`Feature ${feature} Title`} />
                          <Textarea defaultValue={`Feature ${feature} description goes here...`} />
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="h-4 w-4" /> Add Feature
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Section Button */}
          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" /> Add New Section
          </Button>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4" />
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select defaultValue="blue">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Ocean Blue</SelectItem>
                    <SelectItem value="purple">Royal Purple</SelectItem>
                    <SelectItem value="green">Forest Green</SelectItem>
                    <SelectItem value="custom">Custom Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Style</Label>
                <Select defaultValue="modern">
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern Sans</SelectItem>
                    <SelectItem value="classic">Classic Serif</SelectItem>
                    <SelectItem value="playful">Playful Display</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Settings2 className="h-4 w-4" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" placeholder="Your Bounce House Business" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Brief description for search engines..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Social Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable social media cards
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Domain Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Globe className="h-4 w-4" />
                Domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Domain</Label>
                <div className="flex items-center gap-2">
                  <Input defaultValue="yourbusiness.inflatemate.com" readOnly className="text-sm" />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Type className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Connect Custom Domain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 