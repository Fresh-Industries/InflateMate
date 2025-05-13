// src/hooks/useBusinessDetails.ts

import { useState, useEffect } from 'react';
import { Business } from '@/types/booking'; // Assuming Business type is defined
import * as BookingService from '@/services/bookingService'; // Import your service
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast hook

export function useBusinessDetails(businessId: string) {
  const { toast } = useToast();
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);
  const [businessError, setBusinessError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setIsLoadingBusiness(false);
      setBusinessError("Business ID is required.");
      return;
    }

    const fetchDetails = async () => {
      setIsLoadingBusiness(true);
      setBusinessError(null);
      try {
        const data = await BookingService.fetchBusinessDetails(businessId);
        setBusinessData(data);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching business data:", error);
        setBusinessError(error.message || "Failed to load business details.");
        toast({
           title: "Error",
           description: error.message || "Failed to load business details.",
           variant: "destructive"
        });
      } finally {
        setIsLoadingBusiness(false);
      }
    };

    fetchDetails();

  }, [businessId, toast]); // Re-run if businessId changes

  // Expose tax details directly for convenience, derive from businessData
  const taxRate = businessData?.defaultTaxRate || 0;
  const applyTax = businessData?.applyTaxToBookings || false;

  return {
    businessData,
    isLoadingBusiness,
    businessError,
    taxRate, // Derived state
    applyTax, // Derived state
  };
}
