'use client'
import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
// Using available icons: Calendar, Box, FileText
import {
  Calendar,
  Box,
  FileText,
  ArrowRight,
  Check,
  Clock,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// Defining the type for a feature for better type safety
interface Feature {
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  spot: string;
  shape: string;
  stats: string[];
  accent: React.ReactNode;
}

const features: Feature[] = [ // Explicitly type the array
  {
    name: "Seamless Online Booking",
    description: "Let customers instantly book their favorite inflatables 24/7 based on your real-time availability, complete with automated buffer times for setup & travel. No more missed calls or double bookings!",
    icon: Calendar,
    href: "#booking",
    color: "from-indigo-500 to-blue-500",
    spot: "lg:col-span-2 lg:row-span-1", // Large card on large screens
    shape: "circle",
    stats: ["Booked while you sleep", "Eliminate back-and-forth calls", "Buffer times prevent overlaps"],
    accent: <Clock className="w-5 h-5 text-indigo-200" />,
  },
  {
    name: "Inflatable Inventory Insights",
    description: "Track your inflatable inventory, see which units are most popular, auto-tag types (like waterslides vs. dry combos), and predict demand to maximize rentals.",
    icon: Box, // Using Box for Inventory Management
    href: "#inventory",
    color: "from-emerald-500 to-teal-500",
    spot: "lg:col-span-1 lg:row-span-2", // Tall card on large screens
    shape: "hexagon",
    stats: ["Know your top earners", "Optimize inflatable usage", "Reduce double-bookings"],
    // Reusing/adapting the inventory accent animation
    accent: <motion.div
      className="absolute right-8 top-24 w-20 h-20 opacity-10"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500 w-full h-full">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    </motion.div>,
  },
  {
    name: "Lead-Generating Popups & Coupons", // New Name
    description: "Convert website visitors into paying customers. Easily create coupon offers and design attention-grabbing popups to capture leads, build your customer list, and drive more bookings. Get notified of new leads instantly!", // New Description based on your process
    icon: Box, // Using Box to symbolize collecting leads
    href: "#marketing", // New Anchor
    color: "from-pink-500 to-purple-500", // New Color
    spot: "lg:col-span-1 lg:row-span-1", // Regular card on large screens
    shape: "diamond", // Reused shape
    stats: ["Automated lead capture", "Grow your customer list", "Track lead conversions"], // New Stats based on benefits
    // Reused accent - adjust color
    accent: <motion.div
      className="absolute -right-6 bottom-4 text-pink-200 opacity-20" // Adjusted color
      animate={{ y: [0, -10, 0], opacity: [0.1, 0.3, 0.1] }}
      transition={{ repeat: Infinity, duration: 5 }}
    >
       {/* Reused Dollar sign SVG - represents potential revenue/value from leads */}
      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
      </svg>
    </motion.div>,
  },
  {
    name: "Customizable Business Website", // New Name
    description: "Get online fast! Easily build a professional, mobile-friendly website for your business using our intuitive editor. Choose from different themes and add sections for text, images, and video to showcase your amazing inflatables.", // New Description based on your details
    icon: FileText, // Using FileText for content/pages
    href: "#website", // New Anchor
    color: "from-blue-500 to-teal-500", // New Color
    spot: "lg:col-span-1 lg:row-span-1", // Regular card on large screens
    shape: "waves", // Reused shape
    stats: ["Quick & easy setup", "Choose from pro themes", "Showcase your inventory"], // New Stats highlighting key aspects
     // Reused accent - adjust color
    accent: <motion.div
      className="absolute -bottom-10 -left-2 opacity-10"
      animate={{
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
    >
       {/* Reused File SVG */}
      <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"> {/* Adjusted color */}
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    </motion.div>,
  },
  // You can add more features here once implemented:
  // {
  //   name: "Integrated CRM",
  //   description: "Keep all customer info, booking history, and communication logs in one place.",
  //   icon: Box, // Using Box or another suitable icon
  //   href: "#crm",
  //   color: "from-orange-500 to-red-500",
  //   spot: "col-span-1 row-span-1",
  //   shape: "square", // Example shape
  //   stats: ["Centralized customer data", "Track communication", "Personalize service"],
  //   accent: null, // Or add a relevant accent
  // },
  // {
  //   name: "Automated Waivers & Emails",
  //   description: "Automatically send e-sign safety waivers (via DocuSeal or similar) and professional, branded confirmation emails to your customers immediately after booking.",
  //   icon: FileText, // Using FileText or another suitable icon
  //   href: "#waivers",
  //   color: "from-green-500 to-blue-500",
  //   spot: "col-span-1 row-span-1",
  //   shape: "waves",
  //   stats: ["Waivers signed automatically", "Reduce manual communication", "Ensure legal compliance"],
  //   accent: null, // Or add a relevant accent
  // },
];

export default function FeatureBento() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      {/* Adjust background colors if new card colors clash */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      {/* Using colors from new cards */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/5 rounded-full mix-blend-multiply blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-teal-500/5 rounded-full mix-blend-multiply blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section title */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Updated Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              The Modern Tools to <span className="text-primary">Book More Bounce Houses</span>
            </h2>
            {/* Updated Subtitle */}
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stop wrestling with outdated systems. InflateMate brings online booking, inventory, marketing, and your website into one easy-to-use platform designed specifically for the inflatable industry.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-6 gap-x-0 md:gap-x-6 relative">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-defining the interface for clarity in this section as well
interface FeatureCardProps {
    feature: Feature;
    index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) { // Use the interface here
  const {
    name,
    description,
    icon: Icon,
    href,
    color,
    shape,
    stats,
    accent,
    spot
  } = feature;

  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative",
        spot
      )}
    >
      {/* Use a div instead of Link if the card itself isn't clickable */}
      {/* Or keep Link if clicking the card takes them to the section */}
      <Link href={href} className="block h-full">
        <div className={cn(
          "relative h-full overflow-hidden rounded-3xl p-4 sm:p-6 md:p-8 transition-all duration-500",
          "bg-gradient-to-br bg-clip-padding border border-transparent",
          "backdrop-blur-sm bg-card/80",
          "hover:shadow-lg hover:border-secondary/20",
          "hover:-translate-y-1",
          "min-h-[260px] md:min-h-[320px]"
        )}>
          {/* Animated background gradient */}
          {/* Use a separate div for the hover gradient */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
             <div className={cn(
              "absolute inset-0 bg-gradient-to-br",
              color
            )} />
          </div>


          {/* Shape decorations */}
          {/* Ensure colors/opacities match the overall theme or card color */}
          {shape === "circle" && (
            <motion.div
              className={cn("absolute -top-10 md:-top-20 -right-10 md:-right-20 w-20 h-20 md:w-40 md:h-40 rounded-full border-8 opacity-20", `border-${color.split(' ')[0].split('-')[1]}-500/20`)}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
              }}
            />
          )}

          {shape === "hexagon" && (
            <svg className={cn("absolute -bottom-8 md:-bottom-16 -left-8 md:-left-16 w-16 h-16 md:w-32 md:h-32 opacity-20", `text-${color.split(' ')[0].split('-')[1]}-500/20`)} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.2,3.4L12,1L6.8,3.4L2,12l4.8,8.6L12,23l5.2-2.4L22,12L17.2,3.4z" />
            </svg>
          )}

          {shape === "diamond" && (
            <motion.div
              className={cn("absolute -bottom-6 md:-bottom-12 -right-6 md:-right-12 w-12 h-12 md:w-24 md:h-24 opacity-10 rotate-45 border-2 border-dashed", `border-${color.split(' ')[0].split('-')[1]}-500/20`)}
              animate={{ rotate: [45, 90, 45] }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            />
          )}

          {shape === "waves" && (
            <svg className={cn("absolute -top-5 md:-top-10 -right-5 md:-right-10 w-10 h-10 md:w-20 md:h-20 opacity-20", `text-${color.split(' ')[0].split('-')[1]}-500/20`)} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.2 19H5v-2h3.2c1.3 0 2.4-.8 2.8-2 .4-1.2-.1-2.6-1.3-3.2-.4-.3-.8-.5-1.2-.7-1.1-.8-2.1-1.6-2.5-2.8S5.8 5 7 4.4c.5-.2 1-.4 1.5-.4H12v2H8.5c-.8 0-1.5.5-1.8 1.2-.3.7 0 1.5.6 1.9.5.4 1.1.7 1.6 1 .9.6 1.9 1.3 2.5 2.2 1.2 1.5 1.5 3.6.8 5.4-.7 1.8-2.4 3-4.3 3.3-.3 0-.6.1-.9.1M18 18.5c-.7 0-1.4-.1-2.1-.3-1.4-.4-2.6-1.4-3.3-2.7-.7-1.3-.9-2.8-.5-4.2.4-1.4 1.4-2.6 2.7-3.3 2.6-1.4 5.9-.5 7.3 2.1.5.8.7 1.7.7 2.7h-2c0-.7-.2-1.3-.4-1.9-.8-1.5-2.7-2-4.2-1.2-.8.4-1.3 1.1-1.5 1.9-.2.8-.1 1.7.3 2.4.4.8 1.1 1.3 1.9 1.5.8.2 1.7.1 2.4-.3.5-.3 1-.8 1.2-1.3h2c-.4 1.1-1.1 2-2.1 2.7-.8.5-1.5.7-2.4.9z" />
            </svg>
          )}

          {/* Icon with gradient background */}
          <div className="relative z-10 mb-6 flex justify-between items-start">
            <div className={cn(
              "p-3 rounded-xl shadow-lg bg-gradient-to-br",
              color // Use the card's gradient color
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {/* Star rating - hide on mobile */}
            <div className="hidden sm:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-muted-foreground mb-6">
              {description}
            </p>

            {/* Stats - animated on hover */}
            <div className="space-y-2 mt-auto">
              {stats.map((stat: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }} // Stagger animation
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  {stat}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Accent decorations unique to each card */}
          {/* Ensure the accent is absolutely positioned within the card div */}
          <div className="absolute inset-0 pointer-events-none">
            {accent}
          </div>

          {/* Learn more link */}
          <div className="absolute bottom-6 right-6 group-hover:opacity-100 opacity-0 transition-opacity z-20"> {/* Added z-index */}
            <motion.div
              className="flex items-center text-primary font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="mr-1">Explore</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
