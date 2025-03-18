"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronUp, PartyPopper, Gift, Sparkles, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { ThankYouMessage } from "./ThankYouMessage";
import { motion, AnimatePresence } from "framer-motion";

export interface SalesFunnel {
  id: string;
  name: string;
  popupTitle: string;
  popupText: string;
  popupImage: string | null;
  formTitle: string;
  thankYouMessage: string;
  couponId: string | null;
  isActive: boolean;
}

export interface SalesFunnelPopupProps {
  businessId: string;
  funnel: SalesFunnel;
  colors: {
    primary: string;
    secondary: string;
  };
}

export function SalesFunnelPopup({ businessId, funnel, colors }: SalesFunnelPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to minimize popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && isVisible && !isMinimized) {
        setIsMinimized(true);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, isMinimized]);
  
  // Check for previously minimized state
  useEffect(() => {
    setIsVisible(true);
    
    const wasMinimized = localStorage.getItem(`funnel-${funnel.id}-minimized`);
    if (wasMinimized === 'true') {
      setIsMinimized(true);
    }
  }, [funnel.id]);
  
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`funnel-${funnel.id}-closed`, 'true');
    localStorage.removeItem(`funnel-${funnel.id}-minimized`);
  };
  
  const handleMinimize = () => {
    setIsMinimized(true);
    localStorage.setItem(`funnel-${funnel.id}-minimized`, 'true');
  };
  
  const handleMaximize = () => {
    setIsMinimized(false);
    localStorage.removeItem(`funnel-${funnel.id}-minimized`);
  };
  
  const handleShowDiscountForm = () => {
    setShowForm(true);
    setIsMinimized(false);
    localStorage.removeItem(`funnel-${funnel.id}-minimized`);
  };
  
  const handleFormSuccess = (code: string | null) => {
    setShowForm(false);
    setShowThankYou(true);
    setCouponCode(code);
  };
  
  if (!isVisible) return null;
  
  // Generate gradients and colors
  const gradientBg = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
  const lightPrimaryBg = `${colors.primary}10`;
  const mainTextColor = "#333333";
  const secondaryTextColor = "#666666";
  
  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {isMinimized ? (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="pointer-events-auto"
          >
            <button
              onClick={handleMaximize}
              className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full shadow-xl"
              style={{ 
                background: gradientBg,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full">
                <Gift className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm whitespace-nowrap">Spring Sale - Get 20% Off!</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 30 }}
            className="pointer-events-auto"
            style={{ filter: "drop-shadow(0 20px 50px rgba(0, 0, 0, 0.15))" }}
          >
            <div className="w-[600px] max-w-[95vw] bg-white rounded-2xl overflow-hidden">
              {/* Header */}
              <div 
                className="h-14 flex items-center justify-between px-6"
                style={{ background: gradientBg }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-white">{funnel.name || "Spring Sale"}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMinimize}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Minimize"
                  >
                    <ChevronUp className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Content area */}
              <div className="max-h-[80vh] overflow-y-auto">
                {!showForm && !showThankYou && (
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:gap-10">
                      {/* Left side - Image */}
                      <div className="md:w-2/5 mb-7 md:mb-0">
                        {funnel.popupImage ? (
                          <div className="relative aspect-square md:aspect-auto md:h-full w-full overflow-hidden rounded-xl">
                            <Image 
                              src={funnel.popupImage}
                              alt={funnel.name || "Promotion image"}
                              fill
                              sizes="(max-width: 768px) 100vw, 240px"
                              priority
                              style={{ objectFit: 'cover' }}
                              className="transition-transform duration-700"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <div 
                              className="w-24 h-24 rounded-full flex items-center justify-center"
                              style={{ background: lightPrimaryBg }}
                            >
                              <Gift 
                                style={{ color: colors.primary }}
                                className="h-12 w-12"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side - Content */}
                      <div className="md:w-3/5 flex flex-col">
                        <div className="mb-auto">
                          <h2 
                            className="text-3xl font-bold mb-3"
                            style={{ color: colors.primary }}
                          >
                            {funnel.popupTitle || "Spring Sale"}
                          </h2>
                          
                          <p 
                            className="mb-6 leading-relaxed text-base"
                            style={{ color: secondaryTextColor }}
                          >
                            {funnel.popupText || "Come jump into Spring with our special seasonal discounts on all inflatables!"}
                          </p>
                          
                          {/* Benefits list */}
                          <div className="mb-7 space-y-3">
                            {["Exclusive offer", "Limited time only", "Easy to redeem"].map((benefit, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div 
                                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                  style={{ background: lightPrimaryBg }}
                                >
                                  <Check className="h-3 w-3" style={{ color: colors.primary }} />
                                </div>
                                <span style={{ color: mainTextColor }}>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* CTA Button */}
                        <div className="mt-auto">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mb-3"
                          >
                            <Button 
                              onClick={handleShowDiscountForm}
                              className="w-full py-4 rounded-xl text-white font-semibold text-base relative overflow-hidden group"
                              style={{ 
                                background: gradientBg,
                              }}
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                Get Your Special Discount
                                <motion.div
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.5,
                                    repeatType: "loop"  
                                  }}
                                >
                                  <ArrowRight className="h-5 w-5" />
                                </motion.div>
                              </span>
                              
                              {/* Shine effect */}
                              <motion.div 
                                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12"
                                animate={{
                                  x: ['-100%', '100%'],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  duration: 2,
                                  ease: "easeInOut"
                                }}
                              />
                            </Button>
                          </motion.div>
                          
                          {/* Limited time tag */}
                          <div className="text-sm flex items-center justify-center gap-1.5">
                            <Sparkles 
                              className="h-3.5 w-3.5"
                              style={{ color: colors.secondary }} 
                            />
                            <span 
                              className="text-center"
                              style={{ color: colors.secondary }}
                            >
                              Limited time offer! Don&apos;t miss out!
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {showForm && (
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:gap-10">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <h3 
                          className="text-2xl font-bold mb-4"
                          style={{ color: colors.primary }}
                        >
                          {funnel.formTitle || "Get Your Special Discount"}
                        </h3>
                        
                        <div 
                          className="p-4 rounded-lg mb-4 flex flex-col items-start gap-3"
                          style={{ backgroundColor: lightPrimaryBg }}
                        >
                          <div className="flex gap-3 items-start">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                            >
                              <Sparkles 
                                className="h-4 w-4"
                                style={{ color: colors.primary }}
                              />
                            </div>
                            <p style={{ color: mainTextColor }}>
                              Fill out this quick form to unlock your special discount code!
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <LeadCaptureForm 
                          businessId={businessId}
                          funnelId={funnel.id}
                          onSuccess={handleFormSuccess}
                          primaryColor={colors.primary}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {showThankYou && (
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:gap-10 items-center">
                      <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "loop" 
                          }}
                        >
                          <PartyPopper 
                            className="h-20 w-20"
                            style={{ color: colors.primary }} 
                          />
                        </motion.div>
                      </div>
                      
                      <div className="md:w-3/4">
                        <ThankYouMessage 
                          message={funnel.thankYouMessage}
                          couponCode={couponCode}
                          onClose={handleClose}
                          primaryColor={colors.primary}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 