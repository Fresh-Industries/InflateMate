"use client"

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center max-w-md mx-auto">

                <SignUp 
                    fallbackRedirectUrl="/callback" 
                    forceRedirectUrl={process.env.NEXT_PUBLIC_API_HOST + '/callback'}
                    signInFallbackRedirectUrl="/sign-in"
                    waitlistUrl='/waitlist'
                    signInUrl="/sign-in"
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 rounded-full',
                            card: 'rounded-xl border-none shadow-none',
                            headerTitle: 'text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent',
                            formFieldInput: 'rounded-lg border-gray-200 focus:border-purple-400 focus:ring-purple-400',
                            footer: 'text-gray-500',
                            dividerLine: 'bg-gradient-to-r from-transparent via-gray-300 to-transparent',
                            dividerText: 'text-gray-400'
                        }
                    }}
                />
        </div>
    );
}