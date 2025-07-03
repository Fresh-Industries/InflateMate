'use client';

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SiteConfig, BusinessWithSiteConfig, Theme, DynamicSection } from "@/lib/business/domain-utils";
import { Save, Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet";
import AboutSettings from "./about-settings";
import ContactSettings from "./contact-settings";
import ColorSettings from "./color-settings";
import LandingSettings from "./landing-settings";
import ThemeSelector from "./ThemeSelector";
import AddSectionForm from "./AddSectionForm";
import EmbeddedComponents from "./EmbeddedComponents";
import { modern } from "@/lib/config/themes";

interface WebsiteCustomizerProps {
  businessId: string;
  initialData: Record<string, unknown>;
}

type PageSectionKey = 'landing' | 'about' 
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
  const [isLoading, setIsLoading] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DynamicSection | null>(null);
  const [activeTab, setActiveTab] = useState<string>(
    (initialData.embeddedComponents as boolean) ? 'embedded' : 'landing'
  );

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
      
      toast.success("Website updated");
      
      router.refresh();
    } catch (error) {
      console.error("Error saving website configuration:", error);
      toast.error("There was a problem saving your website configuration.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Allow updates for hero, about, colors, etc.
  const updateSiteConfig = useCallback((sectionKey: Exclude<keyof SiteConfig, 'themeName'>, data: Record<string, unknown>) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      setSiteConfig(prev => {
        const newConfig = { ...prev };
        
        // Type safely handle updates for different sections
        switch (sectionKey) {
          case 'hero':
            newConfig.hero = { ...(newConfig.hero || {}), ...data };
            break;
          case 'about':
            newConfig.about = { ...(newConfig.about || {}), ...data };
            break;
          case 'landing':
             newConfig.landing = { ...(newConfig.landing || {}), ...data };
             break;
          case 'contact':
            newConfig.contact = { ...(newConfig.contact || {}), ...data };
            break;
          case 'colors':
            newConfig.colors = { ...(newConfig.colors || {}), ...data };
            break;

          case 'pages':
            // Ensure data is treated appropriately for the Record<string, PageData> structure
            const pagesUpdate = { ...(newConfig.pages || {}) };
            for (const [pageSlug, pageData] of Object.entries(data)) {
                if (typeof pageData === 'object' && pageData !== null) {
                    // Merge new page data with existing data for that slug
                    pagesUpdate[pageSlug] = { 
                        ...(pagesUpdate[pageSlug] || {}), 
                        ...(pageData as { title?: string; content?: string; imageUrl?: string }) // Type assertion 
                    };
                } else {
                   // Handle cases where data[pageSlug] is not an object, maybe log warning?
                   console.warn(`Invalid data type for page '${pageSlug}' in updateSiteConfig:`, pageData);
                }
            }
            newConfig.pages = pagesUpdate;
            break;
            
          // Add cases for other top-level keys if they exist and need updating
          default:
             // For keys not explicitly handled, maybe log a warning or handle differently
             console.warn(`Unhandled section key in updateSiteConfig: ${sectionKey}`);
             // Example: Direct assignment if it's a simple value (use with caution)
             // if (sectionKey in newConfig) { 
             //    (newConfig as any)[sectionKey] = data[sectionKey] ?? newConfig[sectionKey];
             // }
             break;
        }
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

  const handleTabChange = (value: string) => {
    if (value === 'landing' || value === 'about' || value === 'contact' || value === 'colors' || value === 'themeSettings' || value === 'embedded') {
      setActiveTab(value);
    }
  };

  const handleDeleteSection = async (sectionId: string, page: PageSectionKey) => {
    setIsLoading(true);
    try {
       // --- TEMPORARY CLIENT-SIDE UPDATE (Replace with server action ideally) ---
       setSiteConfig(prev => {
         const pageKey = getPageSectionKey(page);
         const sectionArrayKey = getSectionArrayKey(page);
         
         // Ensure the page config exists and is treated as PageConfig
         const currentPageConfig = (prev[pageKey] as PageConfig | undefined) || {}; 
         // Ensure the section array exists
         const currentSections = (currentPageConfig[sectionArrayKey] as SectionArray | undefined) || []; 
         
         const updatedSections = currentSections.filter((section) => section.id !== sectionId);
         
         return {
           ...prev,
           [pageKey]: {
             ...currentPageConfig,
             [sectionArrayKey]: updatedSections,
           },
         };
       });
       // --- END TEMPORARY ---
       toast.error("Remember to save your changes.");
       // If using server action: await deleteSection(businessId, sectionId); router.refresh();
    } catch (error) { 
        console.error("Error deleting section:", error); 
        toast.error("Could not delete section.");
    } finally { 
        setIsLoading(false); 
    }
  };

  const handleOpenAddSection = (page: PageSectionKey) => {
    setEditingSection(null);
    if (page !== activeTab) {
      setActiveTab(page as string); 
    }
    setIsSectionFormOpen(true);
  };

  const handleOpenEditSection = (section: DynamicSection) => {
    setEditingSection(section);
    setIsSectionFormOpen(true);
  };

  const handleCloseSectionForm = () => {
    setIsSectionFormOpen(false);
    setEditingSection(null);
  };

  const handleAddSection = (sectionData: Omit<DynamicSection, 'id'>) => {
    const newSection: DynamicSection = {
      ...sectionData,
      id: crypto.randomUUID(),
    };

    setSiteConfig(prev => {
      const pageKey = getPageSectionKey(newSection.page as PageSectionKey);
      const sectionArrayKey = getSectionArrayKey(newSection.page as PageSectionKey);
      const currentPageConfig = (prev[pageKey] as PageConfig | undefined) || {};
      const currentSections = (currentPageConfig[sectionArrayKey] as SectionArray | undefined) || [];
      return {
        ...prev,
        [pageKey]: {
          ...currentPageConfig,
          [sectionArrayKey]: [...currentSections, newSection],
        },
      };
    });
    handleCloseSectionForm();
    toast.success("Section Added");
  };

  const handleEditSection = (updatedSectionData: DynamicSection) => {
     setSiteConfig(prev => {
      const pageKey = getPageSectionKey(updatedSectionData.page as PageSectionKey);
      const sectionArrayKey = getSectionArrayKey(updatedSectionData.page as PageSectionKey);
      const currentPageConfig = (prev[pageKey] as PageConfig | undefined) || {};
      const currentSections = (currentPageConfig[sectionArrayKey] as SectionArray | undefined) || [];
      const updatedSections = currentSections.map(section => 
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
    handleCloseSectionForm();
    toast.success("Section Updated");
  };

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
                {section.content?.title ||
                 (section.content && 'text' in section.content && section.content.text) ||
                 (section.content && 'cards' in section.content && `${section.content.cards?.length || 0} Card(s)`) ||
                 'Section Content'}
              </p>
            </div>
            <div className="flex space-x-2">
               <Button variant="outline" size="icon" onClick={() => handleOpenEditSection(section)}>
                 <Edit className="h-4 w-4" />
               </Button>
               <Button variant="destructive" size="icon" onClick={() => handleDeleteSection(section.id, page)} disabled={isLoading}>
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
    <Sheet open={isSectionFormOpen} onOpenChange={setIsSectionFormOpen}>
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
      
        <Tabs defaultValue={initialData.embeddedComponents ? "embedded" : "landing"} className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className={`grid w-full ${initialData.embeddedComponents ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-5'} h-auto border-b rounded-none p-0`}>
            {initialData.embeddedComponents ? (
              <>
                <TabsTrigger
                  value="embedded"
                  className="py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Embedded
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
              </>
            ) : (
              <>
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
              </>
            )}
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

            <TabsContent value="embedded" className="m-0">
              <EmbeddedComponents 
                businessId={businessId}
                embeddedComponents={initialData.embeddedComponents as boolean || false}
                currentDomain={initialData.customDomain as string}
                embedConfig={initialData.embedConfig as any}
                colors={siteConfig.colors}
                theme={siteConfig.themeName?.name || 'modern'}
              />
            </TabsContent>

          </div>
        </Tabs>
    </div>

    <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</SheetTitle>
        <SheetDescription>
           Make changes to the section details here. Click save when you&apos;re done.
        </SheetDescription>
      </SheetHeader>
      <div className="py-4">
          <AddSectionForm 
            key={editingSection?.id || 'new'}
            initialData={editingSection} 
            onAddSection={handleAddSection} 
            onEditSection={handleEditSection} 
            onCancel={handleCloseSectionForm}
            page={editingSection ? editingSection.page as PageSectionKey : (activeTab as PageSectionKey || 'landing')}
            presetColors={{
              primary: siteConfig.colors?.primary,
              secondary: siteConfig.colors?.secondary,
              accent: siteConfig.colors?.accent,
              background: siteConfig.colors?.background
            }}
          />
      </div>
    </SheetContent>
    </Sheet>
  );
} 