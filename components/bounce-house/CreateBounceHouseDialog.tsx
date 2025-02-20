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

interface CreateBounceHouseFormData {
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
  const [formData, setFormData] = useState<CreateBounceHouseFormData | {}>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      if (!businessId) {
        throw new Error("Business ID is required");
      }

      const response = await fetch(`/api/businesses/${businessId}/bounce-houses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create bounce house");
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

  const handleFormDataChange = (data: any) => {
    setFormData(data);
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