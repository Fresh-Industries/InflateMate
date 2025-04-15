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
import { useToast } from '@/hooks/use-toast';
import { X, PlusCircle, Loader2 } from 'lucide-react';

// Define section types and pages
const sectionTypes = ['text', 'imageText', 'videoText', 'textCards'] as const;
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
  const { toast } = useToast();
  const [sectionType, setSectionType] = useState<SectionType>(initialData?.type || 'text');
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
      const newCard: TextCard = { id: crypto.randomUUID(), title: '', description: '' };
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
    
    if (sectionType === 'imageText' && !content.imageUrl) {
      toast({ title: "Missing Image", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    if (sectionType === 'videoText' && !content.videoUrl) {
      toast({ title: "Missing Video", description: "Please upload a video.", variant: "destructive" });
      return;
    }
    if (sectionType === 'textCards' && (!content.cards || content.cards.length === 0)) {
      toast({ title: "Missing Cards", description: "Please add at least one card.", variant: "destructive" });
      return;
    }

    const finalSectionData: Omit<DynamicSection, 'id'> = {
      type: sectionType,
      page,
      content: content as ContentData, 
      backgroundColor: backgroundColor,
    };

    if (initialData) {
      onEditSection({ 
        ...initialData, 
        type: sectionType, 
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
      case 'text':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="text-title">Title (Optional)</Label>
              <Input id="text-title" value={content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-content">Text</Label>
              <Textarea id="text-content" value={content.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} required />
            </div>
          </>
        );
      case 'imageText':
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
                      toast({ title: "Upload Complete", description: "Image uploaded successfully." });
                    }
                    setIsUploadingImage(false);
                  }}
                  onUploadError={(error: Error) => {
                    toast({ title: "Upload Error", description: error.message, variant: "destructive" });
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
      case 'videoText':
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
                      toast({ title: "Upload Complete", description: "Video uploaded successfully." });
                    }
                    setIsUploadingVideo(false);
                  }}
                  onUploadError={(error: Error) => {
                    toast({ title: "Upload Error", description: error.message, variant: "destructive" });
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
      case 'textCards':
        const cards = (content.cards || []) as TextCard[];
        return (
          <>
             <div className="space-y-2">
              <Label htmlFor="cards-title">Section Title (Optional)</Label>
              <Input id="cards-title" value={content.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
            </div>
            <div className="space-y-4">
              <Label>Cards</Label>
              {cards.map((card: TextCard) => (
                <Card key={card.id} className="relative p-4 pt-8">
                   <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 text-destructive hover:bg-destructive/10"
                    onClick={() => removeCard(card.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="space-y-2 mb-2">
                    <Label htmlFor={`card-title-${card.id}`}>Card Title</Label>
                    <Input id={`card-title-${card.id}`} value={card.title} onChange={(e) => handleCardChange(card.id, 'title', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`card-desc-${card.id}`}>Card Description</Label>
                    <Textarea id={`card-desc-${card.id}`} value={card.description} onChange={(e) => handleCardChange(card.id, 'description', e.target.value)} required />
                  </div>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addCard}><PlusCircle className="mr-2 h-4 w-4"/> Add Card</Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Section' : 'Add New Section'}</CardTitle>
        <div className="text-sm text-muted-foreground mt-1 flex items-center">
          <span>Adding to: </span>
          <span className="ml-1 font-medium capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
            {page} page
          </span>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
         
          {/* Render dynamic fields based on type */} 
          {renderContentFields()}
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input 
              id="backgroundColor"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-10 p-1"
            />
          </div>
      
            <div className="space-y-2">
              <Label>Color Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presetColors?.background && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto"
                    onClick={() => setBackgroundColor(presetColors.background || '#ffffff')}
                  >
                    <div 
                      className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300"
                      style={{ backgroundColor: presetColors.background || '#ffffff' }}
                    />
                    <span className="text-sm">Background</span> 
                  </Button>
                )}
                
                {presetColors?.primary && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto"
                    onClick={() => setBackgroundColor(presetColors.primary || '#3b82f6')}
                  >
                    <div 
                      className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300"
                      style={{ backgroundColor: presetColors.primary || '#3b82f6' }}
                    />
                    <span className="text-sm">Primary</span> 
                  </Button>
                )}
                
                {presetColors?.secondary && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto"
                    onClick={() => setBackgroundColor(presetColors.secondary || '#6b7280')}
                  >
                    <div 
                      className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300"
                      style={{ backgroundColor: presetColors.secondary || '#6b7280' }}
                    />
                    <span className="text-sm">Secondary</span> 
                  </Button>
                )}
                
                {presetColors?.accent && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-start gap-2 p-2 h-auto"
                    onClick={() => setBackgroundColor(presetColors.accent || '#f59e0b')}
                  >
                    <div 
                      className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300"
                      style={{ backgroundColor: presetColors.accent || '#f59e0b' }}
                    />
                    <span className="text-sm">Accent</span> 
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-start gap-2 p-2 h-auto"
                  onClick={() => setBackgroundColor('#ffffff')}
                >
                  <div 
                    className="w-5 h-5 rounded-full ring-1 ring-offset-1 ring-gray-300"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                  <span className="text-sm">White</span> 
                </Button>
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isUploadingImage || isUploadingVideo}>Cancel</Button>
          <Button type="submit" disabled={isUploadingImage || isUploadingVideo}>
            {(isUploadingImage || isUploadingVideo) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Add Section'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 