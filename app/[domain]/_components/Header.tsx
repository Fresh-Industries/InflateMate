'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BusinessWithSiteConfig, SiteConfig } from '@/lib/business/domain-utils';
import { Menu, X, Home, Package, Info, Phone, ChevronRight, PartyPopper } from 'lucide-react';

interface HeaderProps {
  business: BusinessWithSiteConfig;
  siteConfig: SiteConfig;
  colors: { primary: string; secondary: string };
}

export default function Header({ business, siteConfig, colors }: HeaderProps) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const primaryColor = colors.primary || "#3b82f6";
  const secondaryColor = colors.secondary || "#6b7280";

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: '/inventory', label: 'Inventory', icon: <Package className="h-5 w-5" /> },
    ...((business.description || siteConfig?.about?.description) ? [{ path: '/about', label: 'About', icon: <Info className="h-5 w-5" /> }] : []),
    ...((business.phone || business.email || business.address) ? [{ path: '/contact', label: 'Contact', icon: <Phone className="h-5 w-5" /> }] : [])
  ];

  return (
    <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-3'}`}
        style={{ 
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
            <Link href={`/`} className="flex items-center group">
              {business.logo ? (
                <div className="relative overflow-hidden rounded-md mr-2 transition-transform duration-300 group-hover:scale-105">
                  <img src={business.logo} alt={`${business.name} Logo`} className="h-9 w-auto object-contain" />
                </div>
              ) : (
                 <div 
                    className="h-9 w-9 rounded-lg mr-2 flex items-center justify-center text-white font-bold shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    <PartyPopper className="h-5 w-5" />
                  </div>
              )}
               <span className="font-semibold text-gray-800 hidden sm:inline">{business.name}</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path} 
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center ${ isActive(item.path) ? 'text-white' : 'text-gray-600 hover:bg-gray-100' }`}
                    style={isActive(item.path) ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : {}}
                  >
                    {React.cloneElement(item.icon, { className: "h-4 w-4 mr-1.5" })}
                    {item.label}
                  </Link>
                ))}
              <Button 
                asChild 
                size="sm"
                className="ml-2 rounded-full shadow-sm transition-transform hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <Link href={'/booking'} className="flex items-center text-sm">
                  Book Now
                  <ChevronRight className="h-4 w-4 ml-1 -mr-1" />
                </Link>
              </Button>
            </nav>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
        </div>

        {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 animate-in slide-in-from-top-5 duration-300">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`flex items-center px-3 py-2.5 rounded-lg my-1 ${isActive(item.path) ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mr-3 p-1.5 rounded-full" style={{ 
                    backgroundColor: isActive(item.path) ? primaryColor : `${primaryColor}15`,
                    color: isActive(item.path) ? 'white' : primaryColor
                  }}>
                    {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
              <div className="px-2 pt-3 mt-2 border-t">
                <Button 
                  asChild 
                  className="w-full rounded-full shadow-sm text-base py-2.5 h-auto"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  <Link href={'/booking'} className="flex items-center justify-center" onClick={() => setMobileMenuOpen(false)}>
                    Book Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
        )}
      </div>
    </header>
  );
}

// Add this basic CSS to your global stylesheet for the hover effect
/*
.hover\:text-primary:hover {
  color: var(--hover-color);
}
*/ 