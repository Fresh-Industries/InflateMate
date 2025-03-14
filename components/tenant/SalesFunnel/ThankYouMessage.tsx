"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, PartyPopper, Confetti } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ThankYouMessageProps {
  message: string;
  couponCode: string | null;
  onClose: () => void;
  primaryColor: string;
}

export function ThankYouMessage({ message, couponCode, onClose, primaryColor }: ThankYouMessageProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyCode = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };
  
  // Create confetti animation elements
  const confettiElements = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.random() * 8 + 4;
    const color = i % 3 === 0 ? primaryColor : 
                 i % 3 === 1 ? '#FFD700' : '#FF6B6B';
    
    return (
      <motion.div
        key={i}
        initial={{ 
          x: 0, 
          y: 0, 
          opacity: 1,
          scale: 0
        }}
        animate={{ 
          x: (Math.random() - 0.5) * 200, 
          y: Math.random() * -300,
          opacity: 0,
          scale: 1,
          rotate: Math.random() * 360
        }}
        transition={{ 
          duration: Math.random() * 1 + 1.5,
          ease: "easeOut",
          delay: Math.random() * 0.2
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size,
          height: size,
          borderRadius: i % 2 === 0 ? '50%' : '0',
          background: color,
          zIndex: 10
        }}
      />
    );
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center relative"
    >
      {/* Confetti animation */}
      {confettiElements}
      
      <motion.div 
        initial={{ scale: 0, rotate: 45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1
        }}
        className="flex justify-center mb-6"
      >
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}60)`,
            boxShadow: `0 10px 25px -5px ${primaryColor}40`
          }}
        >
          <PartyPopper 
            className="h-10 w-10 text-white"
          />
        </div>
      </motion.div>
      
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold mb-4"
        style={{ color: primaryColor }}
      >
        Woohoo! Thank You!
      </motion.h3>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 text-gray-600 text-lg"
      >
        {message}
      </motion.p>
      
      {couponCode && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-sm text-gray-500 mb-3">Your special discount code:</p>
          <div className="flex items-center justify-center gap-3">
            <motion.div 
              className="bg-gray-50 px-6 py-3 rounded-xl font-mono text-xl relative overflow-hidden"
              style={{ 
                borderColor: primaryColor, 
                borderWidth: "2px",
                boxShadow: `0 4px 12px ${primaryColor}30`
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative z-10 font-bold tracking-wider">{couponCode}</div>
              <div 
                className="absolute inset-0 opacity-10" 
                style={{ backgroundColor: primaryColor }}
              ></div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className={cn(
                  "h-12 w-12 transition-all duration-200 rounded-xl",
                  copied ? "border-green-500 text-green-500" : `border-2 border-${primaryColor}`
                )}
                style={{ 
                  borderColor: copied ? "rgb(34, 197, 94)" : primaryColor,
                  color: copied ? "rgb(34, 197, 94)" : primaryColor
                }}
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            We've also sent this code to your email!
          </p>
        </motion.div>
      )}
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={onClose}
          className="w-full py-6 text-lg font-bold rounded-xl text-white shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}dd, ${primaryColor}aa)`,
            boxShadow: `0 10px 15px -3px ${primaryColor}40`
          }}
        >
          Awesome, Got It!
        </Button>
      </motion.div>
    </motion.div>
  );
} 