'use client';

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SiteConfig, BusinessWithSiteConfig, Theme, DynamicSection } from "@/lib/business/domain-utils";
import { Save, Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import AboutSettings from "./about-settings";
import ContactSettings from "./contact-settings";
import ColorSettings from "./color-settings";
import LandingSettings from "./landing-settings";
import ThemeSelector from "./ThemeSelector";
import AddSectionForm from "./AddSectionForm";
import { modern } from "@/lib/config/themes";

interface WebsiteCustomizerProps {
  businessId: string;
  initialData: Record<string, unknown>;
}

// Helper to get page section key
type PageSectionKey = 'landing' | 'about';
type PageConfig = {
  sections?: DynamicSection[];
  dynamicSections?: DynamicSection[];
  title?: string;
  description?: string;
}
type SectionArray = DynamicSection[];

const getPageSectionKey = (page: PageSectionKey): keyof SiteConfig => page;
const getSectionArrayKey = (page: PageSectionKey): 'sections' | 'dynamicSections' => 
  page === 'landing' ? 'sections' : 'dynamicSections';

export default function WebsiteCustomizer({ businessId, initialData }: WebsiteCustomizerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // State for managing the section form dialog
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DynamicSection | null>(null);
  const [activeTab, setActiveTab] = useState<PageSectionKey>('landing');

  const defaultTheme: Theme = { id: modern.id, name: modern.themeName };

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const initialSiteConfig = (initialData.siteConfig as SiteConfig | undefined);
    const defaultConfig: SiteConfig = {
      themeName: defaultTheme,
      hero: {
        title: "Welcome to our website",
        description: "We provide high-quality inflatable rentals for all types of events.",
        imageUrl: "",
      },
      landing: { // Ensure landing sections array exists
        sections: [],
      },
      about: { // Ensure about sections array exists
        title: "About Us",
        description: initialData.description as string || "We are a premier inflatable rental company dedicated to making your events memorable.",
        dynamicSections: [],
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

    // Merge initial config with defaults, ensuring section arrays are present
    const mergedConfig = {
      ...defaultConfig,
      ...initialSiteConfig,
      themeName: initialSiteConfig?.themeName || defaultConfig.themeName,
      landing: {
        ...(defaultConfig.landing),
        ...(initialSiteConfig?.landing),
        sections: initialSiteConfig?.landing?.sections || defaultConfig.landing?.sections || [],
      },
      about: {
        ...(defaultConfig.about),
        ...(initialSiteConfig?.about),
        title: initialSiteConfig?.about?.title || defaultConfig.about?.title,
        description: initialSiteConfig?.about?.description || defaultConfig.about?.description,
        dynamicSections: initialSiteConfig?.about?.dynamicSections || defaultConfig.about?.dynamicSections || [],
      },
    };
    return mergedConfig;
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
        body: JSON.stringify({ siteConfig }), // Saves the entire siteConfig including sections
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
  
  // Allow 'about' section updates for base settings (title, description)
  // Update the type to include 'about' in allowed sections
  const updateSiteConfig = useCallback((section: Exclude<keyof SiteConfig, 'themeName' | 'landing'>, data: Record<string, unknown>) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      setSiteConfig(prev => {
        const newConfig = { ...prev };
        if (!newConfig[section]) {
          newConfig[section] = {};
        }
        newConfig[section] = {
          ...(newConfig[section] as Record<string, unknown>),
          ...data,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
        return newConfig;
      });
    }, 100); 
  }, []);
  
  // New handler for theme changes
  const handleThemeChange = (theme: Theme) => {
    setSiteConfig(prev => ({
      ...prev,
      themeName: theme,
    }));
  };

  // -- Handlers for Dynamic Sections --
  const handleOpenAddSection = (page: PageSectionKey) => {
    setEditingSection(null);
    setIsSectionFormOpen(true);
    // Ensure that activeTab is set to the current page being edited
    if (page !== activeTab) {
      setActiveTab(page);
    }
  };

  const handleOpenEditSection = (section: DynamicSection) => {
    setEditingSection(section);
    setIsSectionFormOpen(true);
  };

  const handleTabChange = (value: string) => {
    // Only update activeTab if the value is a valid PageSectionKey
    if (value === 'landing' || value === 'about') {
      setActiveTab(value);
    }
  };

  const handleAddSection = (sectionData: Omit<DynamicSection, 'id'>) => {
    const newSection: DynamicSection = {
      ...sectionData,
      id: crypto.randomUUID(), // Generate unique ID
    };

    setSiteConfig(prev => {
      const pageKey = getPageSectionKey(newSection.page as PageSectionKey);
      const sectionArrayKey = getSectionArrayKey(newSection.page as PageSectionKey);
      
      const currentPageConfig = prev[pageKey] as PageConfig || {};
      const currentSections = currentPageConfig[sectionArrayKey] as SectionArray || []; 

      return {
        ...prev,
        [pageKey]: {
          ...currentPageConfig,
          [sectionArrayKey]: [...currentSections, newSection],
        },
      };
    });
    setIsSectionFormOpen(false);
    toast({ title: "Section Added", description: "Remember to save your changes." });
  };

  const handleEditSection = (updatedSectionData: DynamicSection) => {
     setSiteConfig(prev => {
      const pageKey = getPageSectionKey(updatedSectionData.page as PageSectionKey);
      const sectionArrayKey = getSectionArrayKey(updatedSectionData.page as PageSectionKey);
      
      const currentPageConfig = prev[pageKey] as PageConfig || {};
      const currentSections = currentPageConfig[sectionArrayKey] as SectionArray || [];

      const updatedSections = currentSections.map((section: DynamicSection) => 
        section.id === updatedSectionData.id ? updatedSectionData : section
      );

      return {
        ...prev,
        [pageKey]: {
          ...currentPageConfig,
          [sectionArrayKey]: updatedSections,
        },
      };
    });
    setIsSectionFormOpen(false);
    toast({ title: "Section Updated", description: "Remember to save your changes." });
  };
  
  const handleDeleteSection = (sectionId: string, page: PageSectionKey) => {
     setSiteConfig(prev => {
      const pageKey = getPageSectionKey(page);
      const sectionArrayKey = getSectionArrayKey(page);
      
      const currentPageConfig = prev[pageKey] as PageConfig || {};
      const currentSections = currentPageConfig[sectionArrayKey] as SectionArray || [];

      const updatedSections = currentSections.filter((section: DynamicSection) => section.id !== sectionId);

      return {
        ...prev,
        [pageKey]: {
          ...currentPageConfig,
          [sectionArrayKey]: updatedSections,
        },
      };
    });
     toast({ title: "Section Deleted", description: "Remember to save your changes.", variant: "destructive" });
  };

  // Helper to render sections for a given page
  const renderSections = (page: PageSectionKey) => {
    const pageKey = getPageSectionKey(page);
    const sectionArrayKey = getSectionArrayKey(page);
    const pageData = siteConfig[pageKey] as PageConfig || {};
    const sections = (pageData[sectionArrayKey] as SectionArray) || [];

    return (
      <div className="space-y-4">
        {sections.length === 0 && <p className="text-sm text-muted-foreground">No sections added yet.</p>}
        {sections.map((section: DynamicSection) => (
          <Card key={section.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium capitalize">{section.type.replace(/([A-Z])/g, ' $1')} Section</p>
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {section.content.title || 
                 ('text' in section.content ? section.content.text : 'Section Content')}
              </p>
            </div>
            <div className="flex space-x-2">
               <Button variant="outline" size="icon" onClick={() => handleOpenEditSection(section)}>
                 <Edit className="h-4 w-4" />
               </Button>
               <Button variant="destructive" size="icon" onClick={() => handleDeleteSection(section.id, page)}>
                 <Trash2 className="h-4 w-4" />
               </Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={() => handleOpenAddSection(page)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isSectionFormOpen} onOpenChange={setIsSectionFormOpen}>
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
      
        <Tabs defaultValue="landing" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto border-b rounded-none p-0">
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
            <TabsTrigger
              value="themeSettings"
              className="py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Theme Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="landing" className="m-0 space-y-6">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
                 <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Landing Page Sections</CardTitle>
                  <CardDescription>Add and manage sections for your landing page.</CardDescription>
                </CardHeader>
                 <CardContent>
                  {renderSections('landing')}
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Hero Section Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <LandingSettings 
                    hero={siteConfig.hero || {}} 
                    updateHero={(data) => updateSiteConfig('hero', data)}
                  />
                </CardContent>
              </Card>
              
            </TabsContent>
          
            <TabsContent value="about" className="m-0 space-y-6">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
                 <CardHeader>
                  <CardTitle className="text-2xl font-semibold">About Page Sections</CardTitle>
                  <CardDescription>Add and manage dynamic sections for your about page.</CardDescription>
                </CardHeader>
                 <CardContent>
                  {renderSections('about')}
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">About Page Base Settings</CardTitle>
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
            <TabsContent value="themeSettings" className="m-0">
              <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Theme Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeSelector 
                    business={initialData as BusinessWithSiteConfig}
                    onChange={handleThemeChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

          </div>
        </Tabs>
      </div>

      {/* Dialog for Add/Edit Section Form */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
        </DialogHeader>
        <AddSectionForm 
          key={editingSection?.id || 'new'} // Add key to reset form state when switching between add/edit
          initialData={editingSection} 
          onAddSection={handleAddSection} 
          onEditSection={handleEditSection} 
          onCancel={() => setIsSectionFormOpen(false)}
          businessId={businessId} // Pass businessId
          page={editingSection ? editingSection.page as PageSectionKey : activeTab}
          presetColors={{
            primary: siteConfig.colors?.primary,
            secondary: siteConfig.colors?.secondary,
            accent: siteConfig.colors?.accent,
            background: siteConfig.colors?.background
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 