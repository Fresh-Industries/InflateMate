import { OnboardingProvider } from "@/context/OnboardingContext";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 relative overflow-hidden">
      {/* Enhanced decorative elements that match onboarding design */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-100/20 to-transparent" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-200/30 to-indigo-200/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-indigo-200/40 to-violet-200/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-2xl animate-pulse" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </div>
    </OnboardingProvider>
  );
} 