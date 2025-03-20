'use client';

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";

interface ContactSettingsProps {
  businessData: Record<string, any>;
}

export default function ContactSettings({ businessData }: ContactSettingsProps) {

  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Page</CardTitle>
          <CardDescription>
            Customize the content for your Contact page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">      
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
            
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/${businessData.id}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Contact Information
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 