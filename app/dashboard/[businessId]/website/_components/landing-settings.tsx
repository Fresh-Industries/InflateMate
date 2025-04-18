'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";

interface HeroSettingsProps {
  hero: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  updateHero: (data: {
    title?: string;
    description?: string;
    imageUrl?: string;
  }) => void;
}

export default function LandingSettings({ hero, updateHero }: HeroSettingsProps) {
  const [title, setTitle] = useState(hero.title || "Welcome to our website");
  const [description, setDescription] = useState(
    hero.description || "We provide high-quality inflatable rentals for all types of events."
  );
  const [imageUrl, setImageUrl] = useState(hero.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    updateHero({ title: value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    updateHero({ description: value });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validate file size
    const file = files[0];
    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image exceeds 4MB limit",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadedFiles = await startUpload([file]);
      if (!uploadedFiles) {
        throw new Error("Failed to upload image");
      }
      
      const url = uploadedFiles[0].url;
      setImageUrl(url);
      updateHero({ imageUrl: url });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl("");
    updateHero({ imageUrl: "" });
  };
  
  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Customize the hero section that appears at the top of your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={title}
                onChange={handleTitleChange}
                placeholder="Welcome to our website"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Hero Description</Label>
              <Textarea
                id="heroDescription"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Describe your business in a few sentences..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Hero Image</Label>
              {imageUrl ? (
                <div className="relative rounded-md overflow-hidden border">
                  <div className="aspect-video relative">
                    <Image
                      src={imageUrl}
                      alt="Hero image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border border-dashed rounded-md p-8 text-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <UploadCloud className="h-12 w-12 text-gray-400" />
                      <p className="text-sm text-muted-foreground">
                        Upload a hero image for your website
                      </p>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="secondary"
                          className="relative"
                        >
                          Select Image
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Recommended size: 1920x1080px. Max file size: 4MB.
              </p>
            </div>
          </div>
        
        </CardContent>
      </Card>
    </div>
  );
} 