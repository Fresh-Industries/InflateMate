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
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
          <div className="absolute inset-3 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          InflateMate
        </h2>
        <p className="text-lg text-gray-600 animate-pulse">Setting up your account...</p>
      </div>
    </div>
  );
} 