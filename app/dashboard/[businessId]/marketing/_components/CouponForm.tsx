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
import { DatePickerWithRange } from "@/components/DatePicker";
import { toast } from "sonner";

const optionalNumber = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const coerced = typeof val === "string" ? Number(val) : (val as unknown as number);
    return Number.isFinite(coerced) ? coerced : undefined;
  },
  z.number().positive().optional()
);

const optionalNonNegativeNumber = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const coerced = typeof val === "string" ? Number(val) : (val as unknown as number);
    return Number.isFinite(coerced) ? coerced : undefined;
  },
  z.number().nonnegative().optional()
);

const formSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountAmount: z.coerce.number().positive("Amount must be positive"),
  maxUses: optionalNumber.refine(
    val => val === undefined || Number.isInteger(val), 
    "Max uses must be a whole number"
  ),
  isActive: z.boolean().default(true),
  minimumAmount: optionalNonNegativeNumber,
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
}).refine(data => {
  // If both dates are provided, ensure to is after from
  if (data.dateRange?.from && data.dateRange?.to) {
    // Set time to end of day for 'to' date for inclusive comparison
    const toDate = new Date(data.dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    return toDate >= data.dateRange.from;
  }
  return true;
}, {
  message: "End date must be on or after start date",
  path: ["dateRange"],
}).refine(data => {
  // For percentage discounts, ensure the amount is between 1 and 100
  if (data.discountType === "PERCENTAGE") {
    // Allow positive check to handle the initial required validation
    return data.discountAmount > 0 && data.discountAmount <= 100;
  }
  return true;
}, {
  message: "Percentage discount must be between 1 and 100",
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
  // Convert string dates to Date objects for the form
  const defaultValues: Partial<FormValues> = {
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: coupon?.discountType || "PERCENTAGE",
    discountAmount: coupon?.discountAmount || 10,
    maxUses: coupon?.maxUses ?? undefined,
    isActive: coupon?.isActive ?? true,
    minimumAmount: coupon?.minimumAmount ?? undefined,
    dateRange: {
        from: coupon?.startDate ? new Date(coupon.startDate) : undefined,
        to: coupon?.endDate ? new Date(coupon.endDate) : undefined,
    },
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
      
      // Extract dates from dateRange for API payload
      const payload = {
        ...values,
        startDate: values.dateRange?.from,
        endDate: values.dateRange?.to,
        dateRange: undefined, // Remove dateRange from payload
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send modified payload
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${coupon ? "update" : "create"} coupon`);
      }
      
      toast.success(`Coupon ${coupon ? "updated" : "created"} successfully.`);
      
      onSuccess();
    } catch (error) {
      console.error(`Error ${coupon ? "updating" : "creating"} coupon:`, error);
      toast.error(`Failed to ${coupon ? "update" : "create"} coupon. Please try again.`);
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
                    placeholder="Leave blank for no minimum" 
                    {...field} 
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                  placeholder="Leave blank for unlimited" 
                  {...field} 
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  min={1}
                  step={1}
                />
              </FormControl>
              <FormDescription>
                The maximum number of times this coupon can be used in total.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Validity Period (Optional)</FormLabel>
              <DatePickerWithRange 
                date={field.value ? { from: field.value.from, to: field.value.to } : undefined}
                onSelect={field.onChange}
              />
              <FormDescription>
                The date range during which the coupon is active.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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