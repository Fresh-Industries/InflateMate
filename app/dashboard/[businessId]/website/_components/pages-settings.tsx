'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, Edit, FileText, Link as LinkIcon, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";

interface PagesSettingsProps {
  pages: Record<string, {
    title?: string;
    content?: string;
    imageUrl?: string;
  }>;
  updatePages: (pages: Record<string, {
    title?: string;
    content?: string;
    imageUrl?: string;
  }>) => void;
}

export default function PagesSettings({ pages, updatePages }: PagesSettingsProps) {
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  
  // Form state for new/edit page
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  
  // Reset form state
  const resetForm = () => {
    setSlug("");
    setTitle("");
    setContent("");
    setImageUrl("");
    setCurrentPage(null);
  };
  
  // Open add page dialog
  const handleAddPage = () => {
    resetForm();
    setIsAddPageOpen(true);
  };
  
  // Open edit page dialog
  const handleEditPage = (pageSlug: string) => {
    const page = pages[pageSlug];
    setCurrentPage(pageSlug);
    setSlug(pageSlug);
    setTitle(page.title || "");
    setContent(page.content || "");
    setImageUrl(page.imageUrl || "");
    setIsEditPageOpen(true);
  };
  
  // Handle image upload
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
  
  // Handle remove image
  const handleRemoveImage = () => {
    setImageUrl("");
  };
  
  // Save new page
  const handleSaveNewPage = () => {
    if (!slug || !title) return;
    
    const newPages = {
      ...pages,
      [slug]: {
        title,
        content,
        imageUrl,
      },
    };
    
    updatePages(newPages);
    setIsAddPageOpen(false);
    resetForm();
  };
  
  // Update existing page
  const handleUpdatePage = () => {
    if (!currentPage || !title) return;
    
    const newPages = {
      ...pages,
    };
    
    newPages[currentPage] = {
      title,
      content,
      imageUrl,
    };
    
    updatePages(newPages);
    setIsEditPageOpen(false);
    resetForm();
  };
  
  // Delete page
  const handleDeletePage = (pageSlug: string) => {
    const newPages = { ...pages };
    delete newPages[pageSlug];
    updatePages(newPages);
    
    if (isEditPageOpen && currentPage === pageSlug) {
      setIsEditPageOpen(false);
      resetForm();
    }
  };
  
  // Format slug from title
  const formatSlug = (input: string) => {
    return input
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };
  
  // Replace the UploadButton in the Add Page Dialog
  const renderImageUploader = () => {
    if (imageUrl) {
      return (
        <div className="relative rounded-md overflow-hidden border">
          <div className="aspect-video relative">
            <Image
              src={imageUrl}
              alt="Page image"
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
      );
    }
    
    return (
      <div className="border border-dashed rounded-md p-6 text-center">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload an image for this page
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
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Custom Pages</CardTitle>
            <CardDescription>
              Create and manage custom pages for your website
            </CardDescription>
          </div>
          <Button onClick={handleAddPage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </CardHeader>
        <CardContent>
          {Object.keys(pages).length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 font-medium">No custom pages yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create custom pages to add more content to your website.
              </p>
              <Button className="mt-4" onClick={handleAddPage}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pages).map(([pageSlug, page]) => (
                <Card key={pageSlug} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    {page.imageUrl ? (
                      <Image
                        src={page.imageUrl}
                        alt={page.title || pageSlug}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{page.title || pageSlug}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      <span className="truncate">/{pageSlug}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEditPage(pageSlug)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePage(pageSlug)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Page Dialog */}
      <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
            <DialogDescription>
              Create a new custom page for your website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pageTitle" className="text-right">
                Page Title
              </Label>
              <Input
                id="pageTitle"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) {
                    setSlug(formatSlug(e.target.value));
                  }
                }}
                placeholder="e.g. Our Services"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pageSlug" className="text-right">
                URL Slug
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="text-muted-foreground mr-1">/</span>
                <Input
                  id="pageSlug"
                  value={slug}
                  onChange={(e) => setSlug(formatSlug(e.target.value))}
                  placeholder="e.g. our-services"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="pageContent" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="pageContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Page content..."
                className="col-span-3"
                rows={8}
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Image
              </Label>
              <div className="col-span-3">
                {renderImageUploader()}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewPage} disabled={!slug || !title}>
              Save Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Page Dialog */}
      <Dialog open={isEditPageOpen} onOpenChange={setIsEditPageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Update your custom page content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editPageTitle" className="text-right">
                Page Title
              </Label>
              <Input
                id="editPageTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Our Services"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editPageSlug" className="text-right">
                URL Slug
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="text-muted-foreground mr-1">/</span>
                <Input
                  id="editPageSlug"
                  value={slug}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="editPageContent" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="editPageContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Page content..."
                className="col-span-3"
                rows={8}
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Image
              </Label>
              <div className="col-span-3">
                {renderImageUploader()}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (currentPage) {
                  handleDeletePage(currentPage);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Page
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditPageOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePage} disabled={!title}>
                Update Page
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 