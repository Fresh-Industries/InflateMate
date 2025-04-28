'use client'
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import {
  Calendar,
  Package,
  Users,
  Settings,
  Bell,
  Menu,
  Globe,
  Mail,
  Inbox,
  FileStack,
  Wallet,
  Building2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationsContext } from "@/context/NotificationsContext";
import dynamic from 'next/dynamic';

interface Business {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Dynamically import UserButton with SSR disabled
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false,
  loading: () => <Skeleton className="h-8 w-8 rounded-full" />
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const { notifications, dismiss } = useNotificationsContext();
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const businessId = params?.businessId as string;
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        if (!params.businessId) {
          // Fetch user's first business or redirect to business selection
          const response = await fetch('/api/businesses');
          const businesses = await response.json();
          
          if (businesses.length > 0) {
            router.push(`/dashboard/${businesses[0].id}`);
          } else {
            router.push('/onboarding'); // or wherever you want users without businesses to go
          }
          return;
        }

        setIsLoading(true);
        const response = await fetch(`/api/businesses/${params.businessId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch business details');
        }
        
        setCurrentBusiness(data);
      } catch (error) {
        console.error('Error fetching business details:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch business details",
          variant: "destructive",
        });
        setCurrentBusiness(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [params.businessId, router, toast]);

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
      title: "Messages",
      href: `/dashboard/${businessId}/messages`,
      icon: Inbox,
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

  const SidebarContent = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full flex-col bg-white", className)}>
      {/* Logo */}
      {
        !isMobileOpen && (
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
        )
      }

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-50/80 hover:text-blue-600"
              )}
              onClick={() => setIsMobileOpen(false)}
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
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#fafbff]  overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-white">
          <SheetHeader className="px-6 py-4 border-b border-gray-100">
            <SheetTitle>
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
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100vh-4.5rem)]">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-30 bg-white shadow-sm border-r border-gray-100">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative">
        {/* Top Bar refinement */}
        <header className="bg-white border-b border-gray-200/75 fixed top-0 right-0 left-0 lg:left-64 z-20 h-[68px] shadow-sm">
          <div className="flex h-full items-center gap-4 px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-full"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-col justify-center">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-48 mb-1.5" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  {/* Business name as a link to overview page */}
                  <Link
                    href={`/dashboard/${businessId}`}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-tight"
                  >
                    {currentBusiness?.name || 'Dashboard'}
                  </Link>
                  {currentBusiness && (
                    <p className="text-sm text-gray-500 leading-tight">
                      {currentBusiness.city}, {currentBusiness.state}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex-1" />

            {/* User controls in top bar */}
            <div className="flex items-center gap-5">
              {/* Notification button */}
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-full hover:bg-blue-100/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-500" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute right-16 top-14 w-96 max-h-[85vh] overflow-hidden bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
                <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
              </div>
              
              <div className="overflow-y-auto max-h-[60vh] divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Bell className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">No new notifications</p>
                    <p className="text-gray-400 text-sm text-center">We&apos;ll notify you when something arrives</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="group relative flex items-start gap-4 p-4 hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 mb-0.5">{n.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{n.description}</p>
                        
                      
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(n.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 absolute right-4 top-4 p-1 rounded-full hover:bg-white transition-all duration-200"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
                  <button 
                    onClick={() => notifications.forEach(n => dismiss(n.id))}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-1 rounded-lg hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}

              {/* User Button */}
              <div className="rounded-full transition-colors duration-200 hover:bg-blue-100/50 p-0.5">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-5 md:p-8 mt-[68px]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 