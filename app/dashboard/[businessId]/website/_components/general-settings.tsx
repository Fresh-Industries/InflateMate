'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteConfig } from "@/lib/business/domain-utils";

interface GeneralSettingsProps {
  businessData: any;
  siteConfig: SiteConfig;
  updateSiteConfig: (data: any) => void;
}

export default function GeneralSettings({ businessData, siteConfig, updateSiteConfig }: GeneralSettingsProps) {
  const [aboutTitle, setAboutTitle] = useState(siteConfig.about?.title || "About Us");
  const [aboutDescription, setAboutDescription] = useState(
    siteConfig.about?.description || businessData.description || ""
  );
  const [contactTitle, setContactTitle] = useState(siteConfig.contact?.title || "Contact Us");
  
  const handleAboutTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAboutTitle(value);
    updateSiteConfig({ title: value });
  };
  
  const handleAboutDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAboutDescription(value);
    updateSiteConfig({ description: value });
  };
  
  const handleContactTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactTitle(value);
    updateSiteConfig({ title: value });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Page</CardTitle>
          <CardDescription>
            Customize the content for your About page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">Page Title</Label>
            <Input
              id="aboutTitle"
              value={aboutTitle}
              onChange={handleAboutTitleChange}
              placeholder="About Us"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aboutDescription">Description</Label>
            <Textarea
              id="aboutDescription"
              value={aboutDescription}
              onChange={handleAboutDescriptionChange}
              placeholder="Tell visitors about your business..."
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              This description will be displayed on your About page. You can use basic HTML formatting.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Page</CardTitle>
          <CardDescription>
            Customize the content for your Contact page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactTitle">Page Title</Label>
            <Input
              id="contactTitle"
              value={contactTitle}
              onChange={handleContactTitleChange}
              placeholder="Contact Us"
            />
          </div>
          
          <div className="space-y-2 border p-4 rounded-md bg-muted/50">
            <h3 className="font-medium">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              Your contact information is automatically displayed on your Contact page based on your business profile.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-xs">Phone</Label>
                <p className="text-sm">{businessData.phone || "Not set"}</p>
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <p className="text-sm">{businessData.email || "Not set"}</p>
              </div>
              <div>
                <Label className="text-xs">Address</Label>
                <p className="text-sm">
                  {businessData.address ? (
                    <>
                      {businessData.address}, 
                      {businessData.city && ` ${businessData.city},`} 
                      {businessData.state && ` ${businessData.state}`} 
                      {businessData.zipCode && ` ${businessData.zipCode}`}
                    </>
                  ) : (
                    "Not set"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 