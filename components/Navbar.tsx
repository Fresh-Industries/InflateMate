'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Star, Zap, LifeBuoy } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface Business {
  id: string;
  name: string;
}

const navItems = [
  { 
    label: "Features", 
    href: "/features",
    icon: <Star className="w-4 h-4" />
  },
  { 
    label: "Pricing", 
    href: "/pricing",
    icon: <Zap className="w-4 h-4" />
  },
  { 
    label: "Resources", 
    href: "/resources",
    icon: <LifeBuoy className="w-4 h-4" />
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchUserBusinesses() {
      if (!userId) {
        setLoading(false);
        return;
      }

      console.log("Fetching user businesses for user:", userId);

      
      try {
        const response = await fetch('/api/businesses');
        if (response.ok) {
          const businesses = await response.json();
          setUserBusinesses(businesses);
        }
      } catch (error) {
        console.error("Error fetching user businesses:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchUserBusinesses();
    }
  }, [isLoaded, userId]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const isLoadingUser = !isLoaded || loading;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center">
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full opacity-80 group-hover:opacity-100 blur-md transition-all duration-300"></div>
              <div className="relative flex items-center">
                <Image
                  src="/images/inflatemate-logo.PNG"
                  alt="InflateMate Logo"
                  width={50}
                  height={50}
                />
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  InflateMate
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group flex items-center gap-2"
              >
                <div className="absolute inset-0 rounded-full transition-all duration-200 group-hover:bg-blue-50/80"></div>
                <span className="relative z-10">{item.label}</span>
                <span className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.icon}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoadingUser ? (
              <div className="h-10 w-24 bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse rounded-full"></div>
            ) : userId ? (
              <>
                <Link href={userBusinesses.length > 0 
                  ? `/dashboard/${userBusinesses[0].id}` 
                  : "/onboarding"}
                >
                  <Button variant="ghost" className="h-12 px-6 rounded-full hover:bg-blue-50 border border-blue-100/50 shadow-sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="h-12 px-6 rounded-full hover:bg-blue-50 border border-blue-100/50 shadow-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="h-12 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-transform duration-300 transform hover:scale-105">
                    Get Started
                    <ChevronDown className="ml-2 w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-90" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors shadow-sm"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-blue-600" />
              ) : (
                <Menu className="h-6 w-6 text-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-blue-100 shadow-lg">
          <div className="container mx-auto px-4 py-6 space-y-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50/80 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="border-t border-blue-100 pt-5 space-y-4">
              {isLoadingUser ? (
                <div className="h-14 bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse rounded-xl"></div>
              ) : userId ? (
                <Link href={userBusinesses.length > 0 
                  ? `/dashboard/${userBusinesses[0].id}` 
                  : "/onboarding"}
                >
                  <Button variant="ghost" className="w-full justify-center h-14 rounded-xl border border-blue-100 shadow-sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="w-full justify-center h-14 rounded-xl border border-blue-100 shadow-sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="w-full justify-center h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      Get Started
                      <ChevronDown className="ml-2 w-4 h-4 text-white" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
