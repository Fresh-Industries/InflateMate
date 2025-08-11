"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Autocomplete from "react-google-autocomplete";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X, UploadCloud, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock, DollarSign, Settings, Home, PlusCircle, Save, Info, CreditCard, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useUploadThing } from "@/lib/uploadthing";
import StripeSettingsForm from "./StripeSettingsForm";
import SubscriptionSettings from "./SubscriptionSettings";
import StripeTaxesForm from "./StripeTaxesForm";
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
  minNoticeHours: number;
  maxNoticeHours: number;
  minBookingAmount: number;
  bufferBeforeHours: number;
  bufferAfterHours: number;
  serviceArea?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  embeddedComponents?: boolean;
  [key: string]: unknown;
}

// Simple TikTok icon
const TikTokIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="16" 
    height="16"
    className="text-black"
  >
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.138-.989c-1.35-1.489-1.401-3.34-1.401-3.342h-3.217v14.9c0 .77-.322 1.467-.945 1.961a3.035 3.035 0 0 1-1.864.624 3.071 3.071 0 0 1-2.818-1.875 3.033 3.033 0 0 1 2.893-4.121c.284.001.568.043.842.124v-3.344a6.611 6.611 0 0 0-.842-.052c-1.722 0-3.355.672-4.575 1.891-1.22 1.22-1.89 2.848-1.89 4.574 0 1.722.672 3.354 1.89 4.574 1.219 1.22 2.844 1.89 4.574 1.891h.024a6.587 6.587 0 0 0 4.55-1.891 6.564 6.564 0 0 0 1.89-4.574V8.588a9.58 9.58 0 0 0 5.146 1.5v-3.219c-.366 0-.737-.036-1.103-.108-.45-.087-.901-.235-1.329-.435l-.011-.005c-.406-.186-.803-.418-1.178-.691l-.043-.032-.1-.07Z"/>
  </svg>
);

export default function BusinessSettingsForm({ business }: { business: BusinessSettings }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo || null);
  const [isUploading, setIsUploading] = useState(false);
  const [embeddedComponents, setEmbeddedComponents] = useState<boolean>(business.embeddedComponents || false);

  const { startUpload } = useUploadThing("logoUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic address fields (not autocompleted)
  const [addressData, setAddressData] = useState({
    streetAddress: business.address || "",
    city: business.city || "",
    state: business.state || "",
    zipCode: business.zipCode || "",
  });

  // Service areas
  const [serviceAreas, setServiceAreas] = useState<string[]>(business.serviceArea || []);

  // Social media
  const [socialMedia, setSocialMedia] = useState({
    facebook: business.socialMedia?.facebook || "",
    instagram: business.socialMedia?.instagram || "",
    twitter: business.socialMedia?.twitter || "",
    tiktok: business.socialMedia?.tiktok || ""
  });

  // Add a new service area
  const addServiceArea = (area: string) => {
    const trimmed = area.trim();
    if (trimmed && !serviceAreas.includes(trimmed)) {
      console.log("Adding service area:", trimmed);
      console.log("Current service areas:", serviceAreas);
      setServiceAreas(prevAreas => {
        // Make sure we're using the most up-to-date state
        if (!prevAreas.includes(trimmed)) {
          return [...prevAreas, trimmed];
        }
        return prevAreas;
      });
    }
  };

  // Remove a service area
  const removeServiceArea = (area: string) => {
    setServiceAreas(serviceAreas.filter((a) => a !== area));
  };

  // Fallback manual add (for typed input)
  const serviceAreaInputRef = useRef<HTMLInputElement>(null);
  const handleManualAdd = () => {
    // Get the input from the autocomplete field
    const input = document.querySelector('input[placeholder="Enter a city or area"]') as HTMLInputElement;
    if (input) {
      const val = input.value.trim();
      if (val) {
        addServiceArea(val);
        input.value = "";
      }
    }
  };

  // Social media change
  const handleSocialMediaChange = (platform: keyof typeof socialMedia, value: string) => {
    setSocialMedia({ ...socialMedia, [platform]: value });
  };

  // Logo file select
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Max 2MB
    if (files[0].size > 2 * 1024 * 1024) {
      toast.error("Logo image must be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedFiles = await startUpload(files);
      if (uploadedFiles && uploadedFiles.length > 0) {
        setLogoUrl(uploadedFiles[0].url);
        toast.success("Logo uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove the logo
  const handleRemoveLogo = () => {
    setLogoUrl(null);
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("_method", "PATCH");

      // Add logo
      if (logoUrl) {
        formData.append("logo", logoUrl);
      }

      // Add service areas
      if (serviceAreas.length > 0) {
        serviceAreas.forEach((area, index) => {
          formData.append(`serviceArea[${index}]`, area);
        });
      }

      // Add social media
      formData.append("socialMedia", JSON.stringify(socialMedia));

      // Add address fields
      formData.append("address", addressData.streetAddress);
      formData.append("city", addressData.city);
      formData.append("state", addressData.state);
      formData.append("zipCode", addressData.zipCode);

      // Add embedded components setting
      formData.append("embeddedComponents", embeddedComponents.toString());

      console.log("Form data keys:", [...formData.keys()]);

      const response = await fetch(`/api/businesses/${business.id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Business settings updated");
        router.refresh();
      } else {
        console.error("Failed to update settings");
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Error updating settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
        e.preventDefault();
      }
    }}>
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-between flex-col-reverse lg:flex-row items-center mb-6">
              <TabsList className="grid grid-cols-7 sm:mt-3 w-[560px] sm:w-[760px]">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Locations</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Booking</span>
              </TabsTrigger>
              <TabsTrigger value="stripe" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Stripe</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4" />
              <span>Sub</span>
              </TabsTrigger>
                <TabsTrigger value="taxes" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Taxes</span>
                </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Button 
                type="submit" 
                className="gap-2 w-full lg:w-auto"
                variant="primary-gradient"
                disabled={isLoading || isUploading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>

            
            </div>
          </div>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Business Information</CardTitle>
                <CardDescription>Your business name, logo, and description</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Logo upload section */}
                <div className="space-y-4">
                  <Label className="text-base">Business Logo</Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Existing logo display */}
                    {logoUrl ? (
                      <div className="relative rounded-lg overflow-hidden w-40 h-40 border">
                        <Image 
                          src={logoUrl} 
                          alt="Business logo"
                          fill
                          style={{ objectFit: "cover" }}
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
                      <div className="border rounded-lg p-6 flex flex-col items-center justify-center gap-2 w-40 h-40 bg-gray-50">
                        <Upload className="h-10 w-10 text-gray-400" />
                        <p className="text-xs text-center text-gray-500">
                          No logo uploaded
                        </p>
                      </div>
                    )}
                    
                    {/* Logo upload input */}
                    <div className="flex-1 space-y-2">
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
                                  {logoUrl ? "Change Logo" : "Upload Logo"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Max 2MB • PNG, JPG, WEBP</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Upload a square logo for your business. This will be displayed on your public profile and invoices.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Name & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input id="name" name="name" defaultValue={business.name} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    rows={4}
                    defaultValue={business.description || ""} 
                    placeholder="Describe your business, services, and what makes you special"
                    className="resize-none"
                  />
                </div>

                <Separator />

                {/* Embedded Components Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Embedded Components</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable embeddable widgets that customers can integrate into their websites
                      </p>
                    </div>
                    <Switch
                      checked={embeddedComponents}
                      onCheckedChange={setEmbeddedComponents}
                    />
                  </div>
                  
                  {embeddedComponents && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex gap-2">
                        <div className="text-blue-500 shrink-0">
                          <Info className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-700">Embedded Components Enabled</h4>
                          <p className="text-xs text-blue-600 mt-1">
                            You can now create embeddable widgets in the Website section. 
                            These widgets allow you to embed booking forms, inventory listings, and more into external websites.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* CONTACT TAB */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>How your customers can reach you</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        defaultValue={business.email || ""} 
                        placeholder="email@example.com"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        name="phone" 
                        defaultValue={business.phone || ""} 
                        placeholder="(555) 123-4567"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Social Media */}
                <div className="space-y-4">
                  <Label className="text-base">Social Media</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span>Facebook</span>
                      </Label>
                      <Input 
                        id="facebook" 
                        value={socialMedia.facebook}
                        onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                        placeholder="https://facebook.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        <span>Instagram</span>
                      </Label>
                      <Input 
                        id="instagram" 
                        value={socialMedia.instagram}
                        onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                        placeholder="https://instagram.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <span>Twitter</span>
                      </Label>
                      <Input 
                        id="twitter" 
                        value={socialMedia.twitter}
                        onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                        placeholder="https://twitter.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="flex items-center gap-2">
                        <TikTokIcon />
                        <span>TikTok</span>
                      </Label>
                      <Input 
                        id="tiktok" 
                        value={socialMedia.tiktok}
                        onChange={(e) => handleSocialMediaChange("tiktok", e.target.value)}
                        placeholder="https://tiktok.com/@yourusername"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* LOCATIONS TAB */}
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location & Service Areas</CardTitle>
                <CardDescription>Your business address and the areas you serve</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Main address fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={addressData.streetAddress}
                      onChange={(e) => setAddressData({ ...addressData, streetAddress: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={addressData.state}
                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        value={addressData.zipCode}
                        onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Service Areas */}
                <div className="space-y-4">
                  <Label className="text-base">Service Areas</Label>
                  <p className="text-sm text-muted-foreground">
                    Add cities, towns or regions where your business offers services
                  </p>
                  
                  {/* Existing service areas */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {serviceAreas.length > 0 ? (
                      serviceAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="flex items-center gap-1 py-1">
                          <MapPin className="h-3 w-3" />
                          {area}
                          <button
                            type="button"
                            onClick={() => removeServiceArea(area)}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No service areas added yet
                      </div>
                    )}
                  </div>
                  
                  {/* Autocomplete for service areas */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Autocomplete
                          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                          onPlaceSelected={(place) => {
                            if (place && place.formatted_address) {
                              // Add the area to the list
                              addServiceArea(place.formatted_address);
                              
                              // Clear the input field immediately
                              const input = document.querySelector('input[placeholder="Enter a city or area"]') as HTMLInputElement;
                              if (input) {
                                input.value = '';
                              }
                            }
                          }}
                          options={{
                            types: ["(cities)"],
                            fields: ["formatted_address", "place_id"],
                          }}
                          className="w-full h-full px-3 py-2 border border-input rounded-md"
                          libraries={["places"]}
                          ref={serviceAreaInputRef}
                          placeholder="Enter a city or area"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleManualAdd}
                        className="gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex gap-2">
                      <div className="text-blue-500 shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-700">Pro Tip: City Data Integration</h4>
                        <p className="text-xs text-blue-600 mt-1">
                          For accurate city data, consider integrating Google Places API or another location service. This would provide 
                          validated city names, ZIP codes, and prevent typos in your service area.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOOKING TAB */}
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Booking Settings</CardTitle>
                <CardDescription>Configure booking rules and limitations</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minNoticeHours">Minimum Notice Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="minNoticeHours" 
                        name="minNoticeHours" 
                        type="number" 
                        defaultValue={business.minNoticeHours || 24}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum hours in advance a customer must book
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxNoticeHours">Maximum Notice Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="maxNoticeHours" 
                        name="maxNoticeHours" 
                        type="number" 
                        defaultValue={business.maxNoticeHours || 90}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum days in advance a customer can book
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="minBookingAmount">Minimum Booking Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="minBookingAmount" 
                        name="minBookingAmount" 
                        type="number" 
                        step="0.01"
                        defaultValue={business.minBookingAmount || 0}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum amount in dollars required for a booking
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bufferBeforeHours">Buffer Before Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="bufferBeforeHours" 
                        name="bufferBeforeHours" 
                        type="number" 
                        defaultValue={business.bufferBeforeHours || 0}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Hours before the booking time to start buffer
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bufferAfterHours">Buffer After Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="bufferAfterHours" 
                        name="bufferAfterHours" 
                        type="number" 
                        defaultValue={business.bufferAfterHours || 0}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Hours after the booking time to end buffer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stripe">
          <StripeSettingsForm />
        </TabsContent>
        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
        <TabsContent value="taxes">
          {/* Stripe Connect embedded components: Tax Settings + Registrations */}
          {/* Rendered similarly to Stripe settings, using the same account session */}
          {/* Component will handle onboarding state and errors */}
          {/**/}
          <StripeTaxesForm />
        </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}
