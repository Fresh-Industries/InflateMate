'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Optionally handle the loading state
  if (status === "loading") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent transition-transform duration-300 hover:scale-105">
              Inflatemate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-sky-500 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href={`/dashboard/${session.user.businesses[0]}`}>
                  <Button variant="ghost" className="hover:text-sky-500 transition-colors">
                    Go to Dashboard
                  </Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" className="hover:text-sky-500 transition-colors">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-sky-500" />
              ) : (
                <Menu className="h-6 w-6 text-sky-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-md">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-600 hover:text-sky-500 transition-colors px-4 py-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <Link href={session ? "/dashboard" : "/auth"}>
                <Button variant="ghost" className="w-full justify-center">
                  {session ? "Go to Dashboard" : "Sign In"}
                </Button>
              </Link>
              <Button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
