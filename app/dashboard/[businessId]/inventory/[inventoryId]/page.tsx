'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Trash2, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UploadButton } from "@/lib/uploadthing";

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface InventoryItem {
  id: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  type: "BOUNCE_HOUSE" | "INFLATABLE" | "GAME" | "OTHER";
  name: string;
  description?: string;
  dimensions: string;
  minimumSpace: string;
  capacity: number;
  weightLimit: number;
  ageRange: string;
  price: number;
  setupTime: number;
  teardownTime: number;
  images: string[];
  primaryImage?: string;
  weatherRestrictions: string[];
  quantity: number;
}

export default function EditInventoryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const businessId = params?.businessId as string;
  const inventoryId = params?.inventoryId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; isPrimary: boolean }[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch inventory item data
  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/businesses/${businessId}/inventory/${inventoryId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch inventory item');
        }
        
        const data = await response.json();
        setInventoryItem(data);
        
        // Transform existing images
        const uniqueUrls = new Set();
        const images = data.images
          .filter(url => {
            // Filter out duplicate URLs
            if (uniqueUrls.has(url)) {
              return false;
            }
            uniqueUrls.add(url);
            return true;
          })
          .map(url => ({
            url,
            isPrimary: url === data.primaryImage
          }));
        
        // Ensure we have exactly one primary image if there are any images
        if (images.length > 0 && !images.some(img => img.isPrimary)) {
          images[0].isPrimary = true;
        }
        
        setExistingImages(images);
      } catch (error) {
        console.error('Error fetching inventory item:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch inventory item',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId && inventoryId) {
      fetchInventoryItem();
    }
  }, [businessId, inventoryId, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const newImageFiles: ImageFile[] = [];

    for (const file of newFiles) {
      // Create a preview URL for the file
      const preview = URL.createObjectURL(file);
      newImageFiles.push({
        file,
        preview,
        isPrimary: selectedImages.length === 0 && newImageFiles.length === 0 && existingImages.length === 0,
      });
    }

    setSelectedImages([...selectedImages, ...newImageFiles]);
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      // Create a deep copy of existing images to avoid reference issues
      const newExistingImages = [...existingImages];
      const imageToRemove = newExistingImages[index];
      
      // If removing the primary image, set the first remaining image as primary
      if (imageToRemove.isPrimary) {
        // Create a copy of existing images without the one being removed
        const remainingExistingImages = newExistingImages.filter((_, i) => i !== index);
        
        if (remainingExistingImages.length > 0) {
          // Set the first remaining existing image as primary
          remainingExistingImages[0].isPrimary = true;
        } else if (selectedImages.length > 0) {
          // If no existing images left, set the first selected image as primary
          const newSelectedImages = [...selectedImages];
          newSelectedImages[0].isPrimary = true;
          setSelectedImages(newSelectedImages);
        }
      }
      
      // Remove the image from existing images
      newExistingImages.splice(index, 1);
      
      // Update state with the new array (not a reference to the old one)
      setExistingImages([...newExistingImages]);
    } else {
      const newSelectedImages = [...selectedImages];
      
      // If removing the primary image, set the first remaining image as primary
      if (newSelectedImages[index].isPrimary) {
        // Create a copy of selected images without the one being removed
        const remainingSelectedImages = newSelectedImages.filter((_, i) => i !== index);
        
        if (remainingSelectedImages.length > 0) {
          // Set the first remaining selected image as primary
          remainingSelectedImages[0].isPrimary = true;
        } else if (existingImages.length > 0) {
          // If no selected images left, set the first existing image as primary
          const newExistingImages = [...existingImages];
          newExistingImages[0].isPrimary = true;
          setExistingImages([...newExistingImages]);
        }
      }
      
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(newSelectedImages[index].preview);
      newSelectedImages.splice(index, 1);
      setSelectedImages([...newSelectedImages]);
    }
  };

  const setPrimaryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newExistingImages = existingImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      
      const newSelectedImages = selectedImages.map(img => ({
        ...img,
        isPrimary: false,
      }));
      
      setExistingImages(newExistingImages);
      setSelectedImages(newSelectedImages);
    } else {
      const newSelectedImages = selectedImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      
      const newExistingImages = existingImages.map(img => ({
        ...img,
        isPrimary: false,
      }));
      
      setSelectedImages(newSelectedImages);
      setExistingImages(newExistingImages);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!inventoryItem) return;
    
    const { name, value } = e.target;
    setInventoryItem({
      ...inventoryItem,
      [name]: value,
    });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!inventoryItem) return;
    
    const { name, value } = e.target;
    setInventoryItem({
      ...inventoryItem,
      [name]: Number(value),
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!inventoryItem) return;
    
    setInventoryItem({
      ...inventoryItem,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryItem) return;
    
    setIsSubmitting(true);
    
    try {
      // Get URLs of existing images that were removed
      const originalImageUrls = inventoryItem.images || [];
      const currentImageUrls = existingImages.map(img => img.url);
      const removedImageUrls = originalImageUrls.filter(url => !currentImageUrls.includes(url));
      
      // Only include existing images in the update
      // New images will be uploaded separately via UploadThing
      const allImages = existingImages.map(img => ({
        url: img.url,
        isPrimary: img.isPrimary
      }));
      
      // Ensure only one image is marked as primary
      const primaryImageCount = allImages.filter(img => img.isPrimary).length;
      
      if (primaryImageCount > 1) {
        // If multiple primary images, keep only the first one as primary
        let foundPrimary = false;
        allImages.forEach(img => {
          if (img.isPrimary) {
            if (foundPrimary) {
              img.isPrimary = false;
            } else {
              foundPrimary = true;
            }
          }
        });
      } else if (primaryImageCount === 0 && allImages.length > 0) {
        // If no primary image but we have images, set the first one as primary
        allImages[0].isPrimary = true;
      }
      
      // Find the primary image
      const primaryImage = allImages.find(img => img.isPrimary);
      
      const response = await fetch(`/api/businesses/${businessId}/inventory/${inventoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inventoryItem,
          images: allImages,
          removedImages: removedImageUrls, // Send removed image URLs to be deleted from UploadThing
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update inventory item');
      }
      
      toast({
        title: 'Success',
        description: 'Inventory item updated successfully',
      });
      
      router.push(`/dashboard/${businessId}/inventory`);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update inventory item',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/businesses/${businessId}/inventory/${inventoryId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete inventory item');
      }
      
      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully',
      });
      
      router.push(`/dashboard/${businessId}/inventory`);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete inventory item',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!inventoryItem) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Inventory Item Not Found</h2>
        <p className="text-muted-foreground mb-4">The inventory item you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => router.push(`/dashboard/${businessId}/inventory`)}>
          Back to Inventory
        </Button>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">
              Edit {getTypeDisplayName(inventoryItem.type)}
            </h1>
            <p className="text-muted-foreground">
              Update details for {inventoryItem.name}
            </p>
          </div>
        </div>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Item
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the inventory item
                and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Edit the basic details for this {getTypeDisplayName(inventoryItem.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={inventoryItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={inventoryItem.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={inventoryItem.status}
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
                  value={inventoryItem.price}
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
                  value={inventoryItem.quantity || 1}
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
                Update the technical details for this {getTypeDisplayName(inventoryItem.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={inventoryItem.dimensions}
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
                  value={inventoryItem.minimumSpace}
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
                  value={inventoryItem.capacity}
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
                  value={inventoryItem.weightLimit}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Input
                  id="ageRange"
                  name="ageRange"
                  value={inventoryItem.ageRange}
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
                Update the setup and teardown details
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
                  value={inventoryItem.setupTime}
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
                  value={inventoryItem.teardownTime}
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
                Update images of this {getTypeDisplayName(inventoryItem.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload New Images</Label>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Add the uploaded images to existing images
                    const newImages = res.map((file, index) => {
                      // Set as primary only if there are no existing primary images
                      const isPrimary = existingImages.length === 0 && 
                                        !existingImages.some(img => img.isPrimary) && 
                                        index === 0;
                      
                      return {
                        url: file.url,
                        isPrimary
                      };
                    });
                    
                    // If we're setting a new primary image, update existing images to not be primary
                    if (newImages.some(img => img.isPrimary)) {
                      setExistingImages(existingImages.map(img => ({
                        ...img,
                        isPrimary: false
                      })));
                    }
                    
                    setExistingImages([...existingImages, ...newImages]);
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
              
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Images</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {existingImages.map((img, index) => {
                      // Create a unique key for each image to prevent React rendering issues
                      const key = `existing-${img.url}-${index}`;
                      return (
                        <div key={key} className="relative border rounded-md p-2">
                          <img
                            src={img.url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div className="flex justify-between mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryImage(index, true)}
                              disabled={img.isPrimary}
                            >
                              {img.isPrimary ? 'Primary' : 'Set Primary'}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index, true)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 