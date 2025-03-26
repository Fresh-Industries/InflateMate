import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Add a helper function to create a UTC date
export const createLocalDate = (dateString: string) => {
  // Split the date string (format: YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number);
  // Note: month is 0-indexed in JavaScript Date constructor
  return new Date(year, month - 1, day);
};

export const createLocalDateTime = (dateString: string, timeString: string) => {
  // Split the date string (format: YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number);
  // Split the time string (format: HH:MM)
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};


