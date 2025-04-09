'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadButton } from "@/lib/uploadthing";

interface ImageFile {
  url: string;
  isPrimary: boolean;
}

interface InventoryFormData {
  name: string;
  description: string;
  dimensions: string;
  capacity: number;
  price: number;
  setupTime: number;
  teardownTime: number;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  minimumSpace: string;
  weightLimit: number;
  ageRange: string;
  weatherRestrictions: string[];
  type: "BOUNCE_HOUSE" | "INFLATABLE" | "GAME" | "OTHER";
  quantity: number;
}

export default function CreateInventoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const businessId = params?.businessId as string;
  const inventoryType = searchParams.get('type') || 'BOUNCE_HOUSE';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    description: '',
    dimensions: '',
    capacity: 1,
    price: 0,
    setupTime: 30,
    teardownTime: 30,
    status: 'AVAILABLE',
    minimumSpace: '',
    weightLimit: 0,
    ageRange: '',
    weatherRestrictions: [],
    type: inventoryType as "BOUNCE_HOUSE" | "INFLATABLE" | "GAME" | "OTHER",
    quantity: 1,
  });

  // Update form type when URL parameter changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: inventoryType as "BOUNCE_HOUSE" | "INFLATABLE" | "GAME" | "OTHER"
    }));
  }, [inventoryType]);

  const setPrimaryImage = (index: number) => {
    const newImages = uploadedImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setUploadedImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    
    // If removing the primary image, set the first remaining image as primary
    if (newImages[index].isPrimary && newImages.length > 1) {
      const nextIndex = index === 0 ? 1 : 0;
      newImages[nextIndex].isPrimary = true;
    }
    
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create inventory item
      const response = await fetch(`/api/businesses/${businessId}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create inventory item');
      }

      toast({
        title: 'Success',
        description: 'Inventory item created successfully',
      });

      router.push(`/dashboard/${businessId}/inventory`);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create inventory item',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'BOUNCE_HOUSE':
        return 'Bounce House';
      case 'INFLATABLE':
        return 'Inflatable';
      case 'GAME':
        return 'Game';
      case 'OTHER':
        return 'Other';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/dashboard/${businessId}/inventory`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create {getTypeDisplayName(formData.type)}</h1>
            <p className="text-muted-foreground">
              Add a new {getTypeDisplayName(formData.type).toLowerCase()} to your inventory
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for this {getTypeDisplayName(formData.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>
                Enter the technical details for this {getTypeDisplayName(formData.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder="e.g. 15ft x 15ft x 10ft"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumSpace">Minimum Space Required</Label>
                <Input
                  id="minimumSpace"
                  name="minimumSpace"
                  value={formData.minimumSpace}
                  onChange={handleInputChange}
                  placeholder="e.g. 20ft x 20ft"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (people)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weightLimit">Weight Limit (lbs)</Label>
                <Input
                  id="weightLimit"
                  name="weightLimit"
                  type="number"
                  min="0"
                  value={formData.weightLimit}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Input
                  id="ageRange"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  placeholder="e.g. 5-12 years"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Setup & Teardown */}
          <Card>
            <CardHeader>
              <CardTitle>Setup & Teardown</CardTitle>
              <CardDescription>
                Enter the setup and teardown details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setupTime">Setup Time (minutes)</Label>
                <Input
                  id="setupTime"
                  name="setupTime"
                  type="number"
                  min="0"
                  value={formData.setupTime}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teardownTime">Teardown Time (minutes)</Label>
                <Input
                  id="teardownTime"
                  name="teardownTime"
                  type="number"
                  min="0"
                  value={formData.teardownTime}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Upload images of this {getTypeDisplayName(formData.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Images</Label>
                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button:{
                      background: 'transparent',
                      color: '#2563eb',
                      borderRadius: '9999px',
                      border: '2px solid #2563eb',
                    }
                  }}
                  onClientUploadComplete={(res) => {
                    // Add the uploaded images to existing images
                    const newImages = res.map((file, index) => ({
                      url: file.url,
                      isPrimary: uploadedImages.length === 0 && index === 0
                    }));
                    setUploadedImages([...uploadedImages, ...newImages]);
                    toast({
                      title: "Upload Complete",
                      description: `Successfully uploaded ${res.length} image${res.length > 1 ? 's' : ''}`
                    });
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: "Upload Error",
                      description: error.message,
                      variant: "destructive"
                    });
                  }}
                />
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Images</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative border rounded-md p-2">
                        <img
                          src={img.url}
                          alt={`Image ${index}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="flex justify-between mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPrimaryImage(index)}
                            disabled={img.isPrimary}
                          >
                            {img.isPrimary ? 'Primary' : 'Set Primary'}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/${businessId}/inventory`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} variant='primary-gradient'>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Item'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 