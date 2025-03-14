import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const { businessId } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        // Get the active sales funnel
        const activeFunnel = await prisma.salesFunnel.findFirst({
          where: { 
            businessId: business.id,
            isActive: true 
          },
        });
        
        if (!activeFunnel) {
          throw new Error("No active sales funnel found");
        }
        
        // Get the business domain
        const customDomain = business.customDomain;
        const domain = customDomain || `${business.id}.inflatemate.com`;
        
        // Generate the embed script
        const embedScript = `
<!-- InflateMate Sales Funnel Popup -->
<script>
(function() {
  const businessId = "${business.id}";
  const scriptTag = document.currentScript;
  
  // Create container for the iframe
  const container = document.createElement('div');
  container.id = 'inflatemate-funnel-container';
  container.style.position = 'fixed';
  container.style.zIndex = '9999';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.width = '0';
  container.style.height = '0';
  container.style.overflow = 'hidden';
  container.style.transition = 'all 0.3s ease-in-out';
  document.body.appendChild(container);
  
  // Create and load the iframe
  const iframe = document.createElement('iframe');
  iframe.src = "https://${domain}/api/embed/funnel?businessId=" + businessId;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  container.appendChild(iframe);
  
  // Setup message listener for iframe communication
  window.addEventListener('message', function(event) {
    // Verify origin
    if (event.origin !== "https://${domain}") return;
    
    const data = event.data;
    
    if (data.type === 'SHOW_FUNNEL') {
      container.style.width = '350px';
      container.style.height = '500px';
      container.style.bottom = '20px';
      container.style.right = '20px';
    } else if (data.type === 'HIDE_FUNNEL') {
      container.style.width = '0';
      container.style.height = '0';
      container.style.bottom = '0';
      container.style.right = '0';
    } else if (data.type === 'RESIZE_FUNNEL') {
      if (data.height) {
        container.style.height = data.height + 'px';
      }
    }
  });
})();
</script>
<!-- End InflateMate Sales Funnel Popup -->
      `.trim();
        
        return embedScript;
      }
    );
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }
    
    return new NextResponse(result.data, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    console.error("Error generating embed script:", error);
    
    if (error instanceof Error && error.message === "No active sales funnel found") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate embed script" },
      { status: 500 }
    );
  }
} 