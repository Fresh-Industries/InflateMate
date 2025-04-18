'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateBounceHouseForm } from "./CreateBounceHouseForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export interface CreateBounceHouseFormData {
  name: string;
  description?: string;
  dimensions: string;
  capacity: number;
  price: number;
  setupTime: number;
  teardownTime: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  features?: string[];
  minimumSpace: string;
  weightLimit: number;
  ageRange: string;
  weatherRestrictions?: string[];
}

interface CreateBounceHouseDialogProps {
  onBounceHouseCreated?: () => void;
  businessId: string;
}

export function CreateBounceHouseDialog({ onBounceHouseCreated, businessId }: CreateBounceHouseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: CreateBounceHouseFormData) => {
    setIsSubmitting(true);

    try {
      if (!businessId) {
        throw new Error("Business ID is required");
      }

      const response = await fetch(`/api/businesses/${businessId}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create bounce house");
      }

      toast({
        title: "Success",
        description: "Bounce house created successfully",
      });
      
      setIsOpen(false);
      onBounceHouseCreated?.();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create bounce house",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleFormDataChange = (data: CreateBounceHouseFormData) => {
    // Track the form state for validation or pre-processing before submission
    // This could validate data, transform it, or prepare it for submission
    const validData = {
      ...data,
      // Ensure price is formatted correctly
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      // Make sure arrays exist even if undefined
      features: data.features || [],
      weatherRestrictions: data.weatherRestrictions || [],
      // Clean description if empty
      description: data.description?.trim() || ""
    };
    
    // Could store in state if needed for further processing
    // setFormState(validData);
    
    // Log for debugging
    console.log('Form data validated:', validData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Bounce House</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new bounce house to your inventory.
          </DialogDescription>
        </DialogHeader>
        <CreateBounceHouseForm
          onSuccess={() => setIsOpen(false)}
          onCancel={handleCancel}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
