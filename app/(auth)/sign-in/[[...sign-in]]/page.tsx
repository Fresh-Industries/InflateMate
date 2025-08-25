"use client"
import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      
        <SignIn 
          fallbackRedirectUrl="/callback" 
          signUpFallbackRedirectUrl="/sign-up"
          waitlistUrl='/waitlist'
          signUpUrl='/sign-up'
          forceRedirectUrl={process.env.NEXT_PUBLIC_API_HOST + '/callback'}
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary text-primary-foreground rounded-full px-8 py-3 font-medium shadow-lg hover:scale-105 transform transition-all duration-300 hover:shadow-xl',
              card: 'rounded-2xl border border-border bg-card shadow-2xl p-8',
              headerTitle: 'text-3xl font-bold text-foreground mb-6',
              formFieldInput: 'rounded-xl border-2 border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200',
              formFieldLabel: 'text-foreground font-medium mb-2',
              footer: 'text-muted-foreground text-center',
              dividerLine: 'bg-border h-px',
              dividerText: 'text-muted-foreground bg-background px-4',
              socialButtonsBlockButton: 'border-2 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl px-4 py-3 transition-all duration-200',
              socialButtonsBlockButtonText: 'font-medium',
              formFieldSuccessText: 'text-teal-600',
              formFieldErrorText: 'text-red-500',
              identityPreviewText: 'text-muted-foreground',
              identityPreviewEditButton: 'text-primary hover:text-primary/80',
              footerActionLink: 'text-primary hover:text-primary/80 font-medium'
            },
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--background))',
              colorInputBackground: 'hsl(var(--background))',
              colorInputText: 'hsl(var(--foreground))',
              borderRadius: '1rem'
            }
          }}
        />
    </div>
  );
}
