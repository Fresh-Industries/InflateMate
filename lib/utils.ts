import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export class FileEsque extends Blob {
  name: string;
  lastModified: number;
  customId?: string | null;

  constructor(parts: BlobPart[], filename: string, options?: BlobPropertyBag) {
    super(parts, options);
    this.name = filename;
    this.lastModified = Date.now();
    this.customId = null; // optional, if needed
  }
}

export const dateOnlyUTC = (d:string)=> new Date(`${d}T00:00:00Z`);
export const localToUTC  = (d:string,t:string,tz:string)=> fromZonedTime(`${d}T${t}:00`, tz);
export const utcToLocal  = (dt:Date,tz:string,f='Pp')=> format(toZonedTime(dt,tz),f);

export function formatDateToYYYYMMDD(dateValue: string): string {
  try {
    // If the value already matches the pattern, return it.
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    // If dateValue is empty or invalid, return today's date
    if (!dateValue || dateValue === 'Invalid Date') {
      return format(new Date(), "yyyy-MM-dd");
    }

    // Try to parse the date
    const dateObj = parseISO(dateValue);
    
    // Check if the parsed date is valid
    if (isNaN(dateObj.getTime())) {
      return format(new Date(), "yyyy-MM-dd");
    }

    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date:", error);
    // Return today's date as fallback
    return format(new Date(), "yyyy-MM-dd");
  }
}

export function formatTimeToHHMM(timeValue: string): string {
  try {
    // If the value is already in "HH:mm" format, return it.
    if (/^\d\d:\d\d$/.test(timeValue)) {
      return timeValue;
    }
    const dateObj = parseISO(timeValue);
    return format(dateObj, "HH:mm");
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
}



