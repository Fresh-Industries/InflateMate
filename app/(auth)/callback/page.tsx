// app/callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
      console.log(data.subscription);
      // 1. unpaid and onboarded → pricing
      if (
        data.business &&
        (!data.subscription?.status ||
          !['active', 'trialing'].includes(data.subscription.status))
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
    <div className="w-full h-full bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Image
              src="/images/inflatemate-logo.PNG"
              alt="InflateMate"
              width={52}
              height={52}
              className="rounded-md"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inflate<span className="text-blue-600">Mate</span>
          </h1>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <div className="relative w-12 h-12 mx-auto">
            <motion.div
              className="absolute inset-0 border-4 border-gray-200 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Setting up your account
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your dashboard...
          </p>
        </motion.div>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex justify-center space-x-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
