'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming your Button component handles variants
import { Menu, X, ArrowRight, Zap, LifeBuoy, Info, Mail, Rocket } from "lucide-react"; // Added more icons for relevant pages
import { useAuth } from "@clerk/nextjs";

// Map nav items to your sitemap structure
const navItems = [
  { label: "Features", href: "/features", icon: <Rocket className="w-4 h-4" /> }, // Using Rocket icon
  { label: "Pricing", href: "/pricing", icon: <Zap className="w-4 h-4" /> },
  { label: "Resources", href: "/resources", icon: <LifeBuoy className="w-4 h-4" /> }, // Blog Index
  { label: "About Us", href: "/about", icon: <Info className="w-4 h-4" /> },
  { label: "Contact", href: "/contact", icon: <Mail className="w-4 h-4" /> },
  // Add Testimonials link if you want it in the main nav
  // { label: "Testimonials", href: "/testimonials", icon: <Trophy className="w-4 h-4" /> },
  // Comparison pages are dynamic, usually not in the main nav
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard"); // Default/loading state
  const [loadingUserStatus, setLoadingUserStatus] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoaded: isClerkLoaded, userId } = useAuth();

  // Handle scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50); // Adjust scroll threshold
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user status for Dashboard link (Keeping your logic structure)
  useEffect(() => {
    async function fetchUserStatus() {
      if (!isClerkLoaded) { // Wait for Clerk to load first
         setLoadingUserStatus(false); // If Clerk isn't loaded, user isn't logged in
         return;
      }

      if (!userId) { // Clerk loaded, but no user ID (logged out)
         setLoadingUserStatus(false);
         // If user is not logged in, dashboard link should likely go to sign-in or homepage
         setDashboardHref("/sign-in");
         return;
      }

      // If user is logged in, fetch their specific status
      setLoadingUserStatus(true); // Start loading status if userId exists
      try {
        // Assume /api/me returns { business: { id: string } | null, subscription: { status: string } | null, orgId: string | null }
        const response = await fetch('/api/me'); // Your API endpoint
        if (response.ok) {
          const data = await response.json();
          if (!data.business) { // User exists but no business created
            setDashboardHref("/onboarding"); // Link to onboarding if no business
          } else if (
            !data.subscription?.status || // Business created but no active/trialing subscription
            !["active", "trialing"].includes(data.subscription.status)
          ) {
            setDashboardHref(`/pricing?orgId=${data.orgId || ''}`); // Link to pricing with orgId
          } else { // Onboarded and subscribed
            setDashboardHref(`/dashboard/${data.business.id}`); // Link to user's specific dashboard
          }
        } else {
           // Handle API errors (shouldn't happen if userId exists and API is protected, but good practice)
           console.error("Failed to fetch user status:", response.status);
           setDashboardHref("/dashboard"); // Fallback on API error
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
        setDashboardHref("/dashboard"); // Fallback on network errors etc.
      } finally {
        setLoadingUserStatus(false); // Done loading status
      }
    }

    fetchUserStatus(); // Call fetch status when Clerk loaded state or userId changes
  }, [isClerkLoaded, userId]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleNavLinkClick = () => setIsMenuOpen(false); // Close menu on link click

  // Show skeleton loading state until Clerk is loaded and user status is fetched
  const showAuthLoading = !isClerkLoaded || loadingUserStatus;


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-muted/40' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Standard container padding */}
        <div className="flex h-16 md:h-20 items-center justify-between"> {/* Standard navbar height */}
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
             {/* Simplified logo styling, relying on core gradient and image */}
             <Image
               src="/images/inflatemate-logo.PNG" // Ensure this path is correct and image exists
               alt="InflateMate Logo"
               width={40} // Adjusted size
               height={40} // Adjusted size
               className="object-contain"
             />
             <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
               InflateMate
             </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6"> {/* Standard spacing */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-text-light hover:text-primary transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
              >
                 {/* Removed icon from desktop nav links for cleaner look */}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {showAuthLoading ? (
              <div className="h-10 w-24 bg-muted/60 animate-pulse rounded-full"></div> // Loading skeleton
            ) : userId ? ( // Logged In
              <Link href={dashboardHref}>
                <Button
                   variant="outline" // Using outline for secondary action
                   className="h-10 px-5 rounded-full border border-muted hover:bg-muted/60 text-text-DEFAULT shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Dashboard
                </Button>
              </Link>
            ) : ( // Logged Out
              <>
                <Link href="/sign-in">
                  <Button
                     variant="ghost" // Using ghost for less emphasis
                     className="h-10 px-5 rounded-full hover:bg-muted/60 text-text-DEFAULT transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                   {/* Use the primary-gradient style - assuming Button component supports this variant */}
                  <Button
                     variant="primary-gradient" // Ensure you have this variant defined in your Button component
                     className="h-10 px-5 rounded-full shadow-md transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary" // Shadow on primary button
                  >
                    Get Started
                    {/* Use ArrowRight icon */}
                    <ArrowRight className="ml-2 w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md transition-colors hover:bg-muted/60 text-text-DEFAULT outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (slide-down panel) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 md:top-20 left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-muted/40 shadow-lg animate-in slide-in-from-top-8 duration-300 ease-out">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-text-DEFAULT hover:text-primary rounded-md hover:bg-muted/40 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                 {/* Icon on mobile nav links */}
                 <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                   {item.icon}
                 </div>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="border-t border-muted/60 pt-4 space-y-4">
              {showAuthLoading ? (
                <div className="h-12 bg-muted/60 animate-pulse rounded-md"></div> // Loading skeleton
              ) : userId ? (
                <Link href={dashboardHref}>
                  <Button
                     variant="outline"
                     className="w-full justify-center h-12 rounded-md border border-muted hover:bg-muted/60 text-text-DEFAULT shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
                     onClick={handleNavLinkClick}
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      className="w-full justify-center h-12 rounded-md hover:bg-muted/60 text-text-DEFAULT focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={handleNavLinkClick}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      variant="primary-gradient" // Ensure this variant is defined
                      className="w-full justify-center h-12 rounded-md shadow-md focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={handleNavLinkClick}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4 text-white" />
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
