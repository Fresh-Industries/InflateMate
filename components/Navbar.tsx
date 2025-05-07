/* components/Navbar.tsx */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  X as XIcon,
  ChevronDown,
  Rocket,
  Zap,
  LifeBuoy,
  Info,
  Mail,
  Book,
  Video,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";



const FEATURES = [
  {
    name: 'Smart Booking',
    href: '/features/booking',
    icon: <Rocket className="size-4" />,
  },
  {
    name: 'Waivers & Receipts',
    href: '/features/waivers',
    icon: <LifeBuoy className="size-4" />,
  },
  { name: 'CRM', href: '/features/crm', icon: <Info className="size-4" /> },
  {
    name: 'Website Builder',
    href: '/features/website-builder',
    icon: <Zap className="size-4" />,
  },
  {
    name: 'Invoicing',
    href: '/features/invoicing',
    icon: <Rocket className="size-4" />,
  },
  {
    name: 'SMS Communication',
    href: '/features/sms',
    icon: <Mail className="size-4" />,
  },
];



const RESOURCES = [
  {
    name: 'Blog',
    href: '/resources/blog',
    icon: <Book className="size-4" />,
  },
  {
    name: 'Tutorials',
    href: '/resources/tutorials',
    icon: <Video className="size-4" />,
  },
  {
    name: 'Feature Requests',
    href: '/resources/feature-requests',
    icon: <Lightbulb className="size-4" />,
  }
];

const MAIN_LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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

  // Close mobile menu when navigating to a new page
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
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const showAuthLoading = !isLoaded || loadingUserStatus;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/inflatemate-logo.PNG"
              alt="InflateMate"
              width={52}
              height={52}
              className="rounded-md"
              priority
            />
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              Inflate<span className="text-primary">Mate</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Features dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              ref={dropdownRef}
            >
              <button
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Features{" "}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    dropdownOpen && "transform rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 mt-3 w-56 rounded-md border border-border bg-card shadow-lg"
                    role="menu"
                  >
                    {FEATURES.map((f) => (
                      <Link
                        key={f.href}
                        href={f.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent/10"
                        role="menuitem"
                      >
                        {f.icon}
                        {f.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
              ref={resourcesDropdownRef}
            >
              <button
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                aria-expanded={resourcesDropdownOpen}
                aria-haspopup="true"
              >
                Resources{" "}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    resourcesDropdownOpen && "transform rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {resourcesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 mt-3 w-56 rounded-md border border-border bg-card shadow-lg"
                    role="menu"
                  >
                    {RESOURCES.map((f) => (
                      <Link
                        key={f.href}
                        href={f.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent/10"
                        role="menuitem"
                      >
                        {f.icon}
                        {f.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Static links */}
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {showAuthLoading ? (
              <div className="h-10 w-24 bg-muted/60 animate-pulse rounded-full"></div>
            ) : userId ? (
              <Link href={dashboardHref || ""}>
                <Button
                  variant="outline"
                  className="h-10 px-5 rounded-full border border-muted hover:bg-muted/60 text-text-DEFAULT shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/waitlist">
                  <Button variant="outline" size="sm">
                    Join Waitlist
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon />
          </Button>
        </div>
      </header>

      {/* Mobile menu - completely separated from header */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div 
            className="ml-auto relative h-full w-[280px] max-w-[90vw] bg-white dark:bg-gray-900 shadow-lg overflow-hidden flex flex-col"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
              <button
                type="button"
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              {/* Features group */}
              <div className="mb-6">
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Features
                </h3>
                <nav className="space-y-1">
                  {FEATURES.map((f) => (
                    <Link
                      key={f.href}
                      href={f.href}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {f.icon}
                      {f.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Resources group */}
              <div className="mb-6">
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Resources
                </h3>
                <nav className="space-y-1">
                  {RESOURCES.map((f) => (
                    <Link
                      key={f.href}
                      href={f.href}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {f.icon}
                      {f.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Pages group */}
              <div>
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Pages
                </h3>
                <nav className="space-y-1">
                  {MAIN_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {showAuthLoading ? (
                <div className="h-10 w-24 bg-muted/60 animate-pulse rounded-full"></div>
              ) : userId ? (
                <Link href={dashboardHref || ""}>
                  <Button
                    variant="outline"
                    className="w-full justify-center bg-white dark:bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="block w-full">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center bg-white dark:bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/waitlist" className="block w-full">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center bg-white dark:bg-transparent"
                    >
                      Join Waitlist
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 