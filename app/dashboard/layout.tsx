import { NotificationsProvider } from "@/context/NotificationsContext";
import DashboardWrapper from "./_components/DashboardWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </NotificationsProvider>
  );
} 