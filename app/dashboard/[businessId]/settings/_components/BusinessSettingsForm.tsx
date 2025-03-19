'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { Loader2, Upload, X, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessSettings {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  logo?: string | null;
  minAdvanceBooking: number;
  maxAdvanceBooking: number;
  minimumPurchase: number;
  [key: string]: unknown;
}

export default function BusinessSettingsForm({ business }: { business: BusinessSettings }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo || null);
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("logoUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('_method', 'PATCH');
      
      // Add the logo URL to form data if it exists
      if (logoUrl) {
        formData.append('logo', logoUrl);
        console.log('Adding logo URL to form data:', logoUrl);
      } else {
        console.log('No logo URL to add to form data');
      }
      
      // Log the keys in the formData
      console.log('Form data keys:', [...formData.keys()]);
      
      const response = await fetch(`/api/businesses/${business.id}`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setSuccessMessage('Settings saved successfully!');
        toast({
          title: "Success",
          description: "Business settings updated",
          variant: "default",
        });
        router.refresh();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        console.error('Failed to update settings');
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Error updating settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveLogo = () => {
    setLogoUrl(null);
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Validate file size (max 2MB)
    if (files[0].size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Logo image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadedFiles = await startUpload(files);
      if (uploadedFiles && uploadedFiles.length > 0) {
        setLogoUrl(uploadedFiles[0].url);
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your business details and settings
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Logo upload section */}
          <div className="space-y-4">
            <Label>Business Logo</Label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {logoUrl ? (
                <div className="relative rounded-md overflow-hidden w-40 h-40 border">
                  <Image 
                    src={logoUrl} 
                    alt="Business logo"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="160px"
                  />
                  <button 
                    type="button" 
                    onClick={handleRemoveLogo}
                    className="absolute top-2 right-2 bg-red-100 p-1 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                    aria-label="Remove logo"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="border rounded-md p-6 flex flex-col items-center justify-center gap-2 w-40 h-40 bg-gray-50">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="text-xs text-center text-gray-500">
                    No logo uploaded
                  </p>
                </div>
              )}
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col gap-2">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer relative group border-gray-300 hover:border-primary transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-primary" />
                      <div>
                        {isUploading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p className="text-sm font-medium">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium">
                              {logoUrl ? 'Change Logo' : 'Upload Logo'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Max 2MB • PNG, JPG, WEBP</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a square logo for your business. This will be displayed on your public profile and invoices.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input id="name" name="name" defaultValue={business.name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input id="email" name="email" type="email" defaultValue={business.email || ''} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Business Phone</Label>
              <Input id="phone" name="phone" defaultValue={business.phone || ''} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimumPurchase">Minimum Purchase Amount ($)</Label>
              <Input 
                id="minimumPurchase" 
                name="minimumPurchase" 
                type="number" 
                step="0.01"
                defaultValue={business.minimumPurchase || 0} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={4}
              defaultValue={business.description || ''} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={business.address || ''} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={business.city || ''} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" defaultValue={business.state || ''} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" name="zipCode" defaultValue={business.zipCode || ''} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minAdvanceBooking">Minimum Advance Booking (hours)</Label>
              <Input 
                id="minAdvanceBooking" 
                name="minAdvanceBooking" 
                type="number" 
                defaultValue={business.minAdvanceBooking || 24} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxAdvanceBooking">Maximum Advance Booking (days)</Label>
              <Input 
                id="maxAdvanceBooking" 
                name="maxAdvanceBooking" 
                type="number" 
                defaultValue={business.maxAdvanceBooking || 90} 
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          
          {successMessage && (
            <div className="text-sm font-medium text-green-600">
              {successMessage}
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
} 