// app/(home)/pricing/page.tsx
// Keep this as a Server Component

import { Suspense } from 'react';
import PricingClient from '../_components/pricing-client'; // Import the new client component

// Optional: Define a loading component
function PricingSkeleton() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Simplified loading state */}
          <div className="h-8 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        <div className="max-w-lg mx-auto">
          <div className="h-[600px] w-full bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingSkeleton />}>
      {/* 
        Pass searchParams as props if needed by the client component, 
        but here PricingClient uses useSearchParams() directly. 
        So we just render it inside Suspense.
       */}
      <PricingClient />
    </Suspense>
  );
}
