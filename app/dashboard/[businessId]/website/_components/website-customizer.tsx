'use client';

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SiteConfig } from "@/lib/business/domain-utils";
import { Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AboutSettings from "./about-settings";
import ContactSettings from "./contact-settings";
import ColorSettings from "./color-settings";
import LandingSettings from "./landing-settings";

interface WebsiteCustomizerProps {
  businessId: string;
  initialData: Record<string, unknown>;
}

export default function WebsiteCustomizer({ businessId, initialData }: WebsiteCustomizerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize siteConfig from business data or create default
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const defaultConfig: SiteConfig = {
      hero: {
        title: "Welcome to our website",
        description: "We provide high-quality inflatable rentals for all types of events.",
        imageUrl: "",
      },
      about: {
        title: "About Us",
        description: initialData.description as string || "We are a premier inflatable rental company dedicated to making your events memorable.",
      },
      contact: {
        title: "Contact Us",
      },
      colors: {
        primary: "#3b82f6",
        secondary: "#6b7280",
        accent: "#f59e0b",
        background: "#f9fafb",
      },
      pages: {},
    };
    
    return (initialData.siteConfig as SiteConfig) || defaultConfig;
  });
  
  // Handle saving the site configuration
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/website`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteConfig }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save website configuration");
      }
      
      toast({
        title: "Website updated",
        description: "Your website configuration has been saved successfully.",
      });
      
      router.refresh();
    } catch (error) {
      console.error("Error saving website configuration:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your website configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating specific sections of the site config with debouncing
  const updateSiteConfig = useCallback((section: keyof SiteConfig, data: Record<string, unknown>) => {
    // Clear any existing timeout to debounce rapid updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Set a new timeout to update the state after a short delay
    updateTimeoutRef.current = setTimeout(() => {
      setSiteConfig(prev => {
        // Create a deep copy to avoid direct state mutation
        const newConfig = { ...prev };
        
        // Ensure the section exists
        if (!newConfig[section]) {
          newConfig[section] = {};
        }
        
        // Update the section with new data
        newConfig[section] = {
          ...(newConfig[section] as Record<string, unknown>),
          ...data,
        };
        
        return newConfig;
      });
    }, 100); // 100ms debounce
  }, []);
  
  
  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 px-6 py-2.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="landing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto border-b rounded-none p-0">
          <TabsTrigger
            value="landing"
            className="py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Landing Page
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            About Page
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Contact Page
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Colors
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <TabsContent value="landing" className="m-0">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Landing Page Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <LandingSettings 
                  hero={siteConfig.hero || {}} 
                  updateHero={(data) => updateSiteConfig('hero', data)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about" className="m-0">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">About Page Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <AboutSettings 
                  businessData={initialData} 
                  siteConfig={siteConfig} 
                  updateSiteConfig={(data) => updateSiteConfig('about', data)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="m-0">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Contact Page Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactSettings 
                  businessData={initialData} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="colors" className="m-0">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Color Scheme</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorSettings 
                  colors={siteConfig.colors || {}} 
                  updateColors={(data) => updateSiteConfig('colors', data)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
    </div>
  );
} 