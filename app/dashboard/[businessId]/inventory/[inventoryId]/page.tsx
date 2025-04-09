'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { UploadButton } from '@/lib/uploadthing';
import { buttonVariants } from '@/components/ui/button';

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface InventoryItem {
  id: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED';
  type: 'BOUNCE_HOUSE' | 'INFLATABLE' | 'GAME' | 'OTHER';
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

        // Transform existing images; ensure one primary image if available
        const uniqueUrls = new Set();
        const images = data.images
          .filter((url: string) => {
            if (uniqueUrls.has(url)) return false;
            uniqueUrls.add(url);
            return true;
          })
          .map((url: string) => ({
            url,
            isPrimary: url === data.primaryImage,
          }));
        if (images.length > 0 && !images.some((img: { url: string; isPrimary: boolean }) => img.isPrimary)) {
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

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newExistingImages = [...existingImages];
      const imageToRemove = newExistingImages[index];
      if (imageToRemove.isPrimary) {
        const remainingImages = newExistingImages.filter((_, i) => i !== index);
        if (remainingImages.length > 0) {
          remainingImages[0].isPrimary = true;
        } else if (selectedImages.length > 0) {
          const newSelected = [...selectedImages];
          newSelected[0].isPrimary = true;
          setSelectedImages(newSelected);
        }
      }
      newExistingImages.splice(index, 1);
      setExistingImages([...newExistingImages]);
    } else {
      const newSelectedImages = [...selectedImages];
      if (newSelectedImages[index].isPrimary) {
        const remaining = newSelectedImages.filter((_, i) => i !== index);
        if (remaining.length > 0) {
          remaining[0].isPrimary = true;
        } else if (existingImages.length > 0) {
          const newExisting = [...existingImages];
          newExisting[0].isPrimary = true;
          setExistingImages(newExisting);
        }
      }
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
      const newSelectedImages = selectedImages.map(img => ({ ...img, isPrimary: false }));
      setExistingImages(newExistingImages);
      setSelectedImages(newSelectedImages);
    } else {
      const newSelectedImages = selectedImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      const newExistingImages = existingImages.map(img => ({ ...img, isPrimary: false }));
      setSelectedImages(newSelectedImages);
      setExistingImages(newExistingImages);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!inventoryItem) return;
    const { name, value } = e.target;
    setInventoryItem({ ...inventoryItem, [name]: value });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!inventoryItem) return;
    const { name, value } = e.target;
    setInventoryItem({ ...inventoryItem, [name]: Number(value) });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!inventoryItem) return;
    setInventoryItem({ ...inventoryItem, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryItem) return;
    setIsSubmitting(true);

    try {
      const originalImageUrls = inventoryItem.images || [];
      const currentImageUrls = existingImages.map(img => img.url);
      const removedImageUrls = originalImageUrls.filter(url => !currentImageUrls.includes(url));

      const allImages = existingImages.map(img => ({ url: img.url, isPrimary: img.isPrimary }));
      const primaryCount = allImages.filter(img => img.isPrimary).length;
      if (primaryCount > 1) {
        let found = false;
        allImages.forEach(img => {
          if (img.isPrimary) {
            if (found) {
              img.isPrimary = false;
            } else {
              found = true;
            }
          }
        });
      } else if (primaryCount === 0 && allImages.length > 0) {
        allImages[0].isPrimary = true;
      }
      
      const response = await fetch(`/api/businesses/${businessId}/inventory/${inventoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inventoryItem,
          images: allImages,
          removedImages: removedImageUrls,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update inventory item');
      toast({ title: 'Success', description: 'Inventory item updated successfully' });
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
      const response = await fetch(`/api/businesses/${businessId}/inventory/${inventoryId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete inventory item');
      toast({ title: 'Success', description: 'Inventory item deleted successfully' });
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
      case 'BOUNCE_HOUSE': return 'Bounce House';
      case 'INFLATABLE': return 'Inflatable';
      case 'GAME': return 'Game';
      case 'OTHER': return 'Other';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!inventoryItem) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-bold">Inventory Item Not Found</h2>
        <p className="text-gray-600">The inventory item you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => router.push(`/dashboard/${businessId}/inventory`)}>
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push(`/dashboard/${businessId}/inventory`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Edit&nbsp;
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getTypeDisplayName(inventoryItem.type)}
              </span>
            </h1>
            <p className="text-gray-600">
              Update details for <span className="font-medium">{inventoryItem.name}</span>
            </p>
          </div>
        </div>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="rounded-md">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Item
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the inventory item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: 'destructive' })}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader className="border-b border-blue-200">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Edit details for this {getTypeDisplayName(inventoryItem.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={inventoryItem.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={inventoryItem.description || ''} onChange={handleInputChange} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={inventoryItem.status} onValueChange={(value) => handleSelectChange('status', value)}>
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
                <Input id="price" name="price" type="number" min="0" step="0.01" value={inventoryItem.price} onChange={handleNumberInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" value={inventoryItem.quantity || 1} onChange={handleNumberInputChange} required />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader className="border-b border-blue-200">
              <CardTitle>Specifications</CardTitle>
              <CardDescription>
                Update technical details for this {getTypeDisplayName(inventoryItem.type).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" name="dimensions" value={inventoryItem.dimensions} onChange={handleInputChange} placeholder="e.g. 15ft x 15ft x 10ft" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumSpace">Minimum Space Required</Label>
                <Input id="minimumSpace" name="minimumSpace" value={inventoryItem.minimumSpace} onChange={handleInputChange} placeholder="e.g. 20ft x 20ft" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (people)</Label>
                <Input id="capacity" name="capacity" type="number" min="1" value={inventoryItem.capacity} onChange={handleNumberInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightLimit">Weight Limit (lbs)</Label>
                <Input id="weightLimit" name="weightLimit" type="number" min="0" value={inventoryItem.weightLimit} onChange={handleNumberInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Input id="ageRange" name="ageRange" value={inventoryItem.ageRange} onChange={handleInputChange} placeholder="e.g. 5-12 years" required />
              </div>
            </CardContent>
          </Card>

          {/* Setup & Teardown */}
          <Card>
            <CardHeader className="border-b border-blue-200">
              <CardTitle>Setup & Teardown</CardTitle>
              <CardDescription>Update setup and teardown details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setupTime">Setup Time (minutes)</Label>
                <Input id="setupTime" name="setupTime" type="number" min="0" value={inventoryItem.setupTime} onChange={handleNumberInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teardownTime">Teardown Time (minutes)</Label>
                <Input id="teardownTime" name="teardownTime" type="number" min="0" value={inventoryItem.teardownTime} onChange={handleNumberInputChange} required />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="border-b border-blue-200">
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
                    const newImages = res.map((file, index) => {
                      const isPrimary =
                        existingImages.length === 0 &&
                        !existingImages.some(img => img.isPrimary) &&
                        index === 0;
                      return { url: file.url, isPrimary };
                    });
                    if (newImages.some(img => img.isPrimary)) {
                      setExistingImages(existingImages.map(img => ({ ...img, isPrimary: false })));
                    }
                    setExistingImages([...existingImages, ...newImages]);
                    toast({
                      title: "Upload Complete",
                      description: `Uploaded ${res.length} image${res.length > 1 ? 's' : ''}`,
                    });
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: "Upload Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  }}
                />
              </div>
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {existingImages.map((img, index) => {
                      const key = `existing-${img.url}-${index}`;
                      return (
                        <div key={key} className="relative border rounded-md overflow-hidden aspect-video group">
                          <img 
                            src={img.url} 
                            alt={`Image ${index + 1}`} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                            <div className="flex justify-end gap-1">
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="h-7 w-7 rounded-md opacity-80 hover:opacity-100" 
                                onClick={() => removeImage(index, true)}
                                title="Remove Image"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant={img.isPrimary ? 'default' : 'secondary'}
                              size="xs"
                              className={`rounded-md w-full ${img.isPrimary ? 'bg-primary text-primary-foreground cursor-default' : 'bg-white/80 hover:bg-white text-primary'}`}
                              onClick={() => setPrimaryImage(index, true)}
                              disabled={img.isPrimary}
                              title={img.isPrimary ? 'Primary Image' : 'Set as Primary'}
                            >
                              {img.isPrimary ? 'Primary' : 'Set Primary'}
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

        {/* Form Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/${businessId}/inventory`)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
