'use client';

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import {
  Calendar,
  Package,
  Users,
  Settings,
  Mail,
  FileStack,
  Wallet,
  Building2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SideBarProps {
  className?: string;
  onItemClick?: () => void;
  showLogo?: boolean;
}

// Dynamically import OrganizationSwitcher with SSR disabled
const OrganizationSwitcher = dynamic(
  () => import("@clerk/nextjs").then(mod => mod.OrganizationSwitcher),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-10 w-full" />
  }
);

export default function SideBar({ className, onItemClick, showLogo = true }: SideBarProps) {
  const params = useParams();
  const pathname = usePathname();
  const businessId = params?.businessId as string;

  const sidebarItems: SidebarItem[] = [
    {
      title: "Overview",
      href: `/dashboard/${businessId}`,
      icon: Building2,
    },
    {
      title: "Bookings",
      href: `/dashboard/${businessId}/bookings`,
      icon: Calendar,
    },
    {
      title: "Inventory",
      href: `/dashboard/${businessId}/inventory`,
      icon: Package,
    },
    {
      title: "Customers",
      href: `/dashboard/${businessId}/customers`,
      icon: Users,
    },
    {
      title: "Documents",
      href: `/dashboard/${businessId}/documents`,
      icon: FileStack,
    },
    {
      title: "Payments",
      href: `/dashboard/${businessId}/payments`,
      icon: Wallet,
    },
    {
      title: "Marketing",
      href: `/dashboard/${businessId}/marketing`,
      icon: Mail,
    },
    {
      title: "Website",
      href: `/dashboard/${businessId}/website`,
      icon: Globe,
    },
    {
      title: "Settings",
      href: `/dashboard/${businessId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className={cn("flex h-full flex-col bg-white", className)}>
      {/* Logo */}
      {showLogo && (
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full opacity-80 group-hover:opacity-100 blur-md transition-all duration-300"></div>
              <div className="relative flex items-center">
                <Image
                  src="/images/inflatemate-logo.PNG"
                  alt="InflateMate Logo"
                  width={35}
                  height={35}
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-1">
                  InflateMate
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-4">
        {sidebarItems.map((item) => {
          const href = businessId ? item.href : '#';
          const isActive = businessId ? pathname === item.href : false;
          
          return (
            <Link
              key={item.title}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-50/80 hover:text-blue-600",
                !businessId && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                if (!businessId) {
                  e.preventDefault();
                } else {
                  onItemClick?.();
                }
              }}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
               )} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Organization Switcher Section */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <OrganizationSwitcher 
          hidePersonal={true}
          appearance={{ 
            elements: { 
              avatarBox: "w-8 h-8",
              organizationSwitcherTrigger: "w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors",
              organizationPreviewTextContainer: "text-sm",
              organizationSwitcherPopoverCard: "shadow-lg border border-gray-100 rounded-xl",
              organizationSwitcherPopoverActionButton: "text-blue-600 hover:text-blue-700",
              organizationSwitcherPopoverActionButtonIcon: "text-blue-500"
            } 
          }} 
        />
      </div>
    </div>
  );
}
