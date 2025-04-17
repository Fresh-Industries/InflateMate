'use client';


import { ClerkProvider } from "@clerk/nextjs";
import { NotificationsProvider } from "@/context/NotificationsContext";

export function Providers({ children }: { children: React.ReactNode }) {

    
  return (
    <ClerkProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </ClerkProvider>
  );
} 