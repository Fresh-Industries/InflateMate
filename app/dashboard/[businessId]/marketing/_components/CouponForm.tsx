"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountAmount: z.coerce.number().positive("Amount must be positive"),
  maxUses: z.coerce.number().int().positive("Max uses must be a positive integer").optional(),
  isActive: z.boolean().default(true),
  minimumAmount: z.coerce.number().nonnegative("Minimum amount must be non-negative").optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(data => {
  // If both dates are provided, ensure endDate is after startDate
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
}).refine(data => {
  // For percentage discounts, ensure the amount is between 1 and 100
  if (data.discountType === "PERCENTAGE") {
    return data.discountAmount <= 100;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discountAmount"],
});

type FormValues = z.infer<typeof formSchema>;

interface CouponFormProps {
  businessId: string;
  coupon?: {
    id: string;
    code: string;
    description?: string | null;
    discountType: "PERCENTAGE" | "FIXED";
    discountAmount: number;
    maxUses?: number | null;
    usedCount: number;
    startDate?: string | null;
    endDate?: string | null;
    isActive: boolean;
    minimumAmount?: number | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function CouponForm({ businessId, coupon, onSuccess, onCancel }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Convert string dates to Date objects for the form
  const defaultValues: Partial<FormValues> = {
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: coupon?.discountType || "PERCENTAGE",
    discountAmount: coupon?.discountAmount || 10,
    maxUses: coupon?.maxUses || undefined,
    isActive: coupon?.isActive ?? true,
    minimumAmount: coupon?.minimumAmount || undefined,
    startDate: coupon?.startDate ? new Date(coupon.startDate) : undefined,
    endDate: coupon?.endDate ? new Date(coupon.endDate) : undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const discountType = form.watch("discountType");

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const url = coupon
        ? `/api/businesses/${businessId}/coupons/${coupon.id}`
        : `/api/businesses/${businessId}/coupons`;
      
      const method = coupon ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${coupon ? "update" : "create"} coupon`);
      }
      
      toast({
        title: "Success",
        description: `Coupon ${coupon ? "updated" : "created"} successfully.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error(`Error ${coupon ? "updating" : "creating"} coupon:`, error);
      toast({
        title: "Error",
        description: `Failed to ${coupon ? "update" : "create"} coupon. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter coupon code" {...field} />
              </FormControl>
              <FormDescription>
                The code customers will enter to apply the discount.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter coupon description" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                A description of what this coupon is for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Discount Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PERCENTAGE" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Percentage (%)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FIXED" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Fixed Amount ($)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="discountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {discountType === "PERCENTAGE" ? "Discount Percentage" : "Discount Amount"}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder={discountType === "PERCENTAGE" ? "Enter percentage" : "Enter amount"} 
                    {...field} 
                    min={0}
                    max={discountType === "PERCENTAGE" ? 100 : undefined}
                    step={discountType === "PERCENTAGE" ? 1 : 0.01}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {discountType === "PERCENTAGE" ? "%" : "$"}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                {discountType === "PERCENTAGE" 
                  ? "The percentage discount to apply (1-100)." 
                  : "The fixed amount discount to apply."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="minimumAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Purchase Amount (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="Enter minimum amount" 
                    {...field} 
                    value={field.value || ""}
                    min={0}
                    step={0.01}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    $
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                The minimum purchase amount required to use this coupon.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="maxUses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Uses (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter maximum uses" 
                  {...field} 
                  value={field.value || ""}
                  min={1}
                />
              </FormControl>
              <FormDescription>
                The maximum number of times this coupon can be used.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the coupon becomes valid.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate");
                        return startDate ? date <= startDate : date < new Date(new Date().setHours(0, 0, 0, 0));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the coupon expires.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Enable or disable this coupon.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary-gradient" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 