'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Package, Calendar, Info, Phone, ChevronRight, MapPin, Mail, PartyPopper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SalesFunnel, SalesFunnelPopup } from '@/components/tenant/SalesFunnel';

interface Business {
  id: string;
  name: string;
  logo?: string;
  [key: string]: unknown;
}

interface SiteConfig {
  colors?: {
    primary?: string;
    secondary?: string;
  };
  [key: string]: unknown;
}

interface DomainLayoutClientProps {
  children: ReactNode;
  business: Business;
  domain: string;
  siteConfig: SiteConfig;
  colors: {
    primary?: string;
    secondary?: string;
  };
  activeFunnel?: SalesFunnel;
}

export function DomainLayoutClient({ 
  children, 
  business, 
  siteConfig,
  colors,
  activeFunnel
}: DomainLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Set default colors if not provided
  const primaryColor = colors.primary || "#3b82f6";
  const secondaryColor = colors.secondary || "#6b7280";
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  // Get icon for navigation item
  const getNavIcon = (path: string) => {
    switch(path) {
      case '/':
        return <Home className="h-4 w-4 mr-1" />;
      case '/inventory':
        return <Package className="h-4 w-4 mr-1" />;
      case '/booking':
        return <Calendar className="h-4 w-4 mr-1" />;
      case '/about':
        return <Info className="h-4 w-4 mr-1" />;
      case '/contact':
        return <Phone className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-md py-2' : 'py-4'
        }`}
        style={{ 
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo and business name */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                {business.logo ? (
                  <div className="relative overflow-hidden rounded-lg mr-3 transition-transform duration-300 group-hover:scale-105">
                    <img 
                      src={business.logo} 
                      alt={`${business.name} logo`} 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    className="h-10 w-10 rounded-lg mr-3 flex items-center justify-center text-white font-bold shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                    }}
                  >
                    <PartyPopper className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <span className="font-bold text-lg tracking-tight">{business.name}</span>
                  <p className="text-xs text-gray-500 hidden sm:block">Premium Inflatable Rentals</p>
                </div>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { path: '/', label: 'Home' },
                { path: '/inventory', label: 'Inventory' },
                ...(business.description || (siteConfig.about && siteConfig.about.description)) ? [{ path: '/about', label: 'About' }] : [],
                ...(business.phone || business.email || business.address) ? [{ path: '/contact', label: 'Contact' }] : []
              ].map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                    isActive(item.path) 
                      ? 'text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  style={isActive(item.path) ? { 
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  } : {}}
                >
                  {getNavIcon(item.path)}
                  {item.label}
                </Link>
              ))}
              
              {/* Book Now button */}
              <Button 
                asChild 
                className="ml-3 rounded-full shadow-md transition-transform hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  borderColor: 'transparent',
                }}
              >
                <Link href="/booking" className="flex items-center">
                  Book Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
                style={{ color: primaryColor }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 mt-3 animate-in slide-in-from-top-5 duration-200 rounded-xl shadow-lg border border-gray-100 bg-white">
              {[
                { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
                { path: '/inventory', label: 'Inventory', icon: <Package className="h-5 w-5" /> },
                ...(business.description || (siteConfig.about && siteConfig.about.description)) ? [{ path: '/about', label: 'About', icon: <Info className="h-5 w-5" /> }] : [],
                ...(business.phone || business.email || business.address) ? [{ path: '/contact', label: 'Contact', icon: <Phone className="h-5 w-5" /> }] : []
              ].map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`flex items-center px-4 py-3 ${
                    isActive(item.path) 
                      ? 'bg-gray-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mr-3 p-2 rounded-full" style={{ 
                    backgroundColor: isActive(item.path) ? primaryColor : `${primaryColor}15`,
                    color: isActive(item.path) ? 'white' : primaryColor
                  }}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
              
              <div className="px-4 pt-4 pb-2 mt-2 border-t">
                <Button 
                  asChild 
                  className="w-full rounded-full shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    borderColor: 'transparent',
                  }}
                >
                  <Link href="/booking" className="flex items-center justify-center" onClick={() => setMobileMenuOpen(false)}>
                    Book Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business info */}
            <div>
              <div className="flex items-center mb-4">
                {business.logo ? (
                  <img 
                    src={business.logo} 
                    alt={`${business.name} logo`} 
                    className="h-10 w-auto mr-3"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-lg mr-3 flex items-center justify-center text-white font-bold"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                    }}
                  >
                    <PartyPopper className="h-5 w-5" />
                  </div>
                )}
                <h3 className="text-xl font-bold">{business.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {business.description || 'Premium inflatable rentals for birthdays, events, and parties.'}
              </p>
              {business.phone && (
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2" style={{ color: primaryColor }} />
                  <p className="text-sm text-gray-500">{business.phone}</p>
                </div>
              )}
              {business.email && (
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-2" style={{ color: primaryColor }} />
                  <p className="text-sm text-gray-500">{business.email}</p>
                </div>
              )}
              {business.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" style={{ color: primaryColor }} />
                  <p className="text-sm text-gray-500">{business.address}</p>
                </div>
              )}
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-3">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/inventory', label: 'Inventory' },
                  ...(business.description || (siteConfig.about && siteConfig.about.description)) ? [{ path: '/about', label: 'About Us' }] : [],
                  ...(business.phone || business.email || business.address) ? [{ path: '/contact', label: 'Contact' }] : []
                ].map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path} 
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" style={{ color: primaryColor }} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Service areas */}
            <div>
              <h3 className="text-xl font-bold mb-4">Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {business.serviceArea && Array.isArray(business.serviceArea) && business.serviceArea.length > 0 ? (
                  business.serviceArea.map(area => {
                    // Extract just the city name
                    const cityName = area.split(',')[0].trim();
                    return (
                      <span 
                        key={area} 
                        className="px-3 py-1 text-sm rounded-full"
                        style={{ 
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor
                        }}
                      >
                        {cityName}
                      </span>
                    );
                  })
                ) : (
                  // Fallback default service areas if none are defined
                  ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].map(city => (
                    <span 
                      key={city} 
                      className="px-3 py-1 text-sm rounded-full"
                      style={{ 
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor
                      }}
                    >
                      {city}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t mt-10 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
            <div className="mt-2">
              Powered by <a 
                href="https://inflatemate.com" 
                className="font-medium hover:underline transition-colors" 
                style={{ color: primaryColor }}
              >
                InflateMate
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Sales Funnel Popup - Only render on client side */}
      {isMounted && activeFunnel && (
        <SalesFunnelPopup 
          businessId={business.id}
          funnel={activeFunnel}
          colors={{
            primary: colors.primary || "#3b82f6",
            secondary: colors.secondary || "#6b7280",
          }}
        />
      )}
    </div>
  );
} 