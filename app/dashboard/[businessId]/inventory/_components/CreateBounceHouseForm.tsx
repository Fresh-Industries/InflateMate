'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";

export interface CreateBounceHouseFormData {
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
  images: { url: string; isPrimary: boolean }[];
}

interface CreateBounceHouseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onFormDataChange: (data: CreateBounceHouseFormData) => void;
  onSubmit: (data: CreateBounceHouseFormData) => Promise<void>;
  isSubmitting: boolean;
}

interface ImageFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

// Local state type for form inputs (all values as strings for easier control)
interface LocalFormState {
  name: string;
  description: string;
  dimensions: string;
  capacity: string;
  price: string;
  setupTime: string;
  teardownTime: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  minimumSpace: string;
  weightLimit: string;
  ageRange: string;
  weatherRestrictions: string[];
}

export function CreateBounceHouseForm({
  onSuccess,
  onCancel,
  onFormDataChange,
  onSubmit,
}: CreateBounceHouseFormProps) {
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<LocalFormState>({
    name: "",
    description: "",
    dimensions: "",
    capacity: "",
    price: "",
    setupTime: "",
    teardownTime: "",
    status: "AVAILABLE",
    minimumSpace: "",
    weightLimit: "",
    ageRange: "",
    weatherRestrictions: [],
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Validate each file size
    const validFiles = files.filter((file) => {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `${file.name} exceeds 4MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    // Create preview URLs and mark the first file as primary if none selected
    const newImageFiles: ImageFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: selectedFiles.length === 0, // first file is primary by default
    }));

    setSelectedFiles((prev) => [...prev, ...newImageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      // If the primary image was removed, mark the first image as primary (if any)
      if (newFiles.length > 0 && prev[index].isPrimary) {
        newFiles[0].isPrimary = true;
      }
      return newFiles;
    });
  };

  const setPrimaryImage = (index: number) => {
    setSelectedFiles((prev) =>
      prev.map((file, i) => ({
        ...file,
        isPrimary: i === index,
      }))
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImages: { url: string; isPrimary: boolean }[] = [];
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const files = selectedFiles.map((img) => img.file);
        const uploadedFiles = await startUpload(files);
        if (!uploadedFiles) {
          throw new Error("Failed to upload images");
        }
        uploadedImages = uploadedFiles.map((file, index) => ({
          url: file.ufsUrl || file.url,
          isPrimary: selectedFiles[index].isPrimary,
        }));
        setIsUploading(false);
      }

      // Convert local form values to proper types for submission.
      const completeFormData: CreateBounceHouseFormData = {
        name: formData.name,
        description: formData.description,
        dimensions: formData.dimensions,
        capacity: parseInt(formData.capacity) || 0,
        price: parseFloat(formData.price) || 0,
        setupTime: parseInt(formData.setupTime) || 0,
        teardownTime: parseInt(formData.teardownTime) || 0,
        status: formData.status,
        minimumSpace: formData.minimumSpace,
        weightLimit: parseInt(formData.weightLimit) || 0,
        ageRange: formData.ageRange,
        weatherRestrictions: formData.weatherRestrictions,
        images: uploadedImages,
      };

      // Basic local validations
      if (!completeFormData.name) throw new Error("Name is required");
      if (!completeFormData.dimensions) throw new Error("Dimensions are required");
      if (!completeFormData.capacity) throw new Error("Capacity is required");
      if (!completeFormData.price) throw new Error("Price is required");
      if (!completeFormData.minimumSpace) throw new Error("Minimum space is required");
      if (!completeFormData.weightLimit) throw new Error("Weight limit is required");
      if (!completeFormData.ageRange) throw new Error("Age range is required");

      // Inform the parent about the complete data
      onFormDataChange(completeFormData);
      // Submit the complete data
      await onSubmit(completeFormData);
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "AVAILABLE" | "MAINTENANCE" | "RETIRED",
    }));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Castle Bounce House"
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
            placeholder="15' x 15'"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="10"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="299.99"
            min="0"
            step="0.01"
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
            placeholder="30"
            min="0"
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
            placeholder="30"
            min="0"
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
            placeholder="20' x 20'"
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
            placeholder="500"
            min="0"
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
            placeholder="5-12 years"
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
          placeholder="Describe the bounce house..."
          className="h-32"
        />
      </div>

      {/* Image upload section */}
      <div className="space-y-4">
        <Label>Images</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer relative group border-gray-300 hover:border-primary transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-primary" />
            <div>
              <p className="text-sm font-medium">Click to upload images</p>
              <p className="text-xs text-gray-500 mt-2">Max 4MB per image • PNG, JPG, WEBP</p>
            </div>
          </div>
        </div>

        {/* Image previews */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:text-white hover:bg-red-500/20"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 text-white hover:text-white hover:bg-yellow-500/20 ${
                      file.isPrimary ? "text-yellow-400" : ""
                    }`}
                    onClick={() => setPrimaryImage(index)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                {file.isPrimary && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || isUploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading || isUploading ? "Creating..." : "Create Bounce House"}
        </Button>
      </div>
    </form>
  );
}
