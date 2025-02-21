'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X, Star, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from '@/lib/uploadthing';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface BounceHouse {
  status: string;
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
}

export default function EditBounceHousePage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bounceHouse, setBounceHouse] = useState<BounceHouse | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; isPrimary: boolean; }[]>([]);

  useEffect(() => {
    const fetchBounceHouse = async () => {
      try {
        const response = await fetch(`/api/businesses/${businessId}/bounce-houses/${params.bounceHouseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bounce house");
        }
        const data = await response.json();
        setBounceHouse(data);
        setExistingImages(
          data.images.map((url: string) => ({
            url,
            isPrimary: url === data.primaryImage
          }))
        );
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch bounce house details";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        router.push(`/dashboard/${params.id}/inventory`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBounceHouse();
  }, [params.id, params.bounceHouseId, businessId, router, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    const maxSize = 4 * 1024 * 1024; // 4MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 4MB`,
          variant: "destructive",
        });
        continue;
      }

      newImages.push({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: false,
      });
    }

    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const imageToRemove = selectedImages[index];
      URL.revokeObjectURL(imageToRemove.preview);
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
    }
  };

  const setPrimaryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(existingImages.map((img, i) => ({
        ...img,
        isPrimary: i === index
      })));
      setSelectedImages(selectedImages.map(img => ({ ...img, isPrimary: false })));
    } else {
      setSelectedImages(selectedImages.map((img, i) => ({
        ...img,
        isPrimary: i === index
      })));
      setExistingImages(existingImages.map(img => ({ ...img, isPrimary: false })));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBounceHouse((prev: BounceHouse | null) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSelectChange = (value: string) => {
    setBounceHouse((prev: BounceHouse | null) => {
      if (!prev) return null;
      return {
        ...prev,
        status: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload new images if any
      let uploadedImages: { url: string; isPrimary: boolean; }[] = [];
      if (selectedImages.length > 0) {
        const files = selectedImages.map(img => img.file);
        const uploadedFiles = await startUpload(files);
        if (!uploadedFiles) {
          throw new Error("Failed to upload images");
        }
        uploadedImages = uploadedFiles.map((file, index) => ({
          url: file.url,
          isPrimary: selectedImages[index].isPrimary
        }));
      }

      // Combine existing and new images
      const allImages = [
        ...existingImages,
        ...uploadedImages
      ];

      const response = await fetch(`/api/businesses/${businessId}/bounce-houses/${params.bounceHouseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bounceHouse,
          images: allImages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bounce house");
      }

      toast({
        title: "Success",
        description: "Bounce house updated successfully",
      });

      router.push(`/dashboard/${businessId}/inventory`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update bounce house",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/businesses/${businessId}/bounce-houses/${params.bounceHouseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bounce house");
      }

      toast({
        title: "Success",
        description: "Bounce house deleted successfully",
      });

      router.push(`/dashboard/${businessId}/inventory`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete bounce house",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!bounceHouse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Bounce house not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/dashboard/${businessId}/inventory`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Bounce House</h1>
            <p className="text-muted-foreground">
              Update the details of your bounce house
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={bounceHouse.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={bounceHouse.status} onValueChange={handleSelectChange}>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={bounceHouse.description || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                name="dimensions"
                value={bounceHouse.dimensions}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumSpace">Minimum Space Required</Label>
              <Input
                id="minimumSpace"
                name="minimumSpace"
                value={bounceHouse.minimumSpace}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (people)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={bounceHouse.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightLimit">Weight Limit (lbs)</Label>
              <Input
                id="weightLimit"
                name="weightLimit"
                type="number"
                value={bounceHouse.weightLimit}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range</Label>
              <Input
                id="ageRange"
                name="ageRange"
                value={bounceHouse.ageRange}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Setup</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price per Day ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={bounceHouse.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setupTime">Setup Time (minutes)</Label>
              <Input
                id="setupTime"
                name="setupTime"
                type="number"
                value={bounceHouse.setupTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teardownTime">Teardown Time (minutes)</Label>
              <Input
                id="teardownTime"
                name="teardownTime"
                type="number"
                value={bounceHouse.teardownTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={image.url}
                    alt={`Bounce house ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-red-500"
                      onClick={() => removeImage(index, true)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`text-white ${image.isPrimary ? "text-yellow-500" : "hover:text-yellow-500"}`}
                      onClick={() => setPrimaryImage(index, true)}
                    >
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}

              {selectedImages.map((image, index) => (
                <div key={`new-${index}`} className="relative group">
                  <Image
                    src={image.preview}
                    alt={`New bounce house ${index + 1}`}
                    width={128}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-red-500"
                      onClick={() => removeImage(index, false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`text-white ${image.isPrimary ? "text-yellow-500" : "hover:text-yellow-500"}`}
                      onClick={() => setPrimaryImage(index, false)}
                    >
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}

              <label className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors h-32">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="h-8 w-8" />
                  <span className="text-sm">Upload Image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isSubmitting}
          >
            Delete Bounce House
          </Button>

          <div className="space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/${businessId}/inventory`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bounce house
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 