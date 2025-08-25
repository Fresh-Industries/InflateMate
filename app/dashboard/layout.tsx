import { NotificationsProvider } from "@/context/NotificationsContext";
import DashboardWrapper from "./_components/DashboardWrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { SupabaseProvider } from "@/context/SupabaseProvider";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SupabaseProvider>
      <NotificationsProvider>
        <DashboardWrapper>
          {children}
        </DashboardWrapper>
      </NotificationsProvider>
      </SupabaseProvider>
    </ClerkProvider>
  );
} 