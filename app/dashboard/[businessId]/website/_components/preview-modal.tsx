'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteConfig } from "@/lib/business/domain-utils";
import { Loader2, Monitor, Smartphone, Tablet, ExternalLink } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  siteConfig: SiteConfig;
}

export default function PreviewModal({ isOpen, onClose, businessId }: PreviewModalProps) {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  
  // Set the preview URL when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Use the subdomain format for the preview URL
      setPreviewUrl(`http://${businessId}.localhost:3000`);
      
      // Simulate loading
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, businessId]);
  
  // Get the appropriate width based on the selected device
  const getDeviceWidth = () => {
    switch (activeDevice) {
      case "desktop":
        return "w-full";
      case "tablet":
        return "w-[768px]";
      case "mobile":
        return "w-[375px]";
      default:
        return "w-full";
    }
  };
  
  const handleVisitWebsite = () => {
    window.open(previewUrl, '_blank');
  };
  
  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      );
    }
    
    return (
      <div className={`h-full transition-all duration-300 mx-auto ${getDeviceWidth()}`}>
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title="Website Preview"
        />
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[80vh] max-h-[800px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Website Preview</DialogTitle>
              <DialogDescription>
                Preview how your website will look with the current settings
              </DialogDescription>
            </div>
            
            <Tabs defaultValue="desktop" value={activeDevice} onValueChange={(value: string) => setActiveDevice(value as "desktop" | "tablet" | "mobile")}>
              <TabsList>
                <TabsTrigger value="desktop">
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="tablet">
                  <Tablet className="h-4 w-4 mr-2" />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="mobile">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden border rounded-md bg-background">
          <Tabs value={activeDevice} className="w-full h-full">
            <TabsContent value="desktop" className="w-full h-full flex items-center justify-center">
              {renderPreviewContent()}
            </TabsContent>
            <TabsContent value="tablet" className="w-full h-full flex items-center justify-center">
              {renderPreviewContent()}
            </TabsContent>
            <TabsContent value="mobile" className="w-full h-full flex items-center justify-center">
              {renderPreviewContent()}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            This is a preview of your website. Changes won&apos;t be visible to visitors until you save them.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={handleVisitWebsite}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <Button onClick={onClose}>
              Continue Editing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 