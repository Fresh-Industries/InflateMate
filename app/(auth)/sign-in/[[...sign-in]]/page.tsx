"use client"
import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="flex min-w-screen justify-center my-[5rem]">
      <SignIn fallbackRedirectUrl="/dashboard/" signUpFallbackRedirectUrl="/sign-up" />
    </div>
  );
}
