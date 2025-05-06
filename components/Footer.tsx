import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send, Heart, ArrowRight, Mail } from "lucide-react"; // Keep relevant icons

// Footer Navigation Links based on Sitemap
const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      // Dynamic feature details usually not in main footer nav, but could link to overview
      // { label: "Feature Details", href: "/features" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      // Add Testimonials link if you create that page based on sitemap
      { label: "Testimonials", href: "/testimonials" },
    ]
  },
  {
    title: "Resources",
    links: [
       { label: "Blog", href: "/resources" }, // Assuming /resources is the blog index
       // Comparison pages under resources as they are informational/guides
       { label: "Comparisons", href: "/compare/inflatableoffice" }, // Example linking to one comparison page
       // Dynamic blog posts usually not listed individually here
       // { label: "Latest Post", href: "/resources/latest-slug" }, // Example
    ]
  },
];

// Inline SVGs for social icons - using your provided Lucide-like SVGs
const socialIcons = {
  facebook: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  instagram: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>,
  twitter: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2 2.8-2.1 4.6-5.3 4.6-8.9 0-.4-.1-.8-.1-1.2 1.1-.6 2-1.7 2.5-3zm-11 2c-2.1 0-4-.8-5.5-2.1a5.7 5.7 0 0 0 2.1 7.1c-1.2 0-2.3-.3-3.4-.9a5.7 5.7 0 0 0 5.3 5.4c-.9.2-1.9.3-2.9.1a5.7 5.7 0 0 0 4.9 2.8c-1.9 1.5-4.2 2.3-6.5 2.3a5.7 5.7 0 0 0-3.2 1c7.5 4.2 16.5 1.7 21.4-6.9C22 7.1 21.5 5.3 22 4z"></path></svg>,
  youtube: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M2.5 17.5V6.5c0-1.25.7-2.25 1.75-2.5h16.5c1.05.25 1.75 1.25 1.75 2.5v11c0 1.25-.7 2.25-1.75 2.5h-16.5c-1.05-.25-1.75-1.25-1.75-2.5ZM10 15.5v-7l5 3.5-5 3.5z"></path></svg>,
};


export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-white via-slate-50 to-blue-50 pt-24 pb-12"> {/* Kept original background */}
      {/* Decorative Elements (Kept original style) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_50%_-100%,rgba(79,70,229,0.1),transparent)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_0%_50%,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_800px_at_100%_50%,rgba(59,130,246,0.1),transparent)]"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Newsletter Section (Kept original styling) */}
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
                className="flex-1 px-6 py-4 rounded-full border-2 border-blue-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 text-lg text-gray-800 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full" // Added focus style
                 aria-label="Enter your email for newsletter"
                 // Add name="email" and potential onSubmit handler to connect to Resend/endpoint
              />
              <Button
                 className="h-[3.75rem] px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full" // Added focus style
                 type="submit" // Specify type for form
                 // Consider adding variant="primary-gradient" if your Button component supports it
              >
                Subscribe <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-16">
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              {/* Kept original logo styling with blur */}
              <div className="relative inline-flex items-center">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full opacity-80 group-hover:opacity-100 blur-md transition-all duration-300"></div>
                <span className="relative text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Inflatemate
                </span>
              </div>
            </Link>
            <p className="text-gray-600 text-lg leading-relaxed">
              Elevating celebrations with magical bounce houses and making party planning a breeze for rental businesses.
            </p>

            {/* Contact Info (Only Email as requested) */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-3">
                 {/* Kept original icon styling */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Mail className="h-5 w-5" /> {/* Using Mail icon */}
                </div>
                <a href="mailto:info@inflatemate.co" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                   info@inflatemate.co {/* Your specific email */}
                </a>
              </div>
              {/* Removed Phone and MapPin as requested */}
            </div>

            {/* Social Media Links (Kept original styling structure) */}
            <div className="flex space-x-4 mt-6">
              {/* Using inline SVGs instead of Lucide components for flexibility matching original style */}
              <a
                href="https://facebook.com/yourpage" // Replace with actual social links
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 transform hover:scale-110 transition-all duration-300 text-gray-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                 {socialIcons.facebook({ className: "h-5 w-5" })} {/* Using inline SVG */}
              </a>
              <a
                href="https://instagram.com/yourpage" // Replace with actual social links
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="Instagram"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 transform hover:scale-110 transition-all duration-300 text-gray-400 hover:text-[#E4405F] hover:bg-[#E4405F]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                 {socialIcons.instagram({ className: "h-5 w-5" })} {/* Using inline SVG */}
              </a>
              <a
                href="https://twitter.com/yourhandle" // Replace with actual social links
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="Twitter"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 transform hover:scale-110 transition-all duration-300 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                 {socialIcons.twitter({ className: "h-5 w-5" })} {/* Using inline SVG */}
              </a>
              <a
                href="https://youtube.com/yourchannel" // Replace with actual social links
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="YouTube"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 transform hover:scale-110 transition-all duration-300 text-gray-400 hover:text-[#FF0000] hover:bg-[#FF0000]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                 {socialIcons.youtube({ className: "h-5 w-5" })} {/* Using inline SVG */}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7">
            {/* Use your sitemap structure */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerNav.map((section, index) => (
                <div key={index} className="space-y-6">
                  {/* Kept original title styling */}
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" // Added focus style
                        >
                           {/* Kept original arrow styling */}
                          <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar (Kept original styling structure) */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright, Heart, Product of Fresh Digital Solution */}
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-gray-500 text-sm">
                <p className="flex items-center">
                  © {new Date().getFullYear()} Inflatemate. Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500 animate-pulse" /> for bounce house businesses
                </p>
                 {/* Add the "Product of" text with link */}
                <span className="hidden sm:inline-block">•</span> {/* Separator on larger screens */}
                 <p>
                    Product of <a href="https://www.freshdigitalsolutions.tech" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">Fresh Digital Solution</a>
                 </p>
            </div>

            {/* Legal Links (Kept original styling structure) */}
            {/* Filter out Legal links from the main footerNav if you don't want them duplicated */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
               {footerNav.find(section => section.title === 'Legal')?.links.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" // Added focus style
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
