import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getCurrentUser } from "@/lib/auth/clerk-utils";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await getCurrentUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Return metadata to be stored with the file
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url:", file.url);

      // Return data relevant to the upload
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  
    videoUploader: f({
      video: {
        /**
         * For full list of options and defaults, see the File Route API reference
         * @see https://docs.uploadthing.com/file-routes#route-config
         */
        maxFileSize: "16MB",
        maxFileCount: 1,
      },
    })
      // Set permissions and file types for this FileRoute
      .middleware(async () => {
        // This code runs on your server before upload
        const user = await getCurrentUser();
  
        // If you throw, the user will not be able to upload
        if (!user) throw new Error("Unauthorized");
  
        // Return metadata to be stored with the file
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url:", file.url);
  
        // Return data relevant to the upload
        return { uploadedBy: metadata.userId, url: file.url };
      }),
  // Business logo uploader with different settings
  logoUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Logo upload complete for userId:", metadata.userId);
      console.log("Logo file url:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // PDF document uploader for waivers and other documents
  documentUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete for userId:", metadata.userId);
      console.log("Document file url:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
