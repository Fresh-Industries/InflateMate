'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Zap,
  Calendar,
  FileText,
  Box,
  MessageSquare,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type CompanyName = "InflateMate" | "Inflatable Office" | "Event Rental Services" | "Goodshuffle Pro";

interface CompanyDetail {
  value: boolean;
  note: string;
}

interface FeatureItem {
  name: string;
  tooltip: string;
  details: Record<CompanyName, CompanyDetail>;
  icon: React.ElementType;
}

interface FeatureCategory {
  id: string;
  category: string;
  icon: React.ElementType;
  items: FeatureItem[];
}

const companyNames: CompanyName[] = ["InflateMate", "Inflatable Office", "Event Rental Services", "Goodshuffle Pro"];

const companyDescriptions: Record<CompanyName, string> = {
  "InflateMate": "Purpose-built for bounce houses",
  "Inflatable Office": "Legacy rental software",
  "Event Rental Services": "Generic event software",
  "Goodshuffle Pro": "Broad event platform"
};

const features: FeatureCategory[] = [
  {
    id: "platform",
    category: "Platform & Design",
    icon: Sparkles,
    items: [
      {
        name: "Modern, Intuitive UI",
        tooltip: "Easy-to-use interface designed with the latest UX principles, not stuck in the past.",
        icon: Sparkles,
        details: {
          InflateMate: {
            value: true,
            note: "Clean, modern design inspired by top tech companies like Stripe. Easy to learn and navigate in minutes."
          },
          "Inflatable Office": {
            value: false,
            note: "Outdated interface from the early 2000s; clunky, visually unappealing, and requires significant training."
          },
          "Event Rental Services": {
            value: false,
            note: "Generic business software look; not optimized for fast rental workflows."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Complex and often cluttered interface with a steep learning curve for daily tasks."
          }
        }
      },
      {
        name: "Built for Bounce Houses",
        tooltip: "Platform built specifically with the unique needs and workflows of the inflatable rental industry in mind, not generic event rentals.",
        icon: CheckCircle2,
        details: {
          InflateMate: {
            value: true,
            note: "Designed by a bounce house business owner to solve *your* specific operational pains and workflows."
          },
          "Inflatable Office": {
            value: false,
            note: "General rental software; features apply broadly but lack inflatable-specific optimizations."
          },
          "Event Rental Services": {
            value: false,
            note: "Generic event management software; workflows don't align perfectly with inflatable rentals."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Broad event industry platform; features can feel overcomplicated or missing for dedicated inflatable rentals."
          }
        }
      },
    ]
  },
  {
    id: "automation",
    category: "Booking & Automation",
    icon: Calendar,
    items: [
      {
        name: "24/7 Online Booking",
        tooltip: "Customers can view real-time availability and book inflatable units online at any time.",
        icon: Calendar,
        details: {
          InflateMate: {
            value: true,
            note: "Customer-facing portal with live inventory, automated setup/takedown buffer times, and instant booking confirmation."
          },
          "Inflatable Office": {
            value: false,
            note: "Offers online booking, but configuration can be complex and buffer times may be less flexible."
          },
          "Event Rental Services": {
            value: false,
            note: "Booking functionality may be basic, require manual approval, or not be rental-specific."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Offers embeddable booking widgets, but often feels less integrated than a dedicated portal."
          }
        }
      },
      {
        name: "Automated Digital Waivers",
        tooltip: "System automatically sends e-sign liability waivers to customers upon booking, saving time and ensuring compliance.",
        icon: FileText,
        details: {
          InflateMate: {
            value: true,
            note: "Seamless integration (e.g., via DocuSeal) for automated, legally binding e-signatures sent upon booking."
          },
          "Inflatable Office": {
            value: false,
            note: "Requires manual sending or integrates with paid third-party e-sign services separately."
          },
          "Event Rental Services": {
            value: false,
            note: "Typically no integrated waiver functionality; requires manual process or external service."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "May offer limited document features or require a higher, more expensive tier for e-signatures."
          }
        }
      },
      {
        name: "Real-time Inventory Sync",
        tooltip: "Automatically track the status and availability of every inflatable unit in real-time across all bookings.",
        icon: Box,
        details: {
          InflateMate: {
            value: true,
            note: "Inventory tracking is automatically tied to bookings, instantly preventing double bookings and conflicts."
          },
          "Inflatable Office": {
            value: false,
            note: "Inventory tracking available, but real-time accuracy can depend on manual steps or batch updates."
          },
          "Event Rental Services": {
            value: false,
            note: "Inventory management is often generic and not specifically tailored to individual rental unit tracking."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Inventory tracking available, but setup and linking to specific rental unit availability can be complex."
          }
        }
      },
    ]
  },
  {
    id: "growth",
    category: "Growth & Communication",
    icon: MessageSquare,
    items: [
      {
        name: "Integrated Website Builder",
        tooltip: "Easily build a branded, professional website or integrated booking page without needing separate web design tools.",
        icon: Sparkles,
        details: {
          InflateMate: {
            value: true,
            note: "Simple drag-and-drop builder for a professional mini-site with customizable themes, content sections, and integrated booking."
          },
          "Inflatable Office": {
            value: false,
            note: "Does not offer website building capabilities; focuses only on backend management."
          },
          "Event Rental Services": {
            value: false,
            note: "May have basic listing capabilities, but not a full, customizable website builder."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Only offers embeddable booking widgets for existing sites; no standalone website builder."
          }
        }
      },
      {
        name: "Lead Capture & Marketing",
        tooltip: "Built-in tools like popups and coupons to capture website visitor information and automatically generate leads.",
        icon: Zap,
        details: {
          InflateMate: {
            value: true,
            note: "Create engaging popups to offer discounts/coupons and automatically build your marketing list directly from your site."
          },
          "Inflatable Office": {
            value: false,
            note: "No integrated marketing or lead capture tools."
          },
          "Event Rental Services": {
            value: false,
            note: "No integrated marketing or lead capture tools."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Focuses more on quote management; offers limited to no integrated lead capture tools."
          }
        }
      },
      {
        name: "Integrated Email & SMS",
        tooltip: "Automated and integrated communication tools to keep customers informed throughout their booking journey.",
        icon: MessageSquare,
        details: {
          InflateMate: {
            value: true,
            note: "Automated email confirmations, reminders, and integrated two-way SMS messaging (Twilio integration)."
          },
          "Inflatable Office": {
            value: false,
            note: "Primarily email communication; SMS usually requires separate services or limited integrations."
          },
          "Event Rental Services": {
            value: false,
            note: "Basic email communication only; no integrated SMS capabilities."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Email available; SMS is often an extra-cost add-on or requires third-party integration."
          }
        }
      },
    ]
  },
  {
    id: "value",
    category: "Value & Pricing",
    icon: DollarSign,
    items: [
      {
        name: "Simple, Flat Pricing",
        tooltip: "Transparent, predictable monthly cost without hidden fees, tiered usage limits, or feature limitations.",
        icon: CheckCircle2,
        details: {
          InflateMate: {
            value: true,
            note: "One clear, flat monthly price includes *all* core features. No surprises or nickel-and-diming as you grow."
          },
          "Inflatable Office": {
            value: false,
            note: "Complex tiered pricing often based on usage (number of bookings/units) or features; costs increase significantly as you grow."
          },
          "Event Rental Services": {
            value: false,
            note: "Can be pay-per-use or have complex pricing models that make budgeting difficult, especially during peak season."
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Base subscription fee plus many extra fees for essential features that should be standard."
          }
        }
      },
    ]
  },
];

export default function ComparisonTable() {
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [activeCompany, setActiveCompany] = useState<CompanyName>("InflateMate");
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleFeature = (id: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const nextCompany = () => {
    const currentIndex = companyNames.indexOf(activeCompany);
    const nextIndex = (currentIndex + 1) % companyNames.length;
    setActiveCompany(companyNames[nextIndex]);
  };

  const prevCompany = () => {
    const currentIndex = companyNames.indexOf(activeCompany);
    const prevIndex = currentIndex === 0 ? companyNames.length - 1 : currentIndex - 1;
    setActiveCompany(companyNames[prevIndex]);
  };

  // Get the summary stats
  const getYesCount = (company: CompanyName) => {
    let count = 0;
    features.forEach(category => {
      category.items.forEach(item => {
        if (item.details[company].value) count++;
      });
    });
    return count;
  };

  const totalFeatures = features.reduce((sum, category) => sum + category.items.length, 0);

  const FeatureIndicator = ({ value, note }: CompanyDetail) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {value ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-primary"
              >
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-destructive/70"
              >
                <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={isMobile ? "bottom" : "top"} 
          align={isMobile ? "center" : "center"}
          className="max-w-xs bg-card p-3 shadow-xl z-50 text-muted-foreground"
        >
          <p className="text-sm">{note}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-background/50 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            InflateMate vs. The Competition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare InflateMate&apos;s modern, inflatable-focused features against clunky, generic alternatives.
          </p>
        </motion.div>

        {/* Stats Row - Show comparison summary above the table */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-5xl mx-auto">
          {companyNames.map(company => (
            <motion.div 
              key={`stats-${company}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={cn(
                "rounded-xl p-4 text-center border shadow-sm",
                company === "InflateMate" 
                  ? "bg-primary/10 border-primary" 
                  : "bg-card border-border",
                isMobile && company === activeCompany && "ring-2 ring-primary"
              )}
              onClick={() => isMobile && setActiveCompany(company)}
            >
              <h3 className={cn(
                "font-bold text-base sm:text-lg truncate",
                company === "InflateMate" ? "text-primary" : "text-foreground"
              )}>
                {company}
              </h3>
              <p className="text-xs text-muted-foreground mb-2 truncate">
                {companyDescriptions[company]}
              </p>
              <div className="flex items-center justify-center gap-1">
                <span className={cn(
                  "text-2xl font-bold",
                  company === "InflateMate" ? "text-primary" : "text-foreground"
                )}>
                  {getYesCount(company)}
                </span>
                <span className="text-xs text-muted-foreground">/ {totalFeatures} features</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Company Selector */}
        {isMobile && (
          <div className="mb-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Compare Companies:</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={prevCompany}
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  aria-label="Previous company"
                >
                  <ArrowLeft size={16} />
                </button>
                <button 
                  onClick={nextCompany}
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  aria-label="Next company"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <Tabs 
              value={activeCompany} 
              onValueChange={(value) => setActiveCompany(value as CompanyName)}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto p-1">
                {companyNames.map(company => (
                  <TabsTrigger 
                    key={company} 
                    value={company}
                    className={cn(
                      "py-2 px-3 text-xs sm:text-sm relative",
                      company === "InflateMate" && "data-[state=active]:bg-primary/20"
                    )}
                  >
                    {company === "InflateMate" && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-[10px] py-0.5 px-2 rounded-full font-medium whitespace-nowrap">
                        BEST
                      </div>
                    )}
                    <span className="truncate block">{company}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="relative mx-auto max-w-5xl">
          {/* Desktop Header Row (Hidden on Mobile) */}
          {!isMobile && (
            <div className="hidden lg:grid grid-cols-5 gap-1 sticky top-0 bg-background/90 backdrop-blur-sm z-20 pt-6 -mt-6 rounded-b-lg shadow-sm border-b border-border">
              {/* Empty cell for the first column */}
              <div className="col-span-1"></div>

              {/* Company Headers */}
              {companyNames.map((company) => (
                <motion.div
                  key={company}
                  className={`col-span-1 relative rounded-xl p-4 text-center transition-all duration-300 border ${
                    company === "InflateMate"
                      ? "bg-primary/10 border-primary shadow-lg"
                      : "bg-card border-border opacity-80"
                  } ${activeCompany === company ? '!opacity-100 !bg-primary/15 !border-primary/70' : ''}`}
                  whileHover={{ y: -5, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onMouseEnter={() => setActiveCompany(company)}
                  onMouseLeave={() => setActiveCompany("InflateMate")}
                >
                  {company === "InflateMate" && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full font-semibold whitespace-nowrap">
                      RECOMMENDED
                    </div>
                  )}
                  <h3 className={`font-bold text-lg ${company === "InflateMate" ? "text-primary" : "text-foreground"}`}>
                    {company}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 h-8 flex items-center justify-center">
                    {companyDescriptions[company]}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="space-y-4 mt-4 sm:mt-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                className="overflow-hidden rounded-xl border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
              >
                {/* Category Header (Toggle Button) */}
                <div
                  className="flex items-center cursor-pointer p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFeature(feature.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <feature.icon size={18} className="text-primary flex-shrink-0" />
                    <h3 className="font-semibold text-foreground">{feature.category}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFeatures[feature.id] ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronRight size={18} />
                  </motion.div>
                </div>

                {/* Feature Items (Collapsible) */}
                {expandedFeatures[feature.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-border"
                  >
                    {feature.items.map((item, itemIdx) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: itemIdx * 0.05 }}
                        className={cn(
                          "border-b border-border last:border-b-0",
                          isMobile 
                            ? "grid grid-cols-1" 
                            : "grid grid-cols-5 gap-1"
                        )}
                      >
                        {/* Feature Item Name and Tooltip */}
                        <div className={cn(
                          "p-4 flex items-center gap-2 text-foreground",
                          isMobile ? "border-b border-border/50" : "col-span-1"
                        )}>
                          <div className="flex items-center gap-1.5 flex-1">
                            <item.icon size={16} className="text-primary flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                                  <HelpCircle size={14} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs z-50">
                                <p className="text-sm">{item.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Mobile View: Only show active company */}
                        {isMobile && (
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{activeCompany}</span>
                              <FeatureIndicator {...item.details[activeCompany]} />
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={prevCompany}
                                className="p-1 rounded-full hover:bg-muted/50 transition-colors"
                                aria-label="Previous company"
                              >
                                <ArrowLeft size={14} />
                              </button>
                              <span className="text-xs text-muted-foreground">
                                {companyNames.indexOf(activeCompany) + 1}/{companyNames.length}
                              </span>
                              <button 
                                onClick={nextCompany}
                                className="p-1 rounded-full hover:bg-muted/50 transition-colors"
                                aria-label="Next company"
                              >
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Desktop View: Show all companies */}
                        {!isMobile && companyNames.map((company) => {
                          const details = item.details[company];
                          const isHighlighted = company === activeCompany;

                          return (
                            <div
                              key={`${item.name}-${company}`}
                              className={`col-span-1 p-4 flex justify-center items-center transition-all duration-300 ${
                                company === "InflateMate" ? "bg-primary/5" : ""
                              } ${isHighlighted ? "ring-2 ring-accent/30 rounded-md scale-105" : ""}`}
                            >
                              <FeatureIndicator {...details} />
                            </div>
                          );
                        })}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile company swipe indicator */}
          {isMobile && (
            <div className="flex justify-center mt-6 mb-3 text-muted-foreground">
              <ArrowLeftRight size={16} className="mr-2" />
              <span className="text-sm">Swipe or tap to compare companies</span>
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            className="mt-8 sm:mt-12 text-center py-6 sm:py-8 px-4 sm:px-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
              Ready to experience the most modern platform for bounce house rental businesses?
            </h3>
            <motion.button
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-6 sm:px-8 py-2.5 sm:py-3 shadow-lg shadow-primary/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
