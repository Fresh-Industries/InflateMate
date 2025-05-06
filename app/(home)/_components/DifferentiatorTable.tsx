'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  Zap
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CompanyName = "InflateMate" | "Inflatable Office" | "Event Rental Services" | "Goodshuffle Pro";

interface CompanyDetail {
  value: boolean;
  note: string;
}

interface FeatureItem {
  name: string;
  tooltip: string;
  details: Record<CompanyName, CompanyDetail>;
}

interface FeatureCategory {
  id: string;
  category: string;
  icon: JSX.Element;
  items: FeatureItem[];
}

const features: FeatureCategory[] = [
  {
    id: "ui",
    category: "User Experience",
    icon: <Sparkles size={18} className="text-primary" />,
    items: [
      {
        name: "Modern UI",
        tooltip: "Easy-to-use interface designed with the latest UX principles",
        details: {
          InflateMate: {
            value: true,
            note: "Tailwind + Stripe inspired aesthetic with intuitive workflows"
          },
          "Inflatable Office": {
            value: false,
            note: "Outdated UI from early 2000s with clunky navigation"
          },
          "Event Rental Services": {
            value: false,
            note: "Generic interface not optimized for bounce house businesses"
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Cluttered interface with steep learning curve"
          }
        }
      }
    ]
  },
  {
    id: "pricing",
    category: "Pricing",
    icon: <Zap size={18} className="text-primary" />,
    items: [
      {
        name: "Flat monthly price",
        tooltip: "Simple, predictable pricing with no hidden fees",
        details: {
          InflateMate: {
            value: true,
            note: "One transparent price with all features included"
          },
          "Inflatable Office": {
            value: false,
            note: "Tiered pricing with essential features locked behind upgrades"
          },
          "Event Rental Services": {
            value: false,
            note: "Pay-per-use model that gets expensive during peak seasons"
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Base fee plus multiple add-ons for core functionality"
          }
        }
      }
    ]
  },
  {
    id: "communication",
    category: "Communication",
    icon: <Zap size={18} className="text-primary" />,
    items: [
      {
        name: "Built‑in docs & SMS",
        tooltip: "Integrated document handling and customer messaging",
        details: {
          InflateMate: {
            value: true,
            note: "Seamless DocuSeal integration + two-way Twilio messaging"
          },
          "Inflatable Office": {
            value: false,
            note: "Requires separate third-party apps and manual integration"
          },
          "Event Rental Services": {
            value: false,
            note: "Basic email only, no document handling or SMS"
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Limited document features, SMS available at premium tier only"
          }
        }
      }
    ]
  },
  {
    id: "sites",
    category: "Customization",
    icon: <Zap size={18} className="text-primary" />,
    items: [
      {
        name: "Tenant mini‑sites",
        tooltip: "Branded booking websites for your rental business",
        details: {
          InflateMate: {
            value: true,
            note: "Beautiful customizable sites with 5-color themes and layouts"
          },
          "Inflatable Office": {
            value: false,
            note: "No website building capability"
          },
          "Event Rental Services": {
            value: false,
            note: "Limited template with minimal customization"
          },
          "Goodshuffle Pro": {
            value: false,
            note: "Only offers embeddable widgets, not full websites"
          }
        }
      }
    ]
  }
];

export default function ComparisonTable() {
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [highlightedCompany, setHighlightedCompany] = useState("InflateMate");

  const toggleFeature = (id: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Why InflateMate Outperforms The Competition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how our purpose-built platform for bounce house rental businesses compares to generic alternatives
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Company Header Row */}
          <div className="grid grid-cols-5 gap-1 mb-6">
            <div className="col-span-1"></div>
            
            {(["InflateMate", "Inflatable Office", "Event Rental Services", "Goodshuffle Pro"] as CompanyName[]).map((company) => (
              <motion.div
                key={company}
                className={`col-span-1 relative rounded-xl p-4 text-center ${
                  company === "InflateMate" 
                    ? "bg-primary/10 border-2 border-primary" 
                    : "bg-card border border-border"
                }`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                onMouseEnter={() => setHighlightedCompany(company)}
              >
                {company === "InflateMate" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full font-semibold">
                    RECOMMENDED
                  </div>
                )}
                <h3 className={`font-bold text-lg ${company === "InflateMate" ? "text-primary" : ""}`}>
                  {company}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 h-8">
                  {company === "InflateMate" && "Modern solution built by industry experts"}
                  {company === "Inflatable Office" && "Legacy platform with outdated interface"}
                  {company === "Event Rental Services" && "Generic event management software"}
                  {company === "Goodshuffle Pro" && "Broad event industry platform"}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                className="overflow-hidden rounded-xl border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Category Header */}
                <div 
                  className="flex items-center cursor-pointer p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFeature(feature.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {feature.icon}
                    <h3 className="font-semibold">{feature.category}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFeatures[feature.id] ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={18} />
                  </motion.div>
                </div>

                {/* Feature Items */}
                <AnimatePresence>
                  {feature.items.map((item) => (
                    <motion.div 
                      key={item.name}
                      className="grid grid-cols-5 gap-1 border-t border-border"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="col-span-1 p-4 flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <HelpCircle size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p>{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {(["InflateMate", "Inflatable Office", "Event Rental Services", "Goodshuffle Pro"] as CompanyName[]).map((company) => {
                        const details = item.details[company];
                        const isHighlighted = company === highlightedCompany;

                        return (
                          <div 
                            key={`${item.name}-${company}`}
                            className={`col-span-1 p-4 flex justify-center items-center ${
                              company === "InflateMate" ? "bg-primary/5" : ""
                            } ${isHighlighted ? "ring-2 ring-accent/30 rounded-md" : ""}`}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    {details.value ? (
                                      <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="text-primary"
                                      >
                                        <CheckCircle2 className="h-6 w-6" />
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="text-destructive/70"
                                      >
                                        <XCircle className="h-6 w-6" />
                                      </motion.div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs bg-card p-3 shadow-xl">
                                  <p className="text-sm">{details.note}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        );
                      })}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="mt-12 text-center py-8 px-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              Ready to experience the most modern platform for bounce house rental businesses?
            </h3>
            <motion.button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-8 py-3 shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
