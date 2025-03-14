'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, PartyPopper, Star, Sparkles, Gift } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useAuth, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface Business {
  id: string;
  name: string;
}

const navItems = [
  { label: "Bounce Features", href: "/features", icon: <Star className="w-4 h-4" /> },
  { label: "Party Pricing", href: "/pricing", icon: <Gift className="w-4 h-4" /> },
  { label: "Fun Resources", href: "/resources", icon: <Sparkles className="w-4 h-4" /> },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchUserBusinesses() {
      if (!userId) {
        setLoading(false);
        return;
      }
      
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

  // Wait until Clerk has loaded
  const isLoadingUser = !isLoaded || loading;

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-md shadow-md" 
        : "bg-gradient-to-r from-blue-50 to-purple-50"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
              <span className="inline-block animate-bounce">🎈</span> Inflatemate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-full text-gray-700 hover:text-blue-600 font-medium group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity rounded-full -z-0"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoadingUser ? (
              <div className="h-10 w-20 bg-blue-100 animate-pulse rounded-full"></div>
            ) : userId ? (
              <>
                <Link href={userBusinesses.length > 0 
                  ? `/dashboard/${userBusinesses[0].id}` 
                  : "/onboarding"}>
                  <Button variant="ghost" className="rounded-full px-5 hover:bg-blue-100 hover:text-blue-600 transition-all">
                    <PartyPopper className="w-4 h-4 mr-2" /> Your Dashboard
                  </Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="rounded-full px-5 hover:bg-blue-100 hover:text-blue-600 transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                    Start Bouncing Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-gradient-to-b from-blue-50 to-purple-50 border-t border-blue-100 shadow-lg rounded-b-3xl mx-2">
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors px-4 py-3 rounded-xl hover:bg-white/60"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="border-t border-blue-100 pt-4 space-y-4">
                  {isLoadingUser ? (
                    <div className="h-12 w-full bg-blue-100 animate-pulse rounded-full"></div>
                  ) : (
                    <Link href={userId ? (userBusinesses.length > 0 
                      ? `/dashboard/${userBusinesses[0].id}` 
                      : "/onboarding") : "/sign-in"}>
                      <Button variant="ghost" className="w-full justify-center rounded-full hover:bg-blue-100">
                        {userId ? "Your Dashboard" : "Sign In"}
                      </Button>
                    </Link>
                  )}
                  <Link href="/sign-up">
                    <Button className="w-full justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md">
                      Start Bouncing Free
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
