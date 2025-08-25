'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";

const MAIN_LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const [dashboardHref, setDashboardHref] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUserStatus() {
      if (!isLoaded || !isSignedIn) {
        setLoadingUserStatus(false);
        setDashboardHref("/sign-in");
        return;
      }

      setLoadingUserStatus(true);
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          if (!data.business) {
            setDashboardHref("/onboarding");
          } else if (
            !data.subscription?.status ||
            !["active", "trialing"].includes(data.subscription.status)
          ) {
            setDashboardHref(`/pricing?orgId=${data.orgId || ''}`);
          } else {
            setDashboardHref(`/dashboard/${data.business.id}`);
          }
        } else {
          console.error("Failed to fetch user status:", response.status);
          setDashboardHref("/sign-in");
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
        setDashboardHref("/sign-in");
      } finally {
        setLoadingUserStatus(false);
      }
    }

    fetchUserStatus();
  }, [isLoaded, isSignedIn]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Header shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const showAuthLoading = !isLoaded || loadingUserStatus;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-200',
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200'
            : 'bg-white/80 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/public/images/inflatemate-Navbar.PNG"
              alt="InflateMate"
              width={900}
              height={300}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {showAuthLoading ? (
              <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-full" />
            ) : userId ? (
              <Button asChild variant="default" brand="indigo" size="sm">
                <Link href={dashboardHref || ""}>Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" brand="slate" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="default" brand="indigo" size="sm">
                  <Link href="/waitlist">Join Waitlist</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl md:hidden">
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
              <span className="font-semibold text-slate-900">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="p-2"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-4 py-6 space-y-6">
              {/* Navigation Links */}
              <nav className="space-y-4">
                {MAIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-slate-600 hover:text-slate-900 font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div className="space-y-3 pt-6 border-t border-slate-200">
                {showAuthLoading ? (
                  <div className="h-10 w-full bg-slate-200 animate-pulse rounded-full" />
                ) : userId ? (
                  <Button asChild variant="default" brand="indigo" className="w-full">
                    <Link href={dashboardHref || ""}>Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" brand="slate" className="w-full">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild variant="default" brand="indigo" className="w-full">
                      <Link href="/waitlist">Join Waitlist</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}