'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SideBar from "./SideBar";
import Header from "./Header";

interface Business {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const businessId = params?.businessId as string;

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        if (!params.businessId) {
          const response = await fetch('/api/businesses');
          const businesses = await response.json();
          
          if (businesses.length > 0) {
            router.push(`/dashboard/${businesses[0].id}`);
          } else {
            router.push('/onboarding'); 
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

  return (
    <div className="min-h-screen flex bg-[#fafbff] overflow-hidden">
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
            <SideBar 
              onItemClick={() => setIsMobileOpen(false)}
              showLogo={false}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-30 bg-white shadow-sm border-r border-gray-100">
        <SideBar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative">
        <Header 
          currentBusiness={currentBusiness}
          isLoading={isLoading}
          businessId={businessId}
          onMobileMenuToggle={() => setIsMobileOpen(true)}
        />

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