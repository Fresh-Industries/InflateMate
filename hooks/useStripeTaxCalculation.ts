// Placeholder hook to prevent import errors
// Tax calculation is now handled in CustomerInfo step

export function useStripeTaxCalculation() {
  return {
    rawResponse: null,
    isLoading: false,
    error: null,
    subtotalCents: 0,
    taxCents: 0,
    totalCents: 0,
    taxRate: 0,
    success: false,
  };
}