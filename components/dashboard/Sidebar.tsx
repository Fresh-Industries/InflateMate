'use client';

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Users,
  Settings,
  CreditCard,
  BarChart,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const businessId = params.id as string;

  const sidebarItems: SidebarItem[] = [
    {
      title: "Overview",
      href: `/dashboard/${businessId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Inventory",
      href: `/dashboard/${businessId}/inventory`,
      icon: Package,
    },
    {
      title: "Bookings",
      href: `/dashboard/${businessId}/bookings`,
      icon: CalendarDays,
    },
    {
      title: "Customers",
      href: `/dashboard/${businessId}/customers`,
      icon: Users,
    },
    {
      title: "Analytics",
      href: `/dashboard/${businessId}/analytics`,
      icon: BarChart,
    },
    {
      title: "Payments",
      href: `/dashboard/${businessId}/payments`,
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: `/dashboard/${businessId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="h-full py-8 flex flex-col gap-4">
      <div className="px-6">
        <h2 className="text-lg font-semibold tracking-tight">InflateMate</h2>
        <p className="text-sm text-muted-foreground">
          Bounce House Management
        </p>
      </div>
      <nav className="space-y-1 px-3">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 