import { ClerkProvider } from "@clerk/nextjs";
import { SupabaseProvider } from "@/context/SupabaseProvider";

export function Providers({ children }: { children: React.ReactNode }) {

    
  return (
    <ClerkProvider>
        <SupabaseProvider>
        {children}
        </SupabaseProvider>
    </ClerkProvider>
  );
} 