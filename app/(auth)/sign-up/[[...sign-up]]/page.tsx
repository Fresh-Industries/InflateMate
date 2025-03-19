"use client"

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="mb-8 animate-float">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    InflateMate
                </h1>
                <p className="text-center text-gray-600 mt-2">Create your bounce house business account</p>
            </div>
                <SignUp 
                    fallbackRedirectUrl="/callback" 
                    signInFallbackRedirectUrl="/sign-in"
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all',
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