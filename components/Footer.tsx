'use client'
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Heart, 
  ArrowRight, 
  Mail, 
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronRight
} from "lucide-react";


// Footer Navigation Links based on Sitemap
const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/changelog" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog", href: "/blog" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Comparisons", href: "/compare" },
      { label: "Industry Guides", href: "/guides" },
      { label: "Free Templates", href: "/templates" },
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/30 bg-gradient-to-b from-background to-primary/5 pt-24 pb-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_50%_-100%,rgba(139,92,246,0.15),transparent)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_0%_50%,rgba(139,92,246,0.1),transparent)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_100%_50%,rgba(99,102,241,0.1),transparent)]"></div>
      </div>
      
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative">
       
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-16">
          {/* Brand Section */}
          <motion.div 
            className="md:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="block group">
              <div className="relative inline-flex items-center">
                <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-80 group-hover:opacity-100 blur-md transition-all duration-300"></div>
                <span className="relative text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  InflateMate
                </span>
              </div>
            </Link>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Elevating celebrations with magical bounce houses and making party planning a breeze for rental businesses.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <a 
                  href="mailto:info@inflatemate.co" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-lg"
                >
                  info@inflatemate.co
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/inflatemate", color: "#1877F2" },
                { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/inflatemate", color: "#E4405F" },
                { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/inflatemate", color: "#1DA1F2" },
                { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com/c/inflatemate", color: "#FF0000" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit InflateMate on ${social.href.split('/').pop()}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-card shadow-sm border border-border transform transition-all duration-300 text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-primary/5"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)"
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {footerNav.map((section, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li 
                        key={linkIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (linkIndex * 0.05) }}
                      >
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group"
                        >
                          <ChevronRight className="h-3 w-3 opacity-0 -ml-3 mr-1 group-hover:opacity-100 group-hover:ml-0 text-primary transition-all duration-300" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright and Author */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-muted-foreground text-sm">
              <p className="flex items-center">
                © {currentYear} InflateMate. Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500 animate-pulse" /> for bounce house businesses
              </p>
              <span className="hidden sm:inline-block text-border/60">•</span>
              <p>
                Product of{" "}
                <a 
                  href="https://www.freshdigitalsolutions.tech" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors duration-200 inline-flex items-center gap-1"
                >
                  Fresh Digital Solution
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerNav.find(section => section.title === "Legal")?.links.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Back to top button */}
          <div className="flex justify-center mt-8">
            <motion.a 
              href="#top"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              whileHover={{ y: -3 }}
            >
              <span>Back to top</span>
              <div className="h-8 w-8 rounded-full bg-card shadow-sm border border-border flex items-center justify-center transform rotate-180">
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
