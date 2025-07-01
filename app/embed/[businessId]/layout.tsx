import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { notFound } from 'next/navigation';

export default async function EmbedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  
  try {
    const business = await getBusinessForEmbed(businessId);
    
    return (
      <>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Auto-resize iframe communication
            function sendHeight() {
              const height = document.documentElement.scrollHeight;
              window.parent.postMessage({
                type: 'INFLATEMATE_RESIZE',
                height: height
              }, '*');
            }
            
            // Send height on load and resize
            window.addEventListener('load', sendHeight);
            window.addEventListener('resize', sendHeight);
            
            // MutationObserver for dynamic content changes
            const observer = new MutationObserver(sendHeight);
            document.addEventListener('DOMContentLoaded', () => {
              observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
              });
              
              // Initial height send
              setTimeout(sendHeight, 100);
            });
            
            // Send loaded message
            window.addEventListener('load', () => {
              window.parent.postMessage({
                type: 'INFLATEMATE_LOADED'
              }, '*');
            });
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              margin: 0; 
              padding: 0; 
              font-family: system-ui, -apple-system, sans-serif;
            }
            * { box-sizing: border-box; }
            
            /* Ensure content doesn't overflow */
            html, body {
              overflow-x: hidden;
              max-width: 100%;
            }
          `
        }} />
        {children}
      </>
    );
  } catch (error) {
    return notFound();
  }
} 