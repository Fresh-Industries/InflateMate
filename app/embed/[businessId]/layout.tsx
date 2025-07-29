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
      <div className="im-embed">
        <Script src="/embed-resize.js" strategy="beforeInteractive" />
        <style suppressHydrationWarning>
          {`
            .im-embed { 
              margin: 0; 
              padding: 0; 
              font-family: system-ui, -apple-system, sans-serif;
              overflow-x: hidden;
              width: 100%;
              height: auto;
              background: transparent !important;
              background-color: transparent !important;
            }
            
            .im-embed * { 
              box-sizing: border-box; 
            }
            
            /* Simple, stable layout */
            .im-embed #__next {
              width: 100%;
              height: auto;
              overflow-x: hidden;
              background: transparent !important;
            }
            
            /* Essential utility classes */
            .im-embed .flex { display: flex; }
            .im-embed .items-center { align-items: center; }
            .im-embed .justify-between { justify-content: space-between; }
            .im-embed .justify-center { justify-content: center; }
            .im-embed .flex-col { flex-direction: column; }
            .im-embed .w-full { width: 100%; }
            .im-embed .h-full { height: 100%; }
            .im-embed .w-8 { width: 2rem; }
            .im-embed .h-8 { height: 2rem; }
            .im-embed .w-6 { width: 1.5rem; }
            .im-embed .h-6 { height: 1.5rem; }
            .im-embed .w-5 { width: 1.25rem; }
            .im-embed .h-5 { height: 1.25rem; }
            .im-embed .h-4 { height: 1rem; }
            .im-embed .h-14 { height: 3.5rem; }
            .im-embed .overflow-hidden { overflow: hidden; }
            .im-embed .overflow-y-auto { overflow-y: auto; }
            .im-embed .relative { position: relative; }
            .im-embed .fixed { position: fixed; }
            .im-embed .absolute { position: absolute; }
            .im-embed .bottom-0 { bottom: 0; }
            .im-embed .left-0 { left: 0; }
            .im-embed .z-50 { z-index: 50; }
            .im-embed .rounded-xl { border-radius: 0.75rem; }
            .im-embed .rounded-full { border-radius: 9999px; }
            .im-embed .rounded-lg { border-radius: 0.5rem; }
            .im-embed .aspect-square { aspect-ratio: 1 / 1; }
            .im-embed .p-8 { padding: 2rem; }
            .im-embed .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .im-embed .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .im-embed .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .im-embed .pl-4 { padding-left: 1rem; }
            .im-embed .pr-5 { padding-right: 1.25rem; }
            .im-embed .mb-6 { margin-bottom: 1.5rem; }
            .im-embed .mb-4 { margin-bottom: 1rem; }
            .im-embed .mb-3 { margin-bottom: 0.75rem; }
            .im-embed .mb-7 { margin-bottom: 1.75rem; }
            .im-embed .gap-3 { gap: 0.75rem; }
            .im-embed .gap-2 { gap: 0.5rem; }
            .im-embed .space-y-3 > * + * { margin-top: 0.75rem; }
            .im-embed .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .im-embed .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .im-embed .text-base { font-size: 1rem; line-height: 1.5rem; }
            .im-embed .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .im-embed .font-bold { font-weight: 700; }
            .im-embed .font-semibold { font-weight: 600; }
            .im-embed .leading-relaxed { line-height: 1.625; }
            .im-embed .text-center { text-align: center; }
            .im-embed .whitespace-nowrap { white-space: nowrap; }
            .im-embed .pointer-events-none { pointer-events: none; }
            .im-embed .pointer-events-auto { pointer-events: auto; }
            .im-embed .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .im-embed .transition-colors { transition-property: color, background-color, border-color; transition-duration: 150ms; }
            .im-embed .bg-white { background-color: #ffffff; }
            .im-embed .bg-opacity-20 { background-color: rgba(255, 255, 255, 0.2); }
            .im-embed .hover\\:bg-white\\/10:hover { background-color: rgba(255, 255, 255, 0.1); }
            .im-embed .max-h-\\[80vh\\] { max-height: 80vh; }
            
            /* Sales funnel specific styling */
            .im-embed [data-popup="true"] {
              width: auto !important;
              max-width: min(600px, 95vw) !important;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            
            .im-embed [class*="w-[600px]"] { width: 600px !important; }
            .im-embed [class*="max-w-[95vw]"] { max-width: 95vw !important; }
            
            /* Responsive utilities */
            .im-embed .md\\:flex-row { flex-direction: column; }
            .im-embed .md\\:w-2\\/5 { width: 100%; }
            .im-embed .md\\:w-3\\/5 { width: 100%; }
            .im-embed .md\\:w-1\\/3 { width: 100%; }
            .im-embed .md\\:w-2\\/3 { width: 100%; }
            .im-embed .md\\:w-1\\/4 { width: 100%; }
            .im-embed .md\\:w-3\\/4 { width: 100%; }
            .im-embed .md\\:mb-0 { margin-bottom: 1.5rem; }
            .im-embed .md\\:gap-10 { gap: 0.75rem; }
            .im-embed .md\\:aspect-auto { aspect-ratio: 1 / 1; }
            .im-embed .md\\:h-full { height: auto; }
            
            @media (min-width: 768px) {
              .im-embed .md\\:flex-row { flex-direction: row; }
              .im-embed .md\\:w-2\\/5 { width: 40%; }
              .im-embed .md\\:w-3\\/5 { width: 60%; }
              .im-embed .md\\:w-1\\/3 { width: 33.333333%; }
              .im-embed .md\\:w-2\\/3 { width: 66.666667%; }
              .im-embed .md\\:w-1\\/4 { width: 25%; }
              .im-embed .md\\:w-3\\/4 { width: 75%; }
              .im-embed .md\\:mb-0 { margin-bottom: 0; }
              .im-embed .md\\:gap-10 { gap: 2.5rem; }
              .im-embed .md\\:aspect-auto { aspect-ratio: auto; }
              .im-embed .md\\:h-full { height: 100%; }
            }
            
            /* Ensure proper text rendering */
            .im-embed [data-popup="true"] * {
              font-family: inherit !important;
              line-height: 1.5 !important;
            }
            
            /* Fix button styling */
            .im-embed button {
              font-family: inherit !important;
              cursor: pointer !important;
            }
            
            /* Ensure images render properly */
            .im-embed img {
              max-width: 100% !important;
              height: auto !important;
            }
          `}
        </style>
          {children}
        </div>
    );
  } catch {
    return notFound();
  }
} 