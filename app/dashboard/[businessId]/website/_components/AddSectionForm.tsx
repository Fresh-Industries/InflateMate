'use client';

import React, { useState, useEffect } from 'react';
import { 
  DynamicSection, 
  TextCard
} from '@/lib/business/domain-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { X, PlusCircle, Loader2, Palette } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconPicker } from '@/components/IconPicker';

// Define section types and pages
const sectionTypes = ['Image', 'Video', 'Cards'] as const;
type SectionType = typeof sectionTypes[number];
type PageType = 'landing' | 'about';

// Define a type alias for the content data expected by the parent/backend
type ContentData = DynamicSection['content'];

// Define an interface that includes ALL possible fields from different section types
interface CommonContentFields {
  title?: string;
  text?: string;
  imageUrl?: string;
  imageKey?: string;
  imagePosition?: 'left' | 'right';
  videoUrl?: string;
  videoPosition?: 'left' | 'right';
  cards?: TextCard[];
  // Note: backgroundColor is handled by a separate state
}

interface AddSectionFormProps {
  initialData: DynamicSection | null; // If editing, pass the section data
  onAddSection: (sectionData: Omit<DynamicSection, 'id'>) => void;
  onEditSection: (sectionData: DynamicSection) => void;
  onCancel: () => void;
  businessId?: string; // Make businessId optional
  // Added presetColors prop for color presets
  presetColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  page: PageType;
}

export default function AddSectionForm({ 
  initialData, 
  onAddSection, 
  onEditSection,
  onCancel,
  presetColors,
  page: initialPage
}: AddSectionFormProps) {
  const [sectionType, setSectionType] = useState<SectionType>(initialData?.type || 'Image');
  const [content, setContent] = useState<CommonContentFields>(initialData?.content || {});
  const [backgroundColor, setBackgroundColor] = useState<string>(initialData?.backgroundColor || '#ffffff');
  const page = initialData?.page as PageType || initialPage;


  
  // Restore original loading states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setContent({});
    }
    else if (initialData && initialData.type !== sectionType) {
       setContent(initialData.content || {});
    }
  }, [sectionType, initialData]);

  const handleContentChange = (field: keyof CommonContentFields, value: unknown) => {
    // Update the state, ensuring it conforms to CommonContentFields
    setContent((prev) => ({ ...prev, [field]: value } as CommonContentFields));
  };

  // Specific handler for TextCards
  const handleCardChange = (cardId: string, field: keyof TextCard, value: string) => {
    // Cast prev to CommonContentFields to safely access cards
    setContent((prev) => {
      const updatedCards = (prev.cards || []).map(card => 
        card.id === cardId ? { ...card, [field]: value } : card
      );
      return { ...prev, cards: updatedCards } as CommonContentFields;
    });
  };

  const addCard = () => {
    // Cast prev to CommonContentFields
    setContent((prev) => {
      const newCard: TextCard = {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        icon: '',
        backgroundColor: '#ffffff'
      };
      const updatedCards = [...(prev.cards || []), newCard];
      return { ...prev, cards: updatedCards } as CommonContentFields;
    });
  };

  const removeCard = (cardId: string) => {
    // Cast prev to CommonContentFields
    setContent((prev) => {
      const updatedCards = (prev.cards || []).filter(card => card.id !== cardId);
      return { ...prev, cards: updatedCards } as CommonContentFields;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sectionType === 'Image' && !content.imageUrl) {
      toast.error("Please upload an image.");
      return;
    }
    if (sectionType === 'Video' && !content.videoUrl) {
      toast.error("Please upload a video.");
      return;
    }
    if (sectionType === 'Cards' && (!content.cards || content.cards.length === 0)) {
      toast.error("Please add at least one card.");
      return;
    }

    const finalSectionData: Omit<DynamicSection, 'id'> = {
      type: sectionType as 'Image' | 'Video' | 'Cards',
      page,
      content: content as ContentData, 
      backgroundColor: backgroundColor,
    };

    if (initialData) {
      onEditSection({ 
        ...initialData, 
        type: sectionType as 'Image' | 'Video' | 'Cards',
        page,
        content: content as ContentData, 
        backgroundColor: backgroundColor,
      });
    } else {
      onAddSection(finalSectionData);
    }
  };

  // Render form fields based on selected section type
  const renderContentFields = () => {
    // Directly use 'content' state object, properties are optional
    switch (sectionType) {
      case 'Image':
        const currentImageUrl = content.imageUrl;
        
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="imgText-title">Title (Optional)</Label>
              <Input id="imgText-title" value={content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imgText-content">Text</Label>
              <Textarea id="imgText-content" value={content.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              {currentImageUrl ? (
                <div className="relative group w-fit">
                  <img src={currentImageUrl} alt="Uploaded image" className="max-w-xs rounded border" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 rounded-full h-6 w-6"
                    onClick={() => {
                      handleContentChange('imageUrl', null);
                      handleContentChange('imageKey', null);
                    }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      handleContentChange('imageUrl', res[0].url);
                      handleContentChange('imageKey', res[0].key);
                      toast.success("Image uploaded successfully.");
                    }
                    setIsUploadingImage(false);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                    setIsUploadingImage(false);
                  }}
                  onUploadBegin={() => setIsUploadingImage(true)}
                />
              )}
              {isUploadingImage && <p className="text-sm text-muted-foreground">Uploading image...</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="imgText-position">Image Position</Label>
                <Select 
                    value={content.imagePosition || 'left'}
                    onValueChange={(value: 'left' | 'right') => handleContentChange('imagePosition', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </>
        );
      case 'Video':
        const currentVideoUrl = content.videoUrl;
        
        return (
          <>
             <div className="space-y-2">
              <Label htmlFor="vidText-title">Title (Optional)</Label>
              <Input id="vidText-title" value={content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vidText-content">Text</Label>
              <Textarea id="vidText-content" value={content.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Video</Label>
               {currentVideoUrl ? (
                  <div className="relative group w-fit">
                    <video src={currentVideoUrl} controls className="max-w-xs rounded border" />
                     <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 rounded-full h-6 w-6"
                      onClick={() => {
                        handleContentChange('videoUrl', null);
                      }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
              ) : (
                 <UploadDropzone
                  endpoint="videoUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      handleContentChange('videoUrl', res[0].url);
                      toast.success("Video uploaded successfully.");
                    }
                    setIsUploadingVideo(false);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                    setIsUploadingVideo(false);
                  }}
                  onUploadBegin={() => setIsUploadingVideo(true)}
                />
              )}
              {isUploadingVideo && <p className="text-sm text-muted-foreground">Uploading video...</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="vidText-position">Video Position</Label>
                <Select 
                    value={content.videoPosition || 'left'}
                    onValueChange={(value: 'left' | 'right') => handleContentChange('videoPosition', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </>
        );
      case 'Cards':
        const cards = (content.cards || []) as TextCard[];
        return (
          <>
             <div className="space-y-2">
              <Label htmlFor="cards-title">Section Title (Optional)</Label>
              <Input id="cards-title" value={content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Cards</Label>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-6">
                  {cards.map((card: TextCard) => (
                    <Card key={card.id} className="relative p-4 border border-border shadow-sm overflow-visible">
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                          <Label htmlFor={`card-bg-${card.id}`} className="cursor-pointer p-1.5 rounded hover:bg-muted" title="Change Card Background">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => removeCard(card.id)}
                            aria-label="Remove Card"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                      </div>

                      <div className="flex flex-col space-y-4 pt-6" style={{ backgroundColor: card.backgroundColor || 'transparent' }}>
                        <div className="flex flex-col items-center space-y-2">
                           <Label className="self-start mb-1">Icon</Label>
                           <IconPicker
                              value={card.icon || 'Sparkles'}
                              onChange={(iconName) => handleCardChange(card.id, 'icon', iconName)}
                              className="w-full max-w-xs"
                           />
                           <p className="text-xs text-muted-foreground pt-1">Select an icon</p>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor={`card-title-${card.id}`}>Card Title</Label>
                          <Input id={`card-title-${card.id}`} value={card.title} onChange={(e) => handleCardChange(card.id, 'title', e.target.value)} required />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor={`card-desc-${card.id}`}>Card Description</Label>
                          <Textarea id={`card-desc-${card.id}`} value={card.description} onChange={(e) => handleCardChange(card.id, 'description', e.target.value)} required rows={4} />
                        </div>
                      </div>
                    </Card>
                  ))}
                 </div>
               </ScrollArea>

              <Button type="button" variant="outline" onClick={addCard} className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4"/> Add Card
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Section' : 'Add New Section'}</CardTitle>
        <div className="text-sm text-muted-foreground mt-1 flex items-center">
          <span>Adding to: </span>
          <span className="ml-1.5 font-medium capitalize bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
            {page} page
          </span>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section-type">Section Type</Label>
                <Select
                  value={sectionType}
                  onValueChange={(value: SectionType) => setSectionType(value)}
                  disabled={!!initialData} // Don't allow changing type when editing
                >
                  <SelectTrigger id="section-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Section Background Color</Label>
                <div className="flex items-center gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 p-1 border-0 cursor-pointer"
                    />
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{backgroundColor}</span>
                 </div>
              </div>
           </div>

          <div className="border-t border-border pt-6 mt-6">
             <h3 className="text-lg font-medium mb-4">Content Details</h3>
            {renderContentFields()}
          </div>

          <div className="space-y-3 pt-6 border-t border-border">
             <Label className="text-base font-medium">Section Background Presets</Label>
              <div className="flex flex-wrap gap-3">
                {presetColors?.background && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto text-sm hover:bg-muted"
                    onClick={() => setBackgroundColor(presetColors.background || '#ffffff')}
                    title={`Set background to Background color (${presetColors.background})`}
                  >
                    <div
                      className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300"
                      style={{ backgroundColor: presetColors.background || '#ffffff' }}
                    />
                    <span>Background</span>
                  </Button>
                )}
                 {presetColors?.primary && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto text-sm hover:bg-muted"
                    onClick={() => setBackgroundColor(presetColors.primary || '#3b82f6')}
                    title={`Set background to Primary color (${presetColors.primary})`}
                  >
                     <div style={{ backgroundColor: presetColors.primary || '#3b82f6' }} className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300" />
                     <span>Primary</span>
                  </Button>
                 )}
                 {presetColors?.secondary && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto text-sm hover:bg-muted"
                    onClick={() => setBackgroundColor(presetColors.secondary || '#6b7280')}
                    title={`Set background to Secondary color (${presetColors.secondary})`}
                  >
                    <div style={{ backgroundColor: presetColors.secondary || '#6b7280' }} className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300" />
                    <span>Secondary</span>
                  </Button>
                 )}
                 {presetColors?.accent && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto text-sm hover:bg-muted"
                    onClick={() => setBackgroundColor(presetColors.accent || '#f59e0b')}
                    title={`Set background to Accent color (${presetColors.accent})`}
                  >
                     <div style={{ backgroundColor: presetColors.accent || '#f59e0b' }} className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300" />
                     <span>Accent</span>
                  </Button>
                 )}

              </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isUploadingImage || isUploadingVideo}>Cancel</Button>
          <Button type="submit" disabled={isUploadingImage || isUploadingVideo} variant="primary-gradient">
            {(isUploadingImage || isUploadingVideo) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Add Section'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 