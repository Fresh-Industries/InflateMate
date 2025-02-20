import Providers from "./components/providers";
import { Toaster } from "@/components/ui/toaster";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  );
} 