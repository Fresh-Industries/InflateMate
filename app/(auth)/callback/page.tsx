'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses');
        if (!response.ok) {
          router.push('/onboarding');
          return;
        }
        
        const businesses = await response.json();
        
        if (businesses?.length > 0) {
          router.push(`/dashboard/${businesses[0].id}`);
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error in callback:', error);
        router.push('/onboarding');
      }
    };

    checkBusinesses();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
} 