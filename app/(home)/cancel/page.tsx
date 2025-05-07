// app/cancel/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Canceled</h1>
        <p className="text-gray-600">
          You&apos;ve canceled the checkout. No worries — you can restart your free trial at any time.
        </p>
        <Button
          onClick={() => router.replace('/pricing')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full"
        >
          Try Again
        </Button>
      </div>
    </main>
  );
}
