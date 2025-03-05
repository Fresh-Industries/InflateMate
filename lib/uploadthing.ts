"use client";

import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// These should only ever be imported/used in a client environment
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

/**
 * Deletes a file from UploadThing using the file key
 * @param fileKey The key of the file to delete (usually the last part of the URL)
 * @returns Promise that resolves when the file is deleted
 */
export async function deleteUploadThingFile(fileKey: string): Promise<void> {
  try {
    const response = await fetch(`/api/uploadthing?fileKey=${fileKey}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete file: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting file from UploadThing:", error);
    throw error;
  }
}