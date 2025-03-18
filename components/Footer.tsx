import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Send, Heart, ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-white via-slate-50 to-blue-50 pt-24 pb-12">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_50%_-100%,rgba(79,70,229,0.1),transparent)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_0%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_100%_50%,rgba(59,130,246,0.1),transparent)]"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto mb-20 relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur-2xl opacity-30"></div>
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 sm:p-12 relative">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Join Our Newsletter 🎈
              </h3>
              <p className="text-gray-600 text-lg">
                Get inflatable inspiration and exclusive offers!
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border-2 border-blue-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 text-lg"
              />
              <Button className="h-[3.75rem] px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg">
                Subscribe <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-16">
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="block group">
              <div className="relative inline-flex items-center">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 blur transition-all duration-300"></div>
                <span className="relative text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Inflatemate
                </span>
              </div>
            </Link>
            <p className="text-gray-600 text-lg leading-relaxed">
              Elevating celebrations with magical bounce houses and making party planning a breeze for rental businesses.
            </p>
            
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-gray-600">123 Bounce Street, Inflatable City, IC 12345</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-gray-600">hello@inflatemate.com</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-gray-600">(555) 123-4567</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              {[
                { icon: Facebook, color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10" },
                { icon: Instagram, color: "hover:text-[#E4405F] hover:bg-[#E4405F]/10" },
                { icon: Twitter, color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10" },
                { icon: Youtube, color: "hover:text-[#FF0000] hover:bg-[#FF0000]/10" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 transform hover:scale-110 transition-all duration-300 text-gray-400 ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Integrations", "Updates", "Beta Program"]
                },
                {
                  title: "Resources",
                  links: ["Documentation", "Guides", "API Reference", "Community", "Support"]
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Press", "Contact", "Partners"]
                }
              ].map((section, index) => (
                <div key={index} className="space-y-6">
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href="#"
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                        >
                          <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                          <span>{link}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 flex items-center text-sm">
              © 2024 Inflatemate. Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500 animate-pulse" /> for bounce house businesses
            </p>
            <div className="flex gap-8">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
