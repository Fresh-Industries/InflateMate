'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from '@/lib/uploadthing';
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
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

interface EditBounceHouseDialogProps {
  bounceHouse: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export function EditBounceHouseDialog({ 
  bounceHouse,
  isOpen,
  onOpenChange,
  onSuccess 
}: EditBounceHouseDialogProps) {
  const params = useParams();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: bounceHouse.name,
    description: bounceHouse.description || "",
    dimensions: bounceHouse.dimensions,
    capacity: bounceHouse.capacity,
    price: bounceHouse.price,
    setupTime: bounceHouse.setupTime,
    teardownTime: bounceHouse.teardownTime,
    status: bounceHouse.status,
    minimumSpace: bounceHouse.minimumSpace,
    weightLimit: bounceHouse.weightLimit,
    ageRange: bounceHouse.ageRange,
    features: bounceHouse.features?.map((f: any) => f.name) || [],
    weatherRestrictions: bounceHouse.weatherRestrictions || [],
  });

  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState(
    bounceHouse.images.map((url: string, index: number) => ({
      url,
      isPrimary: url === bounceHouse.primaryImage
    }))
  );

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload new images if any
      let uploadedImages = [];
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

      const response = await fetch(`/api/businesses/${params.id}/bounce-houses/${bounceHouse.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
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

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update bounce house",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/businesses/${params.id}/bounce-houses/${bounceHouse.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bounce house");
      }

      toast({
        title: "Success",
        description: "Bounce house deleted successfully",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete bounce house",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bounce House</DialogTitle>
            <DialogDescription>
              Update the details of your bounce house.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
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
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (people)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
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
                  value={formData.weightLimit}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Day ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupTime">Setup Time (minutes)</Label>
                <Input
                  id="setupTime"
                  name="setupTime"
                  type="number"
                  value={formData.setupTime}
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
                  value={formData.teardownTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
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

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Images</Label>
              
              {/* Existing Images */}
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

                {/* New Images */}
                {selectedImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={image.preview}
                      alt={`New bounce house ${index + 1}`}
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

                {/* Upload Button */}
                <div
                  className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors h-32"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-8 w-8" />
                    <span className="text-sm">Upload Image</span>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isLoading}
              >
                Delete Bounce House
              </Button>

              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 