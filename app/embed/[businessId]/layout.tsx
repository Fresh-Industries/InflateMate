// app/embed/[businessId]/layout.tsx
import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { notFound } from 'next/navigation';
import Script from 'next/script';

export default async function EmbedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  
  try {
    await getBusinessForEmbed(businessId);
    
    return (
      <>
        <Script src="/embed-resize.js" strategy="beforeInteractive" />
        <style suppressHydrationWarning>
          {`
            html, body { 
              margin: 0; 
              padding: 0; 
              font-family: system-ui, -apple-system, sans-serif;
              overflow-x: hidden;
              width: 100%;
              height: auto;
              background: transparent !important;
              background-color: transparent !important;
            }
            
            * { 
              box-sizing: border-box; 
            }
            
            /* Simple, stable layout */
            #__next {
              width: 100%;
              height: auto;
              overflow-x: hidden;
              background: transparent !important;
            }
            
            /* Prevent layout shifts */
            .container {
              width: 100%;
              max-width: 100%;
            }
            
            /* Ensure complete transparency for sales funnel embeds */
            body, html, #__next, main {
              background: transparent !important;
              background-color: transparent !important;
            }
          `}
        </style>
        {children}
      </>
    );
  } catch {
    return notFound();
  }
} 