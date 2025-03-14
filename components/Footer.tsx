import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Send, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-16 pb-12 bg-gradient-to-b from-white via-blue-50 to-purple-100">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-20 h-20 rounded-full bg-blue-200 opacity-30 animate-float"></div>
        <div className="absolute top-40 right-1/4 w-16 h-16 rounded-full bg-purple-200 opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 rounded-full bg-pink-200 opacity-30 animate-float"></div>
        <div className="absolute -bottom-10 right-1/5 w-32 h-32 rounded-full bg-yellow-200 opacity-20 animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto mb-16 bg-white rounded-3xl shadow-xl p-8 transform hover:scale-[1.01] transition-transform">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Join Our Bounce Newsletter! 🎈
            </h3>
            <p className="text-gray-600">
              Get inflatable inspiration, party tips, and exclusive bounce-tastic offers!
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-md">
              <span>Bounce In</span>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl animate-bounce">🎈</span> Inflatemate
            </h3>
            <p className="text-gray-600">
              Elevating celebrations with magical bounce houses! Making party planning a breeze for rental businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
              <span className="text-xl">🦘</span> Quick Bounces
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Our Bounce Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Inflatable Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Safety Bounce Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Party Inspiration
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
              <span className="text-xl">🎪</span> Bounce Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Help Bounce Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Contact Our Team
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Bouncy FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Inflatable Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
              <span className="text-xl">🎉</span> Start Bouncing!
            </h4>
            <p className="text-gray-600">Ready to transform your bounce house business?</p>
            <Link href="/sign-up">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-md">
                Try Free for 14 Days
              </Button>
            </Link>
            <p className="text-sm text-gray-500">No credit card required to start!</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 flex items-center">
              © 2024 Inflatemate. Made with <Heart className="h-3 w-3 mx-1 text-red-400 fill-red-400" /> for bounce house businesses
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-blue-500 transition-colors text-sm">Privacy</Link>
              <Link href="#" className="text-gray-500 hover:text-blue-500 transition-colors text-sm">Terms</Link>
              <Link href="#" className="text-gray-500 hover:text-blue-500 transition-colors text-sm">Cookies</Link>
              <Link href="#" className="text-gray-500 hover:text-blue-500 transition-colors text-sm">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
