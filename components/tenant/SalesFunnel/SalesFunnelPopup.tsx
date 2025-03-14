"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronUp, MessageSquare, PartyPopper, Gift } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { ThankYouMessage } from "./ThankYouMessage";
import { cn } from "@/lib/utils";
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
  const [isVisible, setIsVisible] = useState(true); // Start visible by default
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
  
  // Always show popup on initial render and page refresh
  useEffect(() => {
    // Reset visibility state on component mount
    setIsVisible(true);
    
    // Check if popup was previously minimized
    const wasMinimized = localStorage.getItem(`funnel-${funnel.id}-minimized`);
    if (wasMinimized === 'true') {
      setIsMinimized(true);
    }
  }, [funnel.id]);
  
  const handleClose = () => {
    setIsVisible(false);
    // Store that user has closed this popup
    localStorage.setItem(`funnel-${funnel.id}-closed`, 'true');
    // Remove minimized state if it exists
    localStorage.removeItem(`funnel-${funnel.id}-minimized`);
  };
  
  const handleMinimize = () => {
    setIsMinimized(true);
    // Store minimized state
    localStorage.setItem(`funnel-${funnel.id}-minimized`, 'true');
  };
  
  const handleMaximize = () => {
    setIsMinimized(false);
    // Remove minimized state
    localStorage.removeItem(`funnel-${funnel.id}-minimized`);
  };
  
  const handleShowDiscountForm = () => {
    setShowForm(true);
    setIsMinimized(false);
    // Remove minimized state
    localStorage.removeItem(`funnel-${funnel.id}-minimized`);
  };
  
  const handleFormSuccess = (code: string | null) => {
    setShowForm(false);
    setShowThankYou(true);
    setCouponCode(code);
  };
  
  if (!isVisible) return null;
  
  // Generate a fun background gradient based on the primary and secondary colors
  const gradientBg = `linear-gradient(135deg, ${colors.primary}dd, ${colors.secondary}dd)`;
  
  return (
    <div className="fixed bottom-0 left-0 z-50 p-4 md:p-6 pointer-events-none">
      <AnimatePresence>
        {isMinimized ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              bounce: 0.5
            }}
            className="pointer-events-auto"
          >
            <Button
              onClick={handleMaximize}
              className="rounded-full p-4 shadow-xl flex items-center gap-2 text-white border-2 border-white/20"
              style={{ 
                background: gradientBg,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
              }}
            >
              <PartyPopper className="h-6 w-6 animate-bounce" />
              <span className="text-base font-bold">Get a Special Discount!</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2"
            style={{ borderColor: `${colors.primary}50` }}
          >
            {/* Fun decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-yellow-400 opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-blue-400 opacity-50"></div>
            
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ background: gradientBg, color: "white" }}
            >
              <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5" />
                <h4 className="font-bold text-base">{funnel.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Minimize popup"
                >
                  <ChevronUp className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close popup"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[80vh] overflow-y-auto">
              {!showForm && !showThankYou && (
                <div className="p-6">
                  {funnel.popupImage ? (
                    <div className="mb-6 relative h-56 w-full overflow-hidden rounded-xl">
                      <Image 
                        src={funnel.popupImage}
                        alt={funnel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority
                        style={{ objectFit: 'cover' }}
                        className="rounded-xl hover:scale-105 transition-transform duration-500"
                      />
                      <div 
                        className="absolute inset-0 rounded-xl"
                        style={{ 
                          background: `linear-gradient(0deg, ${colors.primary}30, transparent)`,
                          boxShadow: `inset 0 -4px 10px ${colors.primary}20`
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="mb-6 flex justify-center">
                      <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ background: `${colors.primary}20` }}
                      >
                        <Gift 
                          className="h-12 w-12"
                          style={{ color: colors.primary }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className={cn(
                      "text-2xl font-bold mb-3 text-center",
                      !funnel.popupImage && "mt-2"
                    )}
                    style={{ color: colors.primary }}
                    >
                      {funnel.popupTitle}
                    </h2>
                    <p className="mb-6 text-gray-600 text-center text-base leading-relaxed">{funnel.popupText}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleShowDiscountForm}
                      className="w-full py-6 text-lg font-bold rounded-xl text-white shadow-lg"
                      style={{ 
                        background: gradientBg,
                        boxShadow: `0 10px 15px -3px ${colors.primary}40`
                      }}
                    >
                      <Gift className="mr-2 h-5 w-5" />
                      Get Your Special Discount
                    </Button>
                  </motion.div>
                  
                  {/* Bouncing arrow animation */}
                  <div className="flex justify-center mt-4">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                        ease: "easeInOut" 
                      }}
                      className="text-center text-sm text-gray-400"
                    >
                      ↓ Limited time offer! ↓
                    </motion.div>
                  </div>
                </div>
              )}
              
              {showForm && (
                <div className="p-6">
                  <h3 
                    className="text-xl font-bold mb-4 text-center"
                    style={{ color: colors.primary }}
                  >
                    {funnel.formTitle}
                  </h3>
                  <LeadCaptureForm 
                    businessId={businessId}
                    funnelId={funnel.id}
                    onSuccess={handleFormSuccess}
                    primaryColor={colors.primary}
                  />
                </div>
              )}
              
              {showThankYou && (
                <div className="p-6">
                  <ThankYouMessage 
                    message={funnel.thankYouMessage}
                    couponCode={couponCode}
                    onClose={handleClose}
                    primaryColor={colors.primary}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 