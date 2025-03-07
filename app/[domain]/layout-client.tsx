'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface DomainLayoutClientProps {
  children: ReactNode;
  business: any;
  siteConfig: any;
  colors: any;
}

export function DomainLayoutClient({ 
  children, 
  business, 
  siteConfig, 
  colors 
}: DomainLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b shadow-sm dark:border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              {business.logo ? (
                <img src={business.logo} alt={business.name} className="h-10 w-auto" />
              ) : (
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: colors.primary || '#3b82f6',
                    color: '#ffffff'
                  }}
                >
                  <span className="font-bold">{business.name.charAt(0)}</span>
                </div>
              )}
              <span 
                className="text-xl font-bold transition-colors"
                style={{ color: colors.primary || '#3b82f6' }}
              >
                {business.name}
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <nav className="flex items-center space-x-1 mr-2">
                <Link 
                  href="/inventory" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ color: colors.secondary || '#6b7280' }}
                >
                  Inventory
                </Link>
                <Link 
                  href="/about" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ color: colors.secondary || '#6b7280' }}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ color: colors.secondary || '#6b7280' }}
                >
                  Contact
                </Link>
              </nav>
              
              <Button 
                className="mr-2"
                style={{ 
                  backgroundColor: colors.accent || '#f59e0b',
                  color: '#ffffff'
                }}
              >
                <Link href="/booking">Book Now</Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-700 dark:text-gray-300"
                aria-label="Menu"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t mt-3 animate-in slide-in-from-top-5 duration-200 dark:border-gray-800">
              <nav className="flex flex-col space-y-3">
                <Link 
                  href="/inventory" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ color: colors.secondary || '#6b7280' }}
                  onClick={toggleMobileMenu}
                >
                  Inventory
                </Link>
                <Link 
                  href="/about" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ color: colors.secondary || '#6b7280' }}
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ color: colors.secondary || '#6b7280' }}
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
                <Button 
                  className="w-full justify-center"
                  style={{ 
                    backgroundColor: colors.accent || '#f59e0b',
                    color: '#ffffff'
                  }}
                  onClick={toggleMobileMenu}
                >
                  <Link href="/booking">Book Now</Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 bg-white dark:bg-gray-900">{children}</main>
      
      <footer className="border-t mt-8 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                {business.logo ? (
                  <img src={business.logo} alt={business.name} className="h-8 w-auto" />
                ) : (
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: colors.primary || '#3b82f6',
                      color: '#ffffff'
                    }}
                  >
                    <span className="font-bold text-sm">{business.name.charAt(0)}</span>
                  </div>
                )}
                <span 
                  className="text-lg font-bold"
                  style={{ color: colors.primary || '#3b82f6' }}
                >
                  {business.name}
                </span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Premium inflatable rentals for birthdays, events, and parties.
              </p>
              {business.phone && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{business.phone}</p>
              )}
              {business.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{business.email}</p>
              )}
            </div>
            
            <div>
              <h3 className="font-bold mb-4" style={{ color: colors.primary || '#3b82f6' }}>Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/inventory" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Inventory</Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Contact</Link>
                </li>
                <li>
                  <Link href="/booking" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Book Now</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4" style={{ color: colors.primary || '#3b82f6' }}>Service Areas</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert'].map((city) => (
                  <div key={city} className="text-sm text-gray-500 dark:text-gray-400">{city}</div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm dark:border-gray-800">
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 