"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import { deleteUploadThingFile } from "@/lib/uploadthing";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  popupTitle: z.string().min(2, "Popup title is required"),
  popupText: z.string().min(2, "Popup text is required"),
  formTitle: z.string().min(2, "Form title is required"),
  thankYouMessage: z.string().min(2, "Thank you message is required"),
  couponId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema> & {
  popupImage?: string;
};

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountAmount: number;
}

interface SalesFunnelFormProps {
  businessId: string;
  funnel?: {
    id: string;
    name: string;
    popupTitle: string;
    popupText: string;
    popupImage?: string;
    formTitle: string;
    thankYouMessage: string;
    couponId?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalesFunnelForm({ businessId, funnel, onSuccess, onCancel }: SalesFunnelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(funnel?.popupImage);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: funnel?.name || "",
      popupTitle: funnel?.popupTitle || "",
      popupText: funnel?.popupText || "",
      formTitle: funnel?.formTitle || "",
      thankYouMessage: funnel?.thankYouMessage || "",
      couponId: funnel?.couponId || undefined,
      popupImage: funnel?.popupImage,
    },
  });

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoadingCoupons(true);
        const response = await fetch(`/api/businesses/${businessId}/coupons`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }
        
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast({
          title: "Error",
          description: "Failed to load coupons. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCoupons(false);
      }
    };

    if (businessId) {
      fetchCoupons();
    }
  }, [businessId, toast]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...values,
        popupImage: imageUrl,
      };
      
      const url = funnel
        ? `/api/businesses/${businessId}/sales-funnels/${funnel.id}`
        : `/api/businesses/${businessId}/sales-funnels`;
      
      const method = funnel ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${funnel ? "update" : "create"} sales funnel`);
      }
      
      toast({
        title: "Success",
        description: `Sales funnel ${funnel ? "updated" : "created"} successfully.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error(`Error ${funnel ? "updating" : "creating"} sales funnel:`, error);
      toast({
        title: "Error",
        description: `Failed to ${funnel ? "update" : "create"} sales funnel. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageDelete = async () => {
    if (!imageUrl) return;
    
    try {
      setIsDeleting(true);
      
      // Extract the file key from the URL
      const fileKey = imageUrl.split("/").pop();
      
      if (fileKey) {
        await deleteUploadThingFile(fileKey);
      }
      
      setImageUrl(undefined);
      
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funnel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter funnel name" {...field} />
              </FormControl>
              <FormDescription>
                A name to identify this sales funnel (not visible to customers).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Popup Configuration</h3>
          
          <FormField
            control={form.control}
            name="popupTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popup Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter popup title" {...field} />
                </FormControl>
                <FormDescription>
                  The title displayed on the popup.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="popupText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popup Text</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter popup text" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  The text displayed on the popup.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Popup Image</FormLabel>
            {imageUrl ? (
              <div className="relative mt-2 w-full max-w-[300px] h-[200px] border rounded-md overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Popup image"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleImageDelete}
                  disabled={isDeleting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setImageUrl(res[0].url);
                      toast({
                        title: "Success",
                        description: "Image uploaded successfully.",
                      });
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: "Error",
                      description: `Failed to upload image: ${error.message}`,
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Upload an image to display on the popup (optional).
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Form Configuration</h3>
          
          <FormField
            control={form.control}
            name="formTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Form Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter form title" {...field} />
                </FormControl>
                <FormDescription>
                  The title displayed on the lead capture form.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="thankYouMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thank You Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter thank you message" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  The message displayed after form submission.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="couponId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingCoupons || coupons.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a coupon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coupons.map((coupon) => (
                      <SelectItem key={coupon.id} value={coupon.id}>
                        {coupon.code} - {coupon.discountType === "PERCENTAGE" ? `${coupon.discountAmount}%` : `$${coupon.discountAmount}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {coupons.length === 0 
                    ? "No coupons available. Create a coupon first." 
                    : "Select a coupon to offer to customers who submit the form."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary-gradient" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : funnel ? "Update Funnel" : "Create Funnel"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 