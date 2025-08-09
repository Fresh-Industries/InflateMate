'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Gift, Mail, User, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeColors, ThemeDefinition } from "@/app/[domain]/_themes/types";
import { getContrastColor } from "@/app/[domain]/_themes/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadCaptureFormProps {
  businessId: string;
  funnelId: string;
  onSuccess: (couponCode: string | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryColor: any; // Allow both old and new formats for backward compatibility
  theme: ThemeDefinition;
  colors: ThemeColors;
}

// Helper function moved from page.tsx for consistency
const getButtonStyle = (theme: ThemeDefinition, colors: ThemeColors, type: 'primary' | 'secondary' = 'primary'): React.CSSProperties => {
 const baseStyles = theme.buttonStyles;
 const secondaryStyles = theme.secondaryButtonStyles;
 const styles = (type === 'secondary' && secondaryStyles) ? secondaryStyles : baseStyles;
 const fallbackStyles = baseStyles; // Always fallback to primary button styles

 // For secondary buttons with transparent background, use the text color directly from the theme
 if (type === 'secondary' && secondaryStyles && secondaryStyles.background(colors) === 'transparent') {
   return {
     background: styles?.background?.(colors) ?? fallbackStyles.background(colors),
     border: styles?.border?.(colors) ?? fallbackStyles.border?.(colors) ?? 'none',
     boxShadow: styles?.boxShadow?.(colors) ?? fallbackStyles.boxShadow?.(colors) ?? 'none',
     borderRadius: styles?.borderRadius ?? fallbackStyles.borderRadius ?? '12px',
     transition: styles?.transition ?? fallbackStyles.transition ?? 'all 0.3s ease',
     color: styles.textColor(colors), // Use the theme's text color directly
   };
 }

 return {
   background: styles?.background?.(colors) ?? fallbackStyles.background(colors),
   border: styles?.border?.(colors) ?? fallbackStyles.border?.(colors) ?? 'none',
   boxShadow: styles?.boxShadow?.(colors) ?? fallbackStyles.boxShadow?.(colors) ?? 'none',
   borderRadius: styles?.borderRadius ?? fallbackStyles.borderRadius ?? '12px',
   transition: styles?.transition ?? fallbackStyles.transition ?? 'all 0.3s ease',
   color: styles.textColor(colors) ?? fallbackStyles.textColor(colors),
 };
};

export function LeadCaptureForm({ businessId, funnelId, onSuccess, primaryColor, theme, colors }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/businesses/${businessId}/customers/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          funnelId,
          source: "popup",
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit form. Please try again.");
      }
      
      const data = await response.json();
      
      onSuccess(data.couponCode || null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // --- Theme Styles ---
  const inputStyles = theme.bookingStyles.input;
  const labelColor = inputStyles.labelColor(colors);
  const inputBg = inputStyles.background(colors);
  const inputBorder = inputStyles.border(colors);
  const inputFocusBorder = inputStyles.focusBorder(colors); // Store focus border color

  const primaryButtonStyle = getButtonStyle(theme, colors, 'primary');
  const buttonTextColor = getContrastColor(colors.primary[500]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive" className="mb-4 rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: labelColor }} className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" style={{ color: typeof primaryColor === 'object' ? primaryColor[500] : primaryColor }} />
                  Your Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field} 
                    className={cn(
                      "transition-all duration-200 rounded-xl py-6 px-4 text-base",
                      "focus-visible:ring-2 focus-visible:ring-offset-1",
                      "focus-visible:border-transparent"
                    )}
                    style={{
                      backgroundColor: inputBg,
                      borderColor: form.formState.errors.name ? "rgb(239 68 68)" : inputBorder,
                      "--tw-ring-color": inputFocusBorder,
                      boxShadow: `0 1px 2px ${colors.primary}10`,
                    } as React.CSSProperties}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: labelColor }} className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" style={{ color: typeof primaryColor === 'object' ? primaryColor[500] : primaryColor }} />
                  Your Email
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    type="email" 
                    {...field} 
                    className={cn(
                      "transition-all duration-200 rounded-xl py-6 px-4 text-base",
                      "focus-visible:ring-2 focus-visible:ring-offset-1",
                      "focus-visible:border-transparent"
                    )}
                    style={{
                      backgroundColor: inputBg,
                      borderColor: form.formState.errors.email ? "rgb(239 68 68)" : inputBorder,
                      "--tw-ring-color": inputFocusBorder,
                      boxShadow: `0 1px 2px ${colors.primary[500]}10`,
                    } as React.CSSProperties}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: labelColor }} className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" style={{ color: typeof primaryColor === 'object' ? primaryColor[500] : primaryColor }} />
                  Phone (Optional)
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your phone number" 
                    type="tel" 
                    {...field} 
                    className={cn(
                      "transition-all duration-200 rounded-xl py-6 px-4 text-base",
                      "focus-visible:ring-2 focus-visible:ring-offset-1",
                      "focus-visible:border-transparent"
                    )}
                    style={{
                      backgroundColor: inputBg,
                      borderColor: form.formState.errors.phone ? "rgb(239 68 68)" : inputBorder,
                      "--tw-ring-color": inputFocusBorder,
                      boxShadow: `0 1px 2px ${colors.primary}10`,
                    } as React.CSSProperties}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: labelColor }} className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" style={{ color: typeof primaryColor === 'object' ? primaryColor[500] : primaryColor }} />
                  Message (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your message" 
                    {...field} 
                    className={cn(
                      "resize-none rounded-xl px-4 py-3 text-base",
                      "transition-all duration-200",
                      "focus-visible:ring-2 focus-visible:ring-offset-1",
                      "focus-visible:border-transparent"
                    )}
                    style={{
                      backgroundColor: inputBg,
                      borderColor: form.formState.errors.message ? "rgb(239 68 68)" : inputBorder,
                      "--tw-ring-color": inputFocusBorder,
                      boxShadow: `0 1px 2px ${colors.primary}10`,
                    } as React.CSSProperties}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            type="submit" 
            className={cn(
              "w-full mt-4 py-6 text-lg font-bold shadow-lg",
              "transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
            disabled={isSubmitting}
            style={{ ...primaryButtonStyle, color: buttonTextColor }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Gift className="h-5 w-5" />
                <span>Get My Discount</span>
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
} 