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
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";

export type InventoryType = "BOUNCE_HOUSE" | "WATER_SLIDE" | "GAME" | "OTHER";

export interface CreateInventoryFormData {
  name: string;
  description: string;
  type: InventoryType;
  price: number;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  quantity: number;
  images: { url: string; isPrimary: boolean }[];
  
  // Optional fields that depend on type
  dimensions?: string;
  capacity?: number;
  setupTime?: number;
  teardownTime?: number;
  minimumSpace?: string;
  weightLimit?: number;
  ageRange?: string;
  weatherRestrictions?: string[];
}

interface CreateInventoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onFormDataChange: (data: CreateInventoryFormData) => void;
  onSubmit: (data: CreateInventoryFormData) => Promise<void>;
  isSubmitting: boolean;
  initialType?: InventoryType;
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
  type: InventoryType;
  price: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  quantity: string;
  dimensions: string;
  capacity: string;
  setupTime: string;
  teardownTime: string;
  minimumSpace: string;
  weightLimit: string;
  ageRange: string;
  weatherRestrictions: string[];
}

// Define which fields are required/shown for each type
type FieldName = 'dimensions' | 'capacity' | 'setupTime' | 'teardownTime' | 'minimumSpace' | 'weightLimit' | 'ageRange' | 'weatherRestrictions';

const typeFieldConfig: Record<InventoryType, { required: FieldName[]; optional: FieldName[] }> = {
  BOUNCE_HOUSE: {
    required: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange'],
    optional: ['weatherRestrictions']
  },
  WATER_SLIDE: {
    required: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange'],
    optional: ['weatherRestrictions']
  },
  GAME: {
    required: ['ageRange'],
    optional: ['dimensions', 'capacity', 'setupTime', 'teardownTime']
  },
  OTHER: {
    required: [],
    optional: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange']
  }
};

export function CreateInventoryForm({
  onSuccess,
  onCancel,
  onFormDataChange,
  onSubmit,
  initialType = "BOUNCE_HOUSE"
}: CreateInventoryFormProps) {
  const { startUpload } = useUploadThing("imageUploader");
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<LocalFormState>({
    name: "",
    description: "",
    type: initialType,
    price: "",
    status: "AVAILABLE",
    quantity: "1",
    dimensions: "",
    capacity: "",
    setupTime: "30",
    teardownTime: "30",
    minimumSpace: "",
    weightLimit: "",
    ageRange: "",
    weatherRestrictions: [],
  });

  const getTypeDisplayName = (type: InventoryType) => {
    switch (type) {
      case 'BOUNCE_HOUSE':
        return 'Bounce House';
      case 'WATER_SLIDE':
        return 'Water Slide';
      case 'GAME':
        return 'Game';
      case 'OTHER':
        return 'Other';
      default:
        return type;
    }
  };

  const shouldShowField = (fieldName: FieldName) => {
    const config = typeFieldConfig[formData.type];
    return config.required.includes(fieldName) || config.optional.includes(fieldName);
  };

  const isFieldRequired = (fieldName: FieldName) => {
    const config = typeFieldConfig[formData.type];
    return config.required.includes(fieldName);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Validate each file size
    const validFiles = files.filter((file) => {
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 4MB limit`);
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
      const completeFormData: CreateInventoryFormData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        status: formData.status,
        quantity: parseInt(formData.quantity) || 1,
        images: uploadedImages,
      };

      // Add optional fields if they should be shown for this type
      if (shouldShowField('dimensions')) {
        completeFormData.dimensions = formData.dimensions;
      }
      if (shouldShowField('capacity')) {
        completeFormData.capacity = parseInt(formData.capacity) || 0;
      }
      if (shouldShowField('setupTime')) {
        completeFormData.setupTime = parseInt(formData.setupTime) || 0;
      }
      if (shouldShowField('teardownTime')) {
        completeFormData.teardownTime = parseInt(formData.teardownTime) || 0;
      }
      if (shouldShowField('minimumSpace')) {
        completeFormData.minimumSpace = formData.minimumSpace;
      }
      if (shouldShowField('weightLimit')) {
        completeFormData.weightLimit = parseInt(formData.weightLimit) || 0;
      }
      if (shouldShowField('ageRange')) {
        completeFormData.ageRange = formData.ageRange;
      }
      if (shouldShowField('weatherRestrictions')) {
        completeFormData.weatherRestrictions = formData.weatherRestrictions;
      }

      // Basic local validations
      if (!completeFormData.name) throw new Error("Name is required");
      if (!completeFormData.price) throw new Error("Price is required");

      // Type-specific required field validations
      const config = typeFieldConfig[formData.type];
      for (const fieldName of config.required) {
        const value = completeFormData[fieldName as keyof CreateInventoryFormData];
        if (!value || value === "" || value === 0) {
          const displayName = fieldName.replace(/([A-Z])/g, ' $1').toLowerCase();
          throw new Error(`${displayName.charAt(0).toUpperCase() + displayName.slice(1)} is required for ${getTypeDisplayName(formData.type)}`);
        }
      }

      // Inform the parent about the complete data
      onFormDataChange(completeFormData);
      // Submit the complete data
      await onSubmit(completeFormData);
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit form");
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Always show these basic fields */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={`Enter ${getTypeDisplayName(formData.type).toLowerCase()} name`}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value as InventoryType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BOUNCE_HOUSE">Bounce House</SelectItem>
              <SelectItem value="WATER_SLIDE">Water Slide</SelectItem>
              <SelectItem value="GAME">Game</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
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
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="1"
            min="1"
            required
          />
        </div>

        {/* Conditionally show fields based on type */}
        {shouldShowField('dimensions') && (
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions {isFieldRequired('dimensions') && '*'}</Label>
            <Input
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder="15' x 15'"
              required={isFieldRequired('dimensions')}
            />
          </div>
        )}

        {shouldShowField('capacity') && (
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity {isFieldRequired('capacity') && '*'}</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="10"
              min="1"
              required={isFieldRequired('capacity')}
            />
          </div>
        )}

        {shouldShowField('setupTime') && (
          <div className="space-y-2">
            <Label htmlFor="setupTime">Setup Time (minutes) {isFieldRequired('setupTime') && '*'}</Label>
            <Input
              id="setupTime"
              name="setupTime"
              type="number"
              value={formData.setupTime}
              onChange={handleInputChange}
              placeholder="30"
              min="0"
              required={isFieldRequired('setupTime')}
            />
          </div>
        )}

        {shouldShowField('teardownTime') && (
          <div className="space-y-2">
            <Label htmlFor="teardownTime">Teardown Time (minutes) {isFieldRequired('teardownTime') && '*'}</Label>
            <Input
              id="teardownTime"
              name="teardownTime"
              type="number"
              value={formData.teardownTime}
              onChange={handleInputChange}
              placeholder="30"
              min="0"
              required={isFieldRequired('teardownTime')}
            />
          </div>
        )}

        {shouldShowField('minimumSpace') && (
          <div className="space-y-2">
            <Label htmlFor="minimumSpace">Minimum Space Required {isFieldRequired('minimumSpace') && '*'}</Label>
            <Input
              id="minimumSpace"
              name="minimumSpace"
              value={formData.minimumSpace}
              onChange={handleInputChange}
              placeholder="20' x 20'"
              required={isFieldRequired('minimumSpace')}
            />
          </div>
        )}

        {shouldShowField('weightLimit') && (
          <div className="space-y-2">
            <Label htmlFor="weightLimit">Weight Limit (lbs) {isFieldRequired('weightLimit') && '*'}</Label>
            <Input
              id="weightLimit"
              name="weightLimit"
              type="number"
              value={formData.weightLimit}
              onChange={handleInputChange}
              placeholder="500"
              min="0"
              required={isFieldRequired('weightLimit')}
            />
          </div>
        )}

        {shouldShowField('ageRange') && (
          <div className="space-y-2">
            <Label htmlFor="ageRange">Age Range {isFieldRequired('ageRange') && '*'}</Label>
            <Input
              id="ageRange"
              name="ageRange"
              value={formData.ageRange}
              onChange={handleInputChange}
              placeholder="5-12 years"
              required={isFieldRequired('ageRange')}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder={`Describe the ${getTypeDisplayName(formData.type).toLowerCase()}...`}
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
          {isLoading || isUploading ? "Creating..." : `Create ${getTypeDisplayName(formData.type)}`}
        </Button>
      </div>
    </form>
  );
} 