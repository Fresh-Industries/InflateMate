'use client';

import React from 'react';
import { BusinessWithSiteConfig, SiteConfig, DynamicSection } from '@/lib/business/domain-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface SectionListProps {
  businessId: string;
  sections: DynamicSection[];
  onDeleteSection: (sectionId: string) => void;
  onEditSection: (section: DynamicSection) => void; // To trigger editing
  // Add onReorderSection later if needed
}

export default function SectionList({ 
  businessId, 
  sections, 
  onDeleteSection, 
  onEditSection 
}: SectionListProps) {
  const handleDelete = (sectionId: string) => {
    // Confirmation dialog might be good here
    onDeleteSection(sectionId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Sections</CardTitle>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <p className="text-muted-foreground">No sections added yet.</p>
        ) : (
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <p className="font-semibold capitalize">{section.type.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm text-muted-foreground">Page: {section.page}</p>
                  {/* Optionally show a preview of content */} 
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEditSection(section)}>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {/* Add reorder buttons later */} 
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 