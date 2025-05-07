import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";

const utapi = new UTApi();

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Apply an (optional) custom config:
  // config: { ... },
});

export async function DELETE(req: NextRequest) {
  try {
    // Authenticate the user
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the file key from the query parameters
    const url = new URL(req.url);
    const fileKey = url.searchParams.get("fileKey");

    if (!fileKey) {
      return NextResponse.json(
        { message: "File key is required" },
        { status: 400 }
      );
    }

    // Delete the file from UploadThing
    await utapi.deleteFiles(fileKey);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file from UploadThing:", error);
    return NextResponse.json(
      { message: "Failed to delete file" },
      { status: 500 }
    );
  }
}