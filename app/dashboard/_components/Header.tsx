'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from 'next/dynamic';
import NotificationDropdown from "./NotificationDropdown";
import { useState } from "react";

interface Business {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface HeaderProps {
  currentBusiness: Business | null;
  isLoading: boolean;
  businessId: string;
  onMobileMenuToggle: () => void;
}

// Dynamically import UserButton with SSR disabled
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false,
  loading: () => <Skeleton className="h-8 w-8 rounded-full" />
});

export default function Header({ 
  currentBusiness, 
  isLoading, 
  businessId, 
  onMobileMenuToggle 
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200/75 fixed top-0 right-0 left-0 lg:left-64 z-20 h-[68px] shadow-sm">
      <div className="flex h-full items-center gap-4 px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-full"
          onClick={onMobileMenuToggle}
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
          <NotificationDropdown 
            isOpen={notifOpen}
            onToggle={() => setNotifOpen(!notifOpen)}
          />

          {/* User Button */}
          <div className="rounded-full transition-colors duration-200 hover:bg-blue-100/50 p-0.5">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{ elements: { avatarBox: "w-8 h-8" } }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
