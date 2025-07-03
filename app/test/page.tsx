'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [cacheBreaker, setCacheBreaker] = useState('');
  
  useEffect(() => {
    setCacheBreaker(Date.now().toString());
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">InflateMate Declarative Embed Test</h1>
      
      <div className="space-y-12">
        {/* Single Script Tag with cache busting */}
        {cacheBreaker && (
          <Script src={`/embed/embed.js?v=${cacheBreaker}`} strategy="lazyOnload" />
        )}
        
        {/* Booking Widget Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Booking Widget</h2>
          <div className="border border-gray-200 p-4 rounded-lg">
            <div 
              className="inflatemate-widget" 
              data-business-id="cmb5lnorg000bcvbcwbpxii0p"
              data-type="booking"
              data-theme="modern"
              data-primary-color="#FF6BB8"
            />
          </div>
        </div>

        {/* Inventory Widget Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Inventory Widget</h2>
          <div className="border border-gray-200 p-4 rounded-lg">
            <div 
              className="inflatemate-widget" 
              data-business-id="cmb5lnorg000bcvbcwbpxii0p"
              data-type="inventory"
              data-theme="modern"
              data-primary-color="#3b82f6"
            />
          </div>
        </div>

        {/* Popular Rentals Widget Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Rentals Widget</h2>
          <div className="border border-gray-200 p-4 rounded-lg">
            <div 
              className="inflatemate-widget" 
              data-business-id="cmb5lnorg000bcvbcwbpxii0p"
              data-type="popular-rentals"
              data-theme="playful"
              data-primary-color="#7c3aed"
              data-limit="4"
            />
          </div>
        </div>

        {/* Multiple Widgets - Same Type */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Multiple Booking Widgets (No Conflicts)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Widget 1 - Pink Theme</h3>
              <div 
                className="inflatemate-widget" 
                data-business-id="cmb5lnorg000bcvbcwbpxii0p"
                data-type="booking"
                data-theme="modern"
                data-primary-color="#FF6BB8"
              />
            </div>
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Widget 2 - Blue Theme</h3>
              <div 
                className="inflatemate-widget" 
                data-business-id="cmb5lnorg000bcvbcwbpxii0p"
                data-type="booking"
                data-theme="modern"
                data-primary-color="#3b82f6"
              />
            </div>
          </div>
        </div>

        {/* Test Dynamic Widget Addition */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Dynamic Widget Test</h2>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => {
              const container = document.getElementById('dynamic-container');
              if (container) {
                container.innerHTML = `
                  <div class="inflatemate-widget" 
                       data-business-id="cmb5lnorg000bcvbcwbpxii0p"
                       data-type="inventory"
                       data-theme="playful"
                       data-primary-color="#f97316">
                  </div>
                `;
              }
            }}
          >
            Add Dynamic Widget
          </button>
          <div id="dynamic-container" className="border border-gray-200 p-4 rounded-lg min-h-[200px]">
            <p className="text-gray-500 text-center">Click the button above to add a widget dynamically</p>
          </div>
        </div>

        {/* Event Listener Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Event Test Widget</h2>
          <div className="border border-gray-200 p-4 rounded-lg">
            <div 
              className="inflatemate-widget" 
              data-business-id="cmb5lnorg000bcvbcwbpxii0p"
              data-type="booking"
              data-theme="retro"
              data-primary-color="#dc2626"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Check console for event logs</p>
        </div>

        {/* Generated Code Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Code Example</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`<!-- InflateMate Widget -->
<script src="https://staging.inflatemate.co/embed/embed.js"></script>
<div class="inflatemate-widget" 
     data-business-id="cmb5lnorg000bcvbcwbpxii0p"
     data-type="booking"
     data-theme="modern"
     data-primary-color="#FF6BB8">
</div>`}
            </pre>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Add event listeners for testing
          document.addEventListener('inflatemate:loaded', function(e) {
            console.log('✅ Widget loaded successfully:', e.detail);
          });
          
          document.addEventListener('inflatemate:error', function(e) {
            console.error('❌ Widget error:', e.detail);
          });
        `
      }} />
    </div>
  );
} 