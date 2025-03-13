'use client'
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
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
  Users2,
  Building2,
  BarChart3,
  Inbox,
  FileStack,
  Wallet,
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
      title: "Employees", 
      href: `/dashboard/${businessId}/employees`,
      icon: Users2,
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
    <div className={cn("flex h-full flex-col", className)}>
      {/* Logo */}
      {
        !isMobileOpen && (
          <div className="border-b p-6">
            <Link href={`/`} className="flex items-center gap-2">
              <span className="font-bold text-xl">InflateMate</span>
            </Link>
          </div>
        )
      }
      
      

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Controls */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <UserButton />
          <ModeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-[300px]">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>
          <Link href={`/`} className="flex items-center gap-2">
            <span className="font-bold text-xl">InflateMate</span>
          </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100vh-5rem)]">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block w-64 border-r bg-card">
        <SidebarContent />
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center gap-4 px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {isLoading ? 'Loading...' : currentBusiness?.name || 'Dashboard'}
              </h1>
              {currentBusiness && (
                <p className="text-sm text-muted-foreground">
                  {currentBusiness.city}, {currentBusiness.state}
                </p>
              )}
            </div>
            <div className="flex-1" />
            <button className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 