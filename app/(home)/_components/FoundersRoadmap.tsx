'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  FileSignature, 
  Calendar, 
  ExternalLink, 
  CheckCircle2,
  Clock
} from "lucide-react";

export default function FounderRoadmap() {
  const upcomingFeatures = [
    {
      name: "SMS Notifications",
      description: "Two-way text messaging with customers",
      icon: <MessageSquare className="h-5 w-5" />,
      eta: "June 2025",
      progress: 75,
    },
    {
      name: "Document Signing",
      description: "Digital waivers and rental agreements",
      icon: <FileSignature className="h-5 w-5" />,
      eta: "July 2025",
      progress: 45,
    },
    {
      name: "AI Scheduling",
      description: "Intelligent routing and conflict resolution",
      icon: <Calendar className="h-5 w-5" />,
      eta: "August 2025",
      progress: 20,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          {/* Founder photo and metrics */}
          <motion.div 
            className="md:w-2/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card p-6 rounded-xl border border-border relative">
              {/* Authentic badge */}
              <div className="absolute -top-3 -right-3 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-xs font-medium text-primary flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Founder Update
              </div>
              
              <div className="flex items-center gap-4 mb-5">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image 
                    src="/founder-avatar.jpg" 
                    alt="Mike, InflateMate Founder" 
                    fill 
                    className="object-cover"
                    // If you don't have a founder image, uncomment below:
                    // unoptimized 
                    // loader={() => "https://ui-avatars.com/api/?name=Mike&background=8B5CF6&color=fff"}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Mike Johnson</h3>
                  <p className="text-sm text-muted-foreground">Founder, InflateMate</p>
                </div>
              </div>
              
              <blockquote className="text-foreground relative">
                <span className="text-5xl text-primary/20 absolute -top-4 -left-2">&quot;</span>
                <p className="pl-4">
                  I run a bounce house rental company in Texas, so I built InflateMate to solve problems I face daily. 
                  Our V1 already processed <span className="font-semibold text-primary">3,200+ bookings</span> last summer.
                </p>
                <p className="mt-3 pl-4">
                  I&apos;m sharing our roadmap openly because I believe in building in public. 
                  These are the exact features my own rental business needs next.
                </p>
                <span className="text-5xl text-primary/20 absolute -bottom-8 right-0">&quot;</span>
              </blockquote>
              
              <div className="mt-8 flex items-center justify-between bg-muted/50 rounded-lg p-3">
                <div className="text-center px-2">
                  <div className="text-2xl font-bold text-foreground">3,200+</div>
                  <div className="text-xs text-muted-foreground">Bookings Processed</div>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="text-center px-2">
                  <div className="text-2xl font-bold text-foreground">42</div>
                  <div className="text-xs text-muted-foreground">Rental Businesses</div>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="text-center px-2">
                  <div className="text-2xl font-bold text-foreground">4.9<span className="text-sm">/5</span></div>
                  <div className="text-xs text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roadmap section */}
          <motion.div 
            className="md:w-3/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Shipping This Quarter</h2>
              <p className="text-muted-foreground">
                Here&apos;s what we&apos;re building based on feedback from bounce house rental companies like yours:
              </p>
            </div>

            <div className="space-y-5 mb-8">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  className="flex gap-5 p-5 rounded-xl bg-card border border-border relative overflow-hidden group"
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {/* Progress bar */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-primary/60"
                    style={{ width: `${feature.progress}%` }}
                  />
                  
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {feature.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{feature.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="h-3 w-3" />
                        {feature.eta}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto flex items-center gap-2"
                asChild
              >
                <Link href="https://linear.app/inflatemate/roadmap/public" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View Our Public Roadmap
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto"
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
