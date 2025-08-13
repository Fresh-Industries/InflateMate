export interface TaxCalculationRequest {
  selectedItems: {
    inventoryId: string;
    quantity: number;
    price: number;
  }[];
  customerAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  couponCode?: string | null;
}

export interface TaxCalculationResponse {
  success: boolean;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxRate: number; // Effective tax rate
  error?: string;
}

export async function calculateTaxForFrontend(
  businessId: string,
  payload: TaxCalculationRequest
): Promise<TaxCalculationResponse> {
  try {
    const response = await fetch(`/api/businesses/${businessId}/bookings/calculate-tax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Frontend tax calculation API error:", errorData);
      return {
        success: false,
        subtotalCents: 0,
        taxCents: 0,
        totalCents: 0,
        taxRate: 0,
        error: errorData.error || "Failed to calculate tax"
      };
    }

    const data: TaxCalculationResponse = await response.json();
    return { ...data, success: true };

  } catch (error) {
    console.error("Error in frontend tax calculation utility:", error);
    return {
      success: false,
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
      taxRate: 0,
      error: error instanceof Error ? error.message : "An unexpected error occurred during tax calculation."
    };
  }
}