'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses');
        if (!response.ok) throw new Error('Failed to fetch businesses');
        
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

  return <div>Loading...</div>;
} 