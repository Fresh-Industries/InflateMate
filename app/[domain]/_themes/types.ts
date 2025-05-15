/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/_themes/types.ts  (new helper file)

import { CSSProperties } from 'react';

export type ColorScale = {
  100: string;
  500: string;
  900: string;
};

export interface ThemeColors {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    background: ColorScale;
    text: ColorScale;
}

export interface ThemeDefinition {
    // Header styles
    headerBg: (colors: ThemeColors, scrolled: boolean) => string;
    headerTextColor: (colors: ThemeColors) => string;
    boxShadow: (colors: ThemeColors, scrolled: boolean) => string;
    extraBorderStyle: (colors: ThemeColors) => React.CSSProperties;
    // Enhanced header styles
    headerGlassEffect?: boolean; // Enable glass morphism effect 
    headerAccentElements?: (colors: ThemeColors) => React.CSSProperties; // Special accents for the header
    headerAnimation?: string; // Animation for header elements
    navItemStyles?: {
      normal: (colors: ThemeColors) => React.CSSProperties;
      hover: (colors: ThemeColors) => React.CSSProperties;
      active: (colors: ThemeColors) => React.CSSProperties;
    };
  
    // Button styles
    buttonStyles: {
      background: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
      border?: (colors: ThemeColors) => string;
      boxShadow?: (colors: ThemeColors) => string;
      hoverBackground: (colors: ThemeColors) => string;
      hoverTextColor?: (colors: ThemeColors) => string;
      hoverBorder?: (colors: ThemeColors) => string;
      hoverBoxShadow?: (colors: ThemeColors) => string;
      transition?: string;
      borderRadius?: string;
      animation?: string;
    };
    secondaryButtonStyles?: {
      background: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
      border?: (colors: ThemeColors) => string;
      boxShadow?: (colors: ThemeColors) => string;
      borderRadius?: string;
      transition?: string;
      hoverBackground?: (colors: ThemeColors) => string;
      hoverTextColor?: (colors: ThemeColors) => string;
      hoverBorder?: (colors: ThemeColors) => string;
      hoverBoxShadow?: (colors: ThemeColors) => string;
      animation?: string;
    };
  
    // Card styles
    cardStyles: {
      background: (colors: ThemeColors) => string;
      border: (colors: ThemeColors) => string;
      boxShadow: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
      // Optional: Add borderRadius if needed across themes
      borderRadius?: string;
    };
  
    // Section styles
    heroBackground?: (colors: ThemeColors) => string;
    heroTitleColor?: (colors: ThemeColors) => string;
    heroTextColor?: (colors: ThemeColors) => string;
    featureSectionStyles?: {
      titleColor: (colors: ThemeColors) => string;
      cardBackground: (colors: ThemeColors, index: number) => string;
      iconBackground: (colors: ThemeColors, index: number) => string;
      cardTitleColor: (colors: ThemeColors, index: number) => string;
      cardTextColor: (colors: ThemeColors) => string;
      iconBorder: (colors: ThemeColors, index: number) => string;
      iconBoxShadow: (colors: ThemeColors, index: number) => string;
      iconBorderRadius: (colors: ThemeColors) => string;
      
      
    };
    popularRentalsStyles?: {
      background: (colors: ThemeColors) => React.CSSProperties;
      titleColor: (colors: ThemeColors) => string;
      cardBackgroundGradient: (colors: ThemeColors) => string;
      priceColor: (colors: ThemeColors) => string;
    };
    ctaStyles?: {
      background: (colors: ThemeColors) => string;
      titleColor: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
    };
    contactStyles?: {
      background: (colors: ThemeColors) => string;
      titleColor: (colors: ThemeColors) => string;
      cardBackground: (colors: ThemeColors) => string;
      iconBackground: (colors: ThemeColors, type: 'primary' | 'accent' | 'secondary') => string;
      textColor: (colors: ThemeColors) => string;
      serviceAreaTagBackground: (colors: ThemeColors, index: number) => string;
      serviceAreaTagColor: (colors: ThemeColors, index: number) => string;
      cardBorder: (colors: ThemeColors) => string;
      cardBoxShadow: (colors: ThemeColors) => string;
    };
  
    // New ImageTextSection styles
    imageTextStyles?: {
      containerBackground: (colors: ThemeColors) => string;
      titleColor: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
      imageContainerStyle: (colors: ThemeColors) => React.CSSProperties;
    };
  
  
    footerStyles?: {
      background: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
      border: (colors: ThemeColors) => string;
      boxShadow: (colors: ThemeColors) => string;
      // Enhanced footer styles
      pattern?: (colors: ThemeColors) => string; // Background pattern
      accentElements?: (colors: ThemeColors) => React.CSSProperties; // Special accents for the footer
      linkStyles?: {
        normal: (colors: ThemeColors) => React.CSSProperties;
        hover: (colors: ThemeColors) => React.CSSProperties;
      };
      sectionTitleStyles?: (colors: ThemeColors) => React.CSSProperties; // Styles for footer section titles
      footerAnimation?: string; // Animation for footer elements
      socialIconStyles?: (colors: ThemeColors) => React.CSSProperties; // Styles for social media icons
      borderTop?: (colors: ThemeColors) => string;
    };
  
    // Link styles
    linkStyles?: {
      background: (colors: ThemeColors) => string;
      textColor: (colors: ThemeColors) => string;
      border: (colors: ThemeColors) => string;
      boxShadow: (colors: ThemeColors) => string;
      hoverBackground: (colors: ThemeColors) => string;
      hoverTextColor: (colors: ThemeColors) => string;
      hoverBorder: (colors: ThemeColors) => string;
      hoverBoxShadow: (colors: ThemeColors) => string;
      transition: string;
      active: (colors: ThemeColors) => string;
      borderRadius: string;
      activeBoxShadow?: (colors: ThemeColors) => string;
      customStyles?: (colors: ThemeColors) => React.CSSProperties;
    };
  
    // Image styles: Applied to key images like logo, hero, inventory cards
    imageStyles: (colors: ThemeColors) => React.CSSProperties;
  
    // Add booking-specific styles
    bookingStyles: {
      // Form styles
      formBackground: (colors: ThemeColors) => string;
      formBorder: (colors: ThemeColors) => string;
      formShadow: (colors: ThemeColors) => string;
      formTextColor: (colors: ThemeColors) => string;
      
      // Progress steps
      stepBackground: (colors: ThemeColors, isActive: boolean) => string;
      stepBorder: (colors: ThemeColors, isActive: boolean) => string;
      stepTextColor: (colors: ThemeColors, isActive: boolean) => string;
      stepIconColor: (colors: ThemeColors, isActive: boolean) => string;
      
      // Availability cards
      availabilityCard: {
        background: (colors: ThemeColors) => string;
        border: (colors: ThemeColors, isSelected: boolean) => string;
        shadow: (colors: ThemeColors) => string;
        hoverShadow: (colors: ThemeColors) => string;
        selectedBackground: (colors: ThemeColors) => string;
        imageContainer: (colors: ThemeColors) => string;
        priceTag: {
          background: (colors: ThemeColors) => string;
          color: (colors: ThemeColors) => string;
        };
        specContainer: {
          background: (colors: ThemeColors) => string;
          border: (colors: ThemeColors) => string;
        };
      };
      
      // Summary card
      summaryCard: {
        background: (colors: ThemeColors) => string;
        border: (colors: ThemeColors) => string;
        shadow: (colors: ThemeColors) => string;
        headerBackground: (colors: ThemeColors) => string;
        rowBackground: (colors: ThemeColors, isAlternate: boolean) => string;
      };
      
      // Form fields
      input: {
        background: (colors: ThemeColors) => string;
        border: (colors: ThemeColors) => string;
        focusBorder: (colors: ThemeColors) => string;
        placeholderColor: (colors: ThemeColors) => string;
        labelColor: (colors: ThemeColors) => string;
      };
      
      // Time slots
      timeSlot: {
        background: (colors: ThemeColors, isAvailable: boolean) => string;
        border: (colors: ThemeColors, isAvailable: boolean) => string;
        textColor: (colors: ThemeColors, isAvailable: boolean) => string;
      };
    };
    
    // Global animation settings
    animations?: {
      pageTransition?: string;
      sectionTransition?: string;
      elementEntrance?: string;
      pulseGlow?: string;
    };
    
    // Global decorative elements
    decorativeElements?: {
      shapesColor?: (colors: ThemeColors) => string;
      patternOpacity?: number;
      enableParticles?: boolean;
    };

    // Global background patterns
    globalBackground?: (colors: ThemeColors) => {
      main: string;
      accent: string;
      overlay: string;
    };

    // Additional decorative patterns
    additionalPatterns?: {
      cornerDecorations: (colors: ThemeColors) => {
        topLeft: CSSProperties;
        topRight: CSSProperties;
        bottomLeft: CSSProperties;
        bottomRight: CSSProperties;
      };
      borderPatterns: (colors: ThemeColors) => {
        top: string;
        bottom: string;
        left: string;
        right: string;
      };
      backgroundPatterns: (colors: ThemeColors) => string[];
    };

    heroAccentElements?: (colors: ThemeColors) => {
      topLeft: CSSProperties;
      topRight: CSSProperties;
      bottomLeft: CSSProperties;
      bottomRight: CSSProperties;
    };

    sectionTransitions?: {
      enter: string;
      exit: string;
      duration: string;
    };
}

export interface BookingStylesConfig {
    formBackground: (colors: ThemeColors) => string;
    formBorder: (colors: ThemeColors) => string;
    formShadow: (colors: ThemeColors) => string;
    formTextColor: (colors: ThemeColors) => string;
    stepBackground: (colors: ThemeColors, isActive: boolean) => string;
    stepBorder: (colors: ThemeColors, isActive: boolean) => string;
    stepTextColor: (colors: ThemeColors, isActive: boolean) => string;
    stepIconColor: (colors: ThemeColors, isActive: boolean) => string;
    
    availabilityCard: {
      background: (colors: ThemeColors) => string;
      border: (colors: ThemeColors, isSelected: boolean) => string;
      shadow: (colors: ThemeColors) => string;
      hoverShadow: (colors: ThemeColors) => string;
      selectedBackground: (colors: ThemeColors) => string;
      imageContainer: (colors: ThemeColors) => string;
      priceTag: {
        background: (colors: ThemeColors) => string;
        color: (colors: ThemeColors) => string;
      };
      specContainer: {
        background: (colors: ThemeColors) => string;
        border: (colors: ThemeColors) => string;
      };
    };
    
    summaryCard: {
      background: (colors: ThemeColors) => string;
      border: (colors: ThemeColors) => string;
      shadow: (colors: ThemeColors) => string;
      headerBackground: (colors: ThemeColors) => string;
      rowBackground: (colors: ThemeColors, isAlternate: boolean) => string;
    };
    
    input: {
      background: (colors: ThemeColors) => string;
      border: (colors: ThemeColors) => string;
      focusBorder: (colors: ThemeColors) => string;
      placeholderColor: (colors: ThemeColors) => string;
      labelColor: (colors: ThemeColors) => string;
    };
    
    timeSlot: {
      background: (colors: ThemeColors, isAvailable: boolean) => string;
      border: (colors: ThemeColors, isAvailable: boolean) => string;
      textColor: (colors: ThemeColors, isAvailable: boolean) => string;
    };
}

  
export interface ButtonStylesConfig {
    background: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
    border?: (colors: ThemeColors) => string;
    boxShadow?: (colors: ThemeColors) => string;
    hoverBackground: (colors: ThemeColors) => string;
    hoverTextColor?: (colors: ThemeColors) => string;
    hoverBorder?: (colors: ThemeColors) => string;
    hoverBoxShadow?: (colors: ThemeColors) => string;
    transition?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textTransform?: string;
    textDecoration?: string;
    animation?: string;
  }
  
  export interface CardStylesConfig {
    background: (colors: ThemeColors) => string;
    border: (colors: ThemeColors) => string;
    boxShadow: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textTransform?: string;
    textDecoration?: string;
  }
  
  export interface LinkStylesConfig {
    background: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
    border: (colors: ThemeColors) => string;
    boxShadow: (colors: ThemeColors) => string;
    hoverBackground: (colors: ThemeColors) => string;
    hoverTextColor: (colors: ThemeColors) => string;
    hoverBorder: (colors: ThemeColors) => string;
    hoverBoxShadow: (colors: ThemeColors) => string;
    transition: string;
    active: (colors: ThemeColors) => string;
    borderRadius: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textTransform?: string;
    textDecoration?: string;
  }

  export interface GlobalStylesConfig {
    globalStyles: () => string;
  }
