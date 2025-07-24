'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Updated competitor naming
type CompanyName = 'InflateMate' | 'Inflatable Office' | 'Event Rental Systems' | 'Goodshuffle Pro';

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

const companyNames: CompanyName[] = ['InflateMate', 'Inflatable Office', 'Event Rental Systems', 'Goodshuffle Pro'];

const companyDescriptions: Record<CompanyName, string> = {
  InflateMate: 'Purpose‑built for bounce houses',
  'Inflatable Office': 'Legacy rental software',
  'Event Rental Systems': 'Generic event software',
  'Goodshuffle Pro': 'Broad event platform'
};

// Helper to quickly mark true/false for competitors that clearly offer a capability
const TRUE_NOTE = 'Offered, but often costs more and lacks inflatable‑specific workflows.';

const features: FeatureCategory[] = [
  {
    id: 'platform',
    category: 'Platform & Design',
    icon: Sparkles,
    items: [
      {
        name: 'Modern, Intuitive UI',
        tooltip: 'Easy‑to‑use interface designed with the latest UX principles—no dated tables from 2004.',
        icon: Sparkles,
        details: {
          InflateMate: {
            value: true,
            note: 'Clean Next.js‑based UI; learn it in minutes.'
          },
          'Inflatable Office': {
            value: false,
            note: 'Aging interface and workflow complexity require training.'
          },
          'Event Rental Systems': {
            value: false,
            note: 'Generic form‑heavy UI with limited mobile optimisation.'
          },
          'Goodshuffle Pro': {
            value: true,
            note: 'Polished but complex—built for broad event inventory, not just inflatables.'
          }
        }
      },
      {
        name: 'Built for Bounce Houses',
        tooltip: 'Tailored to inflatable rental quirks—drop‑offs, tear‑downs, waiver timing, weight limits.',
        icon: CheckCircle2,
        details: {
          InflateMate: {
            value: true,
            note: 'Founder‑led design from real bounce‑house ops; presets for units, blower counts, etc.'
          },
          'Inflatable Office': {
            value: true,
            note: 'Originally inflatable‑focused but dated; requires manual tweaks.'
          },
          'Event Rental Systems': {
            value: false,
            note: 'Broad rental categories; lacks inflatable‑specific automation.'
          },
          'Goodshuffle Pro': {
            value: false,
            note: 'Covers all event rentals; no inflatable‑specific guardrails.'
          }
        }
      }
    ]
  },
  {
    id: 'automation',
    category: 'Booking & Automation',
    icon: Calendar,
    items: [
      {
        name: '24/7 Online Booking',
        tooltip: 'Real‑time inventory checkout—no back‑and‑forth phone tags.',
        icon: Calendar,
        details: {
          InflateMate: {
            value: true,
            note: 'Live inventory grid with buffer windows & payment capture.'
          },
          'Inflatable Office': { value: true, note: TRUE_NOTE },
          'Event Rental Systems': { value: true, note: TRUE_NOTE },
          'Goodshuffle Pro': { value: true, note: TRUE_NOTE }
        }
      },
      {
        name: 'Automated Digital Waivers',
        tooltip: 'E‑sign contracts triggered automatically after booking.',
        icon: FileText,
        details: {
          InflateMate: {
            value: true,
            note: 'DocuSeal integration auto‑sends & tracks signatures.'
          },
          'Inflatable Office': {
            value: false,
            note: 'Manual doc sending or pricey 3rd‑party add‑on.'
          },
          'Event Rental Systems': { value: false, note: 'Requires external waiver workflow.' },
          'Goodshuffle Pro': { value: false, note: 'Document centre in higher tier; extra cost.' }
        }
      },
      {
        name: 'Real‑time Inventory Sync',
        tooltip: 'Conflict‑free scheduling with hold timers during checkout.',
        icon: Box,
        details: {
          InflateMate: { value: true, note: 'Holds items as cart locked; prevents double‑booking.' },
          'Inflatable Office': { value: true, note: 'Supports holds but via dated batch runs.' },
          'Event Rental Systems': { value: false, note: 'Relies on manual checks or nightly syncs.' },
          'Goodshuffle Pro': { value: true, note: TRUE_NOTE }
        }
      }
    ]
  },
  {
    id: 'growth',
    category: 'Growth & Communication',
    icon: MessageSquare,
    items: [
      {
        name: 'Integrated Website Builder',
        tooltip: 'Launch a branded site—no WordPress plugin hunt.',
        icon: Sparkles,
        details: {
          InflateMate: {
            value: true,
            note: 'Drag‑and‑drop themes with live preview; free custom domain automation.'
          },
          'Inflatable Office': { value: false, note: 'No DIY builder; must buy stand‑alone site module.' },
          'Event Rental Systems': { value: false, note: 'Provides basic listing—not customisable builder.' },
          'Goodshuffle Pro': { value: false, note: 'Widget only; brings your own CMS.' }
        }
      },
      {
        name: 'Lead Capture & Marketing',
        tooltip: 'Pop‑ups, coupons, & email funnels baked in—no Mailchimp hackery.',
        icon: Zap,
        details: {
          InflateMate: {
            value: true,
            note: 'Built‑in coupons, pop‑ups, and automated follow‑up emails.'
          },
          'Inflatable Office': { value: false, note: 'Marketing suite sold separately.' },
          'Event Rental Systems': { value: false, note: 'Limited or no marketing automation.' },
          'Goodshuffle Pro': { value: false, note: 'Focuses on quotes, not lead funnels.' }
        }
      },
      {
        name: 'Integrated Email & SMS',
        tooltip: 'Automatic confirmations and reminder texts (SMS coming Q4 2025—Growth plans get 500 msgs).',
        icon: MessageSquare,
        details: {
          InflateMate: {
            value: true,
            note: 'Email live today; SMS beta launching once 10 paying users—500 msgs free for Growth.'
          },
          'Inflatable Office': { value: true, note: TRUE_NOTE },
          'Event Rental Systems': { value: true, note: TRUE_NOTE },
          'Goodshuffle Pro': {
            value: false,
            note: 'SMS requires 3rd‑party or higher tier add‑on.'
          }
        }
      }
    ]
  },
  {
    id: 'value',
    category: 'Value & Pricing',
    icon: DollarSign,
    items: [
      {
        name: 'Simple, Flat Pricing',
        tooltip: 'Two transparent plans, no per‑module charges.',
        icon: CheckCircle2,
        details: {
          InflateMate: {
            value: true,
            note: 'Starter $49 (1 seat) | Growth $119 (3 seats + early features). No hidden fees.'
          },
          'Inflatable Office': {
            value: false,
            note: 'Website module $39 extra; pricing jumps with inventory.'
          },
          'Event Rental Systems': {
            value: false,
            note: 'Starts $149.95; SMS & email packs extra.'
          },
          'Goodshuffle Pro': {
            value: false,
            note: 'Base $99 + $49 per seat + $79 site integration.'
          }
        }
      }
    ]
  }
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
        </div>
      </div>
    </section>
  );
}
