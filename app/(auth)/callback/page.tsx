// app/callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function CallbackPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.replace('/sign-in');
      return;
    }

    (async () => {
      const res = await fetch('/api/me');
      
      const data = await res.json();
      console.log(data);
      console.log(data.subscription)
      // 1. unpaid and onboarded → pricing
      if (
        data.business &&
        (!data.subscription?.status || !['active', 'trialing'].includes(data.subscription.status))
      ) {
        router.replace(`/pricing?orgId=${data.orgId}`);
        return;
      }

      // 2. not onboarded → onboarding
      if (!data.business) {
        router.replace('/onboarding');
        return;
      }

      // 3. paid & onboarded → dashboard
      router.replace(`/dashboard/${data.business.id}`);

      
    })();
  }, [isLoaded, userId, router]);
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