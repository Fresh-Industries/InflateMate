'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles, // Used for Themes
  Layout, // Used for Mobile App (representing the interface/structure)
  Zap // Used for AI features (representing intelligence/power)
} from "lucide-react";

// Re-defining interface for upcoming features
interface UpcomingFeature {
    name: string;
    description: string;
    icon: React.ElementType;
    eta: string; // Estimated Time of Arrival (e.g., "Q3 2025")
    progress: number; // Estimated progress percentage (0-100)
}

// Updated upcoming features based on user context (Themes, Mobile App, AI)
const upcomingFeatures: UpcomingFeature[] = [
  {
    name: "More Website Themes",
    description: "Expand your design options to make your rental business website stand out.",
    icon: Sparkles, // Using Sparkles for design/themes
    eta: "Upcoming", // Using "Upcoming" or placeholder text if exact ETA is uncertain/flexible
    progress: 65, // Placeholder estimate (adjust realistically)
  },
  {
    name: "Mobile App (iOS & Android)",
    description: "Manage bookings, check inventory, and communicate with clients on the go.",
    icon: Layout, // Using Layout for mobile interface structure
    eta: "Upcoming", // Using "Upcoming" or placeholder
    progress: 35, // Placeholder estimate (adjust realistically)
  },
  {
    name: "AI-Powered Features", // Broader name for AI features
    description: "Leverage artificial intelligence for insights like pricing suggestions, route optimization, and more.",
    icon: Zap, // Using Zap for power/intelligence
    eta: "Upcoming", // Using "Upcoming" or placeholder
    progress: 15, // Placeholder estimate (adjust realistically)
  },
   // Note: SMS and Document Signing were in the previous component's data as if they were launching soon or available.
   // If they are already implemented/available now, remove them from this "Upcoming" roadmap section.
   // If they are *still* upcoming, you could add them back here with updated ETAs/progress.
   // Assuming the user's provided list (Themes, Mobile, AI) is the primary focus for *this* roadmap view.
];


export default function FounderRoadmap() {

  // --- Content derived from user context ---

  const founderName = "Nikolas Manuel"; // Replace with actual founder name
  const founderTitle = "Founder, InflateMate"; // Keep title
  const founderImageSrc = "/founder-avatar.jpg"; // Path to founder image

  // Founder's story adapted from user context, *without* specific numbers
  const founderStory = (
    <>
      <p className="pl-4 text-base"> {/* Adjusted font size slightly for readability in quote */}
        My family started a bounce house rental business a couple of years ago. When we searched for software to manage everything, we were surprised there were no modern, intuitive options – just clunky, outdated systems.
      </p>
      <p className="mt-3 pl-4 text-base"> {/* Adjusted font size */}
        So, I decided to build our own solution for them. Seeing how much that initial version streamlined their operations and how much they loved its easy-to-use design, I realized I could help countless other rental owners facing the same frustrations.
      </p>
       <p className="mt-3 pl-4 text-base"> {/* Adjusted font size */}
         InflateMate is built directly from that real-world experience. It&apos;s designed to be the modern, intuitive platform you need, and we&apos;re committed to constantly updating it based on real rental business needs – starting with the features on our roadmap below.
       </p>
    </>
  );

  // Metrics array and rendering removed entirely for transparency


  // --- Component Structure and Rendering ---

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          {/* Founder photo and story */}
          <motion.div
            className="md:w-2/5 w-full" // Make it full width on small screens
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} // Animate in when in view
            viewport={{ once: true, margin: "-100px" }} // Animate only once
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card p-6 rounded-xl border border-border relative">
              {/* Authentic badge */}
              <div className="absolute -top-3 -right-3 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-xs font-medium text-primary flex items-center gap-1 z-10"> {/* Added z-index */}
                <CheckCircle2 className="h-3 w-3" />
                Founder Update
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0"> {/* Added flex-shrink-0 */}
                   {/* Use the actual image source */}
                  <Image
                    src={founderImageSrc}
                    alt={`${founderName}, InflateMate Founder`}
                    fill
                    className="object-cover"
                    // Uncomment if you don't have an image and use a placeholder like ui-avatars
                    // unoptimized
                    // loader={({ src }) => src} // Simple loader for external URLs like ui-avatars
                  />
                   {/* Fallback placeholder if image fails or is not used */}
                   {/* If using ui-avatars via loader, you might not need this */}
                  {/* <div className="absolute inset-0 bg-muted/50 flex items-center justify-center text-muted-foreground">
                       <Users className="h-8 w-8" />
                  </div> */}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{founderName}</h3> {/* Ensured text-foreground */}
                  <p className="text-sm text-muted-foreground">{founderTitle}</p>
                </div>
              </div>

              {/* Founder Story Quote */}
              {/* Removed the metrics section */}
              <blockquote className="text-foreground relative">
                <span className="text-5xl text-primary/20 absolute -top-4 -left-2 select-none">&quot;</span> {/* Added select-none */}
                {founderStory} {/* Inject the dynamic story content */}
                <span className="text-5xl text-primary/20 absolute -bottom-8 right-0 select-none">&quot;</span> {/* Added select-none */}
              </blockquote>

              {/* Removed the metrics rendering block entirely */}
              {/*
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/50 rounded-lg p-3">
                 ... metrics rendering ...
              </div>
              */}

            </div>
          </motion.div>

          {/* Roadmap section */}
          <motion.div
            className="md:w-3/5 w-full" // Make it full width on small screens
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} // Animate in when in view
            viewport={{ once: true, margin: "-100px" }} // Animate only once
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
               {/* Updated Roadmap Heading */}
              <h2 className="text-2xl font-bold mb-2 text-foreground">What&apos;s Coming Next for InflateMate</h2>
               {/* Updated Roadmap Subtitle */}
              <p className="text-muted-foreground">
                 Our public roadmap shows the key features we&apos;re actively building based on the needs of real rental businesses.
              </p>
            </div>

            <div className="space-y-5 mb-8">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border relative overflow-hidden group items-start" // Adjusted gap and padding, added items-start
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, x: -15 }} // Adjusted initial position
                  whileInView={{ opacity: 1, x: 0 }} // Animate in when in view
                  viewport={{ once: true, margin: "-50px" }} // Animate only once
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }} // Stagger animation
                >
                  {/* Progress bar */}
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-primary/60"
                    style={{ width: `${feature.progress}%` }}
                  />

                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                     {/* Render Feature Icon */}
                    <feature.icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-foreground">{feature.name}</h3> {/* Ensured text-foreground */}
                      {/* ETA */}
                      <div className="flex items-center text-xs text-muted-foreground gap-1 flex-shrink-0 ml-2"> {/* Added flex-shrink-0 and ml */}
                        <Clock className="h-3 w-3" />
                        {feature.eta}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Roadmap Links */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto flex items-center gap-2"
                asChild
              >
                <Link href="https://linear.app/inflatemate/roadmap/public" target="_blank" rel="noopener noreferrer"> {/* Added rel="noopener noreferrer" for security */}
                  <ExternalLink className="h-4 w-4" />
                  View Our Public Roadmap
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-primary hover:bg-primary/5 transition-colors" // Added primary text color and hover
                asChild
              >
                <Link href="/feedback">
                  Request a Feature
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
