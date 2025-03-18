'use client';

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SiteConfig } from "@/lib/business/domain-utils";
import { Save, Loader2 } from "lucide-react";
import GeneralSettings from "./general-settings";
import ColorSettings from "./color-settings";
import HeroSettings from "./hero-settings";
import PagesSettings from "./pages-settings";
import PreviewModal from "./preview-modal";

interface WebsiteCustomizerProps {
  businessId: string;
  initialData: Record<string, unknown>;
}

export default function WebsiteCustomizer({ businessId, initialData }: WebsiteCustomizerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    <div className="space-y-6">
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center gap-2">
          
          
          <Button 
            onClick={handleSave}
            disabled={isLoading}
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
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full bg-muted/50 p-0 h-auto">
          <div className="flex w-full">
            <TabsTrigger 
              value="general" 
              className="flex-1 rounded-none py-3 data-[state=active]:bg-background"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="colors" 
              className="flex-1 rounded-none py-3 data-[state=active]:bg-background"
            >
              Colors
            </TabsTrigger>
            <TabsTrigger 
              value="hero" 
              className="flex-1 rounded-none py-3 data-[state=active]:bg-background"
            >
              Hero Section
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="flex-1 rounded-none py-3 data-[state=active]:bg-background"
            >
              Pages
            </TabsTrigger>
          </div>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general" className="m-0">
            <GeneralSettings 
              businessData={initialData} 
              siteConfig={siteConfig} 
              updateSiteConfig={(data) => updateSiteConfig('about', data)}
            />
          </TabsContent>
          
          <TabsContent value="colors" className="m-0">
            <ColorSettings 
              colors={siteConfig.colors || {}} 
              updateColors={(data) => updateSiteConfig('colors', data)}
            />
          </TabsContent>
          
          <TabsContent value="hero" className="m-0">
            <HeroSettings 
              hero={siteConfig.hero || {}} 
              updateHero={(data) => updateSiteConfig('hero', data)}
            />
          </TabsContent>
          
          <TabsContent value="pages" className="m-0">
            <PagesSettings 
              pages={siteConfig.pages || {}} 
              updatePages={(data) => updateSiteConfig('pages', data)}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Preview Modal */}
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        businessId={businessId}
        siteConfig={siteConfig}
      />
    </div>
  );
} 