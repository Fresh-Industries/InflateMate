'use client';

import React, { useState, useCallback } from 'react';
import { BusinessWithSiteConfig, SiteConfig, DynamicSection } from '@/lib/business/domain-utils';
import { Button } from '@/components/ui/button';
import AddSectionForm from './AddSectionForm';
import SectionList from './SectionList';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createId } from '@paralleldrive/cuid2';

interface SectionEditorProps {
  business: BusinessWithSiteConfig;
}

export default function SectionEditor({ business }: SectionEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(business.siteConfig || {});
  const [isAdding, setIsAdding] = useState(false);
  const [editingSection, setEditingSection] = useState<DynamicSection | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sections = [...(siteConfig.landing?.sections || []), ...(siteConfig.about?.dynamicSections || [])];

  // Update Site Config and trigger API call
  const updateAndSaveSiteConfig = useCallback(async (newConfig: SiteConfig) => {
    setIsLoading(true);
    setSiteConfig(newConfig);
    
    try {
      const response = await fetch(`/api/businesses/${business.id}/website`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteConfig: newConfig }),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      toast({ title: "Success", description: "Website sections updated." });
      router.refresh(); // Refresh server data
    } catch (error) {
      console.error("Error saving site config:", error);
      toast({ title: "Error", description: "Could not save changes.", variant: "destructive" });
      // Consider reverting state or notifying user
    } finally {
      setIsLoading(false);
    }
  }, [business.id, router, toast]);

  const handleAddSection = (newSectionData: Omit<DynamicSection, 'id'>) => {
    const newSection: DynamicSection = {
      ...newSectionData,
      id: createId(), // Generate unique ID with cuid2
    };
    const updatedSections = [...sections, newSection];
    updateAndSaveSiteConfig({ ...siteConfig, landing: { sections: updatedSections }, about: { dynamicSections: updatedSections } });
    setIsAdding(false); // Close the add form
  };

  const handleEditSection = (updatedSection: DynamicSection) => {
    const updatedSections = sections.map(s => 
      s.id === updatedSection.id ? updatedSection : s
    );
    updateAndSaveSiteConfig({ ...siteConfig, landing: { sections: updatedSections }, about: { dynamicSections: updatedSections } });
    setEditingSection(null); // Close the edit form/modal
  };

  const handleDeleteSection = async (sectionId: string) => {
    const sectionToDelete = sections.find(s => s.id === sectionId);
    const updatedSections = sections.filter(s => s.id !== sectionId);
    
    // Optimistically update UI
    setSiteConfig({ ...siteConfig, landing: { sections: updatedSections } });
    
    // If it's an image section with a key, delete the image from UploadThing
    if (sectionToDelete?.type === 'Image' && 'imageKey' in sectionToDelete.content && sectionToDelete.content.imageKey) {
      try {
        toast({ title: "Image Deleted", description: "Associated image removed from storage." });
      } catch (error) {
        console.error("Failed to delete UploadThing file:", error);
        toast({ title: "Warning", description: "Could not delete associated image from storage.", variant: "destructive" });
        // Optional: Revert UI update or inform user more strongly
      }
    }
    
    // Save the updated sections list
    await updateAndSaveSiteConfig({ ...siteConfig, landing: { sections: updatedSections }, about: { dynamicSections: updatedSections } });
  };

  return (
    <div className="space-y-6">
      <SectionList 
        sections={sections}
        onDeleteSection={handleDeleteSection}
        onEditSection={(section) => {
          setEditingSection(section);
          setIsAdding(true); // Reuse the form for editing
        }}
      />

      {isAdding || editingSection ? (
        <AddSectionForm
          page="landing"
          initialData={editingSection} // Pass section data if editing
          onAddSection={handleAddSection}
          onEditSection={handleEditSection} // Pass edit handler
          onCancel={() => {
             setIsAdding(false);
             setEditingSection(null);
          }}
          presetColors={business.siteConfig?.colors}
          
        />
      ) : (
        <Button onClick={() => setIsAdding(true)} disabled={isLoading}>
          Add New Section
        </Button>
      )}
      {/* We can add loading indicators based on `isLoading` state */} 
    </div>
  );
} 