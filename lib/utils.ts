import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
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


