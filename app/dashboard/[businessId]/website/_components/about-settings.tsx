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
  const [aboutDescription, setAboutDescription] = useState(
    siteConfig.about?.description || businessData.description || ""
  );
  
  
  
  const handleAboutDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAboutDescription(value);
    updateSiteConfig({ description: value });
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
            <Label htmlFor="aboutDescription">Description</Label>
            <Textarea
              id="aboutDescription"
              value={aboutDescription}
              onChange={handleAboutDescriptionChange}
              placeholder="Tell visitors about your business..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 