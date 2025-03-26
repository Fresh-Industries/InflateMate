'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { 
  Loader2, Upload, X, UploadCloud, 
  Facebook, Instagram, Twitter, 
  Mail, Phone, MapPin, Clock, DollarSign, 
  Settings, Home, PlusCircle, Save, Search, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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
  serviceArea?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  [key: string]: unknown;
}

// Create a custom TikTok icon component
const TikTokIcon = () => {
  return (
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
};

export default function BusinessSettingsForm({ business }: { business: BusinessSettings }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo || null);
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("logoUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Service area state
  const [serviceAreas, setServiceAreas] = useState<string[]>(business.serviceArea || []);
  const [newServiceArea, setNewServiceArea] = useState('');
  
  // Social media state
  const [socialMedia, setSocialMedia] = useState({
    facebook: business.socialMedia?.facebook || '',
    instagram: business.socialMedia?.instagram || '',
    twitter: business.socialMedia?.twitter || '',
    tiktok: business.socialMedia?.tiktok || ''
  });
  
  // Add state for search results
  const [citySearchResults, setCitySearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
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
      }
      
      // Add service areas to form data
      if (serviceAreas.length > 0) {
        serviceAreas.forEach((area, index) => {
          formData.append(`serviceArea[${index}]`, area);
        });
      }
      
      // Add social media to form data
      const socialMediaData = JSON.stringify(socialMedia);
      formData.append('socialMedia', socialMediaData);
      
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
  
  const addServiceArea = () => {
    if (newServiceArea.trim() && !serviceAreas.includes(newServiceArea.trim())) {
      setServiceAreas([...serviceAreas, newServiceArea.trim()]);
      setNewServiceArea('');
    }
  };
  
  const removeServiceArea = (area: string) => {
    setServiceAreas(serviceAreas.filter(a => a !== area));
  };
  
  const handleSocialMediaChange = (platform: keyof typeof socialMedia, value: string) => {
    setSocialMedia({ ...socialMedia, [platform]: value });
  };
  
  // Add this function to handle city search
  const handleCitySearch = async (query: string) => {
    setNewServiceArea(query);
    
    if (query.length < 2) {
      setCitySearchResults([]);
      return;
    }
    
    // In a real implementation, you would call an API here
    // For now, we'll simulate results with some sample data
    setIsSearching(true);
    
    try {
      // This is where you would call your API
      // const response = await fetch(`/api/city-search?query=${encodeURIComponent(query)}`);
      // const data = await response.json();
      // setCitySearchResults(data.results);
      
      // Simulated results for demonstration
      setTimeout(() => {
        const sampleCities = [
          "New York, NY",
          "Los Angeles, CA",
          "Chicago, IL",
          "Houston, TX",
          "Phoenix, AZ",
          "Philadelphia, PA",
          "San Antonio, TX",
          "San Diego, CA",
          "Dallas, TX",
          "San Jose, CA"
        ];
        
        const filteredCities = sampleCities.filter(city => 
          city.toLowerCase().includes(query.toLowerCase())
        );
        
        setCitySearchResults(filteredCities);
        setIsSearching(false);
      }, 300);
    } catch (error) {
      console.error('Error searching for cities:', error);
      setIsSearching(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-4 w-[500px]">
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
            </TabsList>
            
            <div className="flex items-center gap-4">
              <Button 
                type="submit" 
                className="gap-2"
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
              
              {successMessage && (
                <Badge variant="success" className="text-sm py-1 px-3">
                  {successMessage}
                </Badge>
              )}
            </div>
          </div>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Business Information</CardTitle>
                <CardDescription>
                  Your business name, logo, and description
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Logo upload section */}
                <div className="space-y-4">
                  <Label className="text-base">Business Logo</Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {logoUrl ? (
                      <div className="relative rounded-lg overflow-hidden w-40 h-40 border">
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
                      <div className="border rounded-lg p-6 flex flex-col items-center justify-center gap-2 w-40 h-40 bg-gray-50">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    rows={4}
                    defaultValue={business.description || ''} 
                    placeholder="Describe your business, services, and what makes you special"
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>
                  How your customers can reach you
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        defaultValue={business.email || ''} 
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
                        defaultValue={business.phone || ''} 
                        placeholder="(555) 123-4567"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
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
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
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
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
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
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
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
                        onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                        placeholder="https://tiktok.com/@yourusername"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location & Service Areas</CardTitle>
                <CardDescription>
                  Your business address and the areas you serve
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
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
                
                <Separator />
                
                <div className="space-y-4">
                  <Label className="text-base">Service Areas</Label>
                  <p className="text-sm text-muted-foreground">
                    Add cities, towns or regions where your business offers services
                  </p>
                  
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
                  
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          value={newServiceArea}
                          onChange={(e) => handleCitySearch(e.target.value)}
                          placeholder="Search for a city or town"
                          className="pl-9"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newServiceArea.trim()) {
                                addServiceArea();
                                setCitySearchResults([]);
                              }
                            }
                          }}
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-2.5">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          addServiceArea();
                          setCitySearchResults([]);
                        }}
                        className="gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    
                    {citySearchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-md border border-gray-200 shadow-lg max-h-60 overflow-auto">
                        <ul className="py-1">
                          {citySearchResults.map((city, index) => (
                            <li 
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setNewServiceArea(city);
                                setCitySearchResults([]);
                                // Add after a small delay to allow the input to update
                                setTimeout(() => addServiceArea(), 10);
                              }}
                            >
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {city}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
          
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Booking Settings</CardTitle>
                <CardDescription>
                  Configure booking rules and limitations
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minAdvanceBooking">Minimum Advance Booking</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="minAdvanceBooking" 
                        name="minAdvanceBooking" 
                        type="number" 
                        defaultValue={business.minAdvanceBooking || 24}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum hours in advance a customer must book
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAdvanceBooking">Maximum Advance Booking</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="maxAdvanceBooking" 
                        name="maxAdvanceBooking" 
                        type="number" 
                        defaultValue={business.maxAdvanceBooking || 90}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum days in advance a customer can book
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="minimumPurchase">Minimum Purchase Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="minimumPurchase" 
                        name="minimumPurchase" 
                        type="number" 
                        step="0.01"
                        defaultValue={business.minimumPurchase || 0}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum amount in dollars required for a booking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
} 