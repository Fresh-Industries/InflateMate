// app/(home)/pricing/page.tsx
// Keep this as a Server Component

import { Suspense } from 'react';
import PricingList from '../_components/PricingList';
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl font-bold mb-6">One Simple Pricing for Everyone</h2>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          No hidden fees, no complicated tiers—just the features you need.
        </p>
      </div>

      <Suspense fallback={<PricingSkeleton />}>
        <PricingList />
      </Suspense>
    </section>
  );
}
