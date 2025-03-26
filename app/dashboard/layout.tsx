'use client'
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const businessId = params?.businessId as string;
  const router = useRouter();

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
    <div className={cn("flex h-full flex-col bg-[#f5f5ff]", className)}>
      {/* Logo */}
      {
        !isMobileOpen && (
          <div className="p-6">
            <Link href={`/`} className="flex items-center gap-2">
              <span className="font-bold text-xl text-[#5056e0]">Inflate<span className="text-[#7a44f0]">mate</span></span>
            </Link>
          </div>
        )
      }

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#5056e0] text-white shadow-md" 
                  : "text-gray-700 hover:bg-[#eeeeff] hover:text-[#5056e0]"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f9faff] overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-[#f5f5ff]">
          <SheetHeader className="px-6 py-4">
            <SheetTitle>
              <Link href={`/`} className="flex items-center gap-2">
                <span className="font-bold text-xl text-[#5056e0]">Inflate<span className="text-[#7a44f0]">mate</span></span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100vh-5rem)]">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-30 bg-[#f5f5ff] shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative">
        {/* Top Bar with matching color scheme */}
        <header className="bg-[#f5f5ff] border-b border-[#e5e5f0] fixed top-0 right-0 left-0 lg:left-64 z-20 h-16">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-700 hover:bg-[#eeeeff] hover:text-[#5056e0] rounded-full"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex flex-col">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  {/* Business name as a link to overview page */}
                  <Link 
                    href={`/dashboard/${businessId}`}
                    className="text-xl font-semibold text-gray-800 hover:text-[#5056e0] transition-colors"
                  >
                    {currentBusiness?.name || 'Dashboard'}
                  </Link>
                  {currentBusiness && (
                    <p className="text-sm text-gray-500">
                      {currentBusiness.city}, {currentBusiness.state}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex-1" />
            
            {/* User controls in top bar */}
            <div className="flex items-center gap-3">
              {/* Notification button */}
              <button 
                className="relative p-2 rounded-full hover:bg-[#eeeeff] transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#5056e0] text-[10px] font-medium text-white">
                  3
                </span>
              </button>
              
      
              
              {/* User Button */}
              <div className="hover:bg-[#eeeeff] rounded-full transition-all duration-200 p-1">
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-5 md:p-8 mt-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 