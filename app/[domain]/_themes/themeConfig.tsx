// themeConfig.ts

import React from 'react';

// Helper to calculate contrast: returns "#000000" for light backgrounds, or "#ffffff" for dark backgrounds.
export const getContrastColor = (hex: string): string => {
  // Simplified hex validation and expansion
  let color = (hex || '#ffffff').replace('#', '');
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  if (color.length !== 6) {
    console.warn('Invalid hex color format for contrast calculation:', hex);
    return '#000000'; // Default to black on error
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};

export interface ThemeColors {
  primary: string;
  accent: string;
  secondary: string;
  background: string;
  text: string;
}

// Standard transition for consistency
const standardTransition = 'all 0.3s ease';

export interface ThemeDefinition {
  // Header styles
  headerBg: (colors: ThemeColors, scrolled: boolean) => string;
  headerTextColor: (colors: ThemeColors) => string;
  boxShadow: (colors: ThemeColors, scrolled: boolean) => string;
  extraBorderStyle: (colors: ThemeColors) => React.CSSProperties;

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
}

interface BookingStylesConfig {
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

const modernBookingStyles: BookingStylesConfig = {
  formBackground: (colors) => `${colors.background}ff`,
  formBorder: (colors) => `1px solid ${colors.primary}20`,
  formShadow: (colors) => `0 4px 6px ${colors.primary}10`,
  formTextColor: (colors) => colors.secondary,
  stepBackground: (colors, isActive) => isActive ? colors.primary : 'transparent',
  stepBorder: (colors, isActive) => `2px solid ${isActive ? colors.primary : colors.secondary}40`,
  stepTextColor: (colors, isActive) => isActive ? colors.primary : colors.text,
  stepIconColor: (colors, isActive) => isActive ? '#ffffff' : colors.text,
  
  availabilityCard: {
    background: (colors) => `${colors.background}ff`,
    border: (colors, isSelected) => `2px solid ${isSelected ? colors.primary : colors.secondary}20`,
    shadow: (colors) => `0 2px 4px ${colors.primary}10`,
    hoverShadow: (colors) => `0 4px 12px ${colors.primary}20`,
    selectedBackground: (colors) => `${colors.primary}05`,
    imageContainer: (colors) => `${colors.primary}05`,
    priceTag: {
      background: (colors) => colors.primary,
      color: (colors) => getContrastColor(colors.primary)
    },
    specContainer: {
      background: (colors) => `${colors.primary}05`,
      border: (colors) => `1px solid ${colors.primary}10`
    }
  },
  
  summaryCard: {
    background: (colors) => `${colors.background}`,
    border: (colors) => `3px dashed ${colors.accent}`,
    shadow: () => '0 8px 16px rgba(0, 0, 0, 0.1)',
    headerBackground: (colors) => `${colors.accent}20`,
    rowBackground: (colors, isAlternate) => isAlternate ? `${colors.secondary}10` : '#ffffff',
  },
  
  input: {
    background: () => '#ffffff',
    border: (colors) => `3px dashed ${colors.secondary}`,
    focusBorder: (colors) => colors.accent,
    placeholderColor: () => 'rgba(0, 0, 0, 0.4)',
    labelColor: (colors) => colors.text,
  },
  
  timeSlot: {
    background: (colors, isAvailable) => isAvailable ? '#ffffff' : `${colors.secondary}20`,
    border: (colors, isAvailable) => `3px dashed ${isAvailable ? colors.accent : colors.secondary}`,
    textColor: (colors, isAvailable) => isAvailable ? colors.text : colors.secondary,
  },
};

export const themeConfig: { [key: string]: ThemeDefinition } = {
  modern: {
    // Header: Nearly white bg, minimal scroll shadow, thin bottom border
    headerBg: (colors) => `${colors.primary}`,
    headerTextColor: (colors) => colors.text,
    boxShadow: (_colors, scrolled) => scrolled ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
    extraBorderStyle: (colors) => ({ borderBottom: `1px solid ${colors.primary}50` }),
    
    // Buttons: Primary bg, secondary hover, rounded, subtle shadow
    buttonStyles: {
      background: (colors) => colors.secondary,
      textColor: (colors) => colors.text,
      border: () => `none`,
      boxShadow: () => `none`,
      hoverBackground: (colors) => colors.primary,
      hoverTextColor: (colors) => colors.text,
      hoverBoxShadow: (colors) => `0 4px 10px ${colors.primary}20`,
      transition: standardTransition,
      borderRadius: '12px'
    },
    // Secondary Buttons: Transparent, primary border/text, subtle hover
    secondaryButtonStyles: {
      background: () => 'transparent',
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.secondary}`,
      boxShadow: () => 'none',
      hoverBackground: (colors) => colors.secondary,
      hoverTextColor: (colors) => colors.text,
      hoverBorder: (colors) => `4px solid ${colors.secondary}`,
      hoverBoxShadow: () => 'none',
      transition: standardTransition,
      borderRadius: '12px'
    },
    // Cards: White, thin border, subtle shadow, rounded
    cardStyles: {
      background: () => '#ffffff',
      border: (colors) => `1px solid ${colors.primary}33`,
      boxShadow: () => '0 4px 5px rgba(0,0,0,0.08)',
      textColor: (colors) => colors.primary,
      borderRadius: '16px'
    },
    // Sections: Gradients and clean lines
    heroBackground: (colors) => colors.primary,
    heroTitleColor: (colors) => colors.text,
    heroTextColor: (colors) => colors.text,
    featureSectionStyles: {
      titleColor: (colors) => colors.primary,
      cardBackground: () => '#ffffff',
      iconBackground: (colors, index) => [ `${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15` ][index % 3],
      cardTitleColor: (colors) => colors.primary,
      cardTextColor: (colors) => colors.primary,
      iconBorder: (colors) => `1px solid ${colors.primary}33`,
      iconBoxShadow: () => '0 4px 5px rgba(0,0,0,0.08)',
      iconBorderRadius: () => '16px'
    },
    popularRentalsStyles: {
      background: (colors) => ({
        backgroundColor: colors.background || '#f1f3f5',
        backgroundImage: `linear-gradient(135deg, ${colors.primary}80, ${colors.secondary}80),
          radial-gradient(circle at 15% 85%, ${colors.primary}15, transparent 50%),
          radial-gradient(circle at 85% 25%, ${colors.secondary}15, transparent 50%)`
      }),
      titleColor: (colors) => colors.text,
      cardBackgroundGradient: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      priceColor: (colors) => colors.accent
    },
    ctaStyles: {
      background: (colors) => colors.accent,
      titleColor: (colors) => colors.text,
      textColor: (colors) => colors.text
    },
    contactStyles: {
      background: (colors) => colors.background,
      titleColor: (colors) => colors.primary,
      cardBackground: () => '#ffffff',
      iconBackground: (colors, type) =>
        ({ primary: `${colors.primary}20`, accent: `${colors.accent}20`, secondary: `${colors.secondary}20` }[type]),
      textColor: (colors) => colors.text,
      serviceAreaTagBackground: (colors, index) => [ `${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15` ][index % 3],
      serviceAreaTagColor: (colors, index) => [ colors.primary, colors.accent, colors.secondary ][index % 3],
      cardBorder: (colors) => `1px solid ${colors.primary}33`,
      cardBoxShadow: () => '0 4px 5px rgba(0,0,0,0.08)'
    },
    footerStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.secondary}`,
      boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`
    },
    // Links: Understated, subtle border, primary hover
    linkStyles: {
      background: (colors) => colors.secondary,
      textColor: (colors) => colors.text,
      border: () => 'none',
      boxShadow: () => 'none',
      hoverBackground: (colors) => colors.primary,
      hoverTextColor: (colors) => colors.text,
      hoverBorder: (colors) => `4px solid ${colors.accent}`,
      hoverBoxShadow: () => 'none',
      transition: standardTransition,
      active: (colors) => colors.primary,
      borderRadius: '12px'
    },
    // Images: Subtle border, rounded corners, soft shadow
    imageStyles: (colors) => ({
      border: `1px solid ${colors.accent}33`,
      backgroundColor: colors.accent,
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      transition: standardTransition
    }),
    bookingStyles: modernBookingStyles,
    // Add imageTextStyles for modern theme
    imageTextStyles: {
      containerBackground: (colors) => colors.background,
      titleColor: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      imageContainerStyle: (colors) => ({
        border: `1px solid ${colors.primary}33`,
        borderRadius: '12px',
        boxShadow: '0 4px 5px rgba(0,0,0,0.08)',
      }),
    }
  },

  retro: {
    // Header: Solid primary, thick accent border, heavy inset scroll shadow
    headerBg: (colors) => colors.primary,
    headerTextColor: (colors) => colors.text,
    boxShadow: (colors, scrolled) => scrolled ? `inset 0 -12px 0 0 ${colors.accent}` : 'none', // Increased shadow
    extraBorderStyle: (colors) => ({
      borderBottom: `8px solid ${colors.accent}`, // Increased border
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0'
    }),
    // Buttons: Accent bg, THICK secondary border/shadow, reversed hover
    buttonStyles: {
      background: (colors) => colors.accent,
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.secondary}`, // Increased border
      boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`, // Renamed
      hoverBackground: (colors) => colors.secondary,
      hoverTextColor: (colors) => colors.text,
      hoverBorder: (colors) => `4px solid ${colors.primary}`, // Increased border
      hoverBoxShadow: (colors) => `4px 4px 0 ${colors.primary}`, // Renamed
      transition: standardTransition, // Consistent transition
      borderRadius: '0px'
    },
    // Secondary Buttons: Primary bg, consistent thick style
    secondaryButtonStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.secondary}`,
      boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`, // Renamed
      hoverBackground: (colors) => colors.secondary,
      hoverTextColor: (colors) => getContrastColor(colors.secondary),
      hoverBorder: (colors) => `4px solid ${colors.primary}`, // Increased border
      hoverBoxShadow: (colors) => `4px 4px 0 ${colors.primary}`, // Renamed
      transition: standardTransition,
      borderRadius: '0px'
    },
    // Cards: Tinted bg, THICK accent border, heavy secondary shadow, NO radius
    cardStyles: {
      background: (colors) => colors.background || '#fffef8',
      border: (colors) => `5px solid ${colors.accent}`, // Increased border
      boxShadow: (colors) => `5px 5px 0 ${colors.secondary}`, // Renamed
      textColor: (colors) => colors.primary,
      borderRadius: '0px' // Explicitly no radius
    },
    // Sections: Flat colors, raw look
    heroBackground: (colors) => colors.primary, 
    heroTitleColor: (colors) => colors.text,
    heroTextColor: (colors) => colors.secondary,
    featureSectionStyles: {
      titleColor: (colors) => colors.accent,
      // Cycle through semi-transparent theme colors for card background
      cardBackground: (colors: ThemeColors) => colors.background, 
      iconBackground: (colors, index) => [ colors.accent, colors.primary, colors.secondary ][index % 3], 
      cardTitleColor: (colors: ThemeColors, index: number) => [colors.primary, colors.primary, colors.primary][index % 3], 
      cardTextColor: (colors) => colors.secondary,
      iconBorder: (colors: ThemeColors, index: number) => [ `4px solid ${colors.secondary}`, `4px solid ${colors.accent}`, `4px solid ${colors.primary}` ][index % 3],
      iconBoxShadow: (colors: ThemeColors, index: number) => [ `8px 8px 0 ${colors.secondary}`, `8px 8px 0 ${colors.accent}`, `8px 8px 0 ${colors.primary}` ][index % 3],
      iconBorderRadius: () => '16px'
    },
    popularRentalsStyles: {
      background: (colors) => ({
        backgroundColor: colors.primary
      }),
      titleColor: (colors) => colors.text,
      cardBackgroundGradient: (colors) => colors.accent, // FLAT accent color for card top
      priceColor: (colors) => colors.secondary
    },
    ctaStyles: {
      background: (colors) => colors.accent, // FLAT accent color
      titleColor: (colors) => colors.secondary,
      textColor: (colors) => colors.text
    },
    contactStyles: {
      background: (colors) => `${colors.background}`,
      titleColor: (colors) => colors.secondary,
      cardBackground: (colors) => `${colors.background}ff`,
      iconBackground: (colors, type) =>
        ({ primary: `${colors.primary}`, accent: `${colors.accent}`, secondary: `${colors.secondary}` }[type]),
      textColor: (colors) => colors.accent,
      serviceAreaTagBackground: (colors, index) => [ colors.accent, colors.primary, colors.secondary ][index % 3],
      serviceAreaTagColor: (colors) => colors.text,
      cardBorder: (colors) => `4px solid ${colors.accent}`,
      cardBoxShadow: (colors) => `8px 8px 0 ${colors.secondary}`
    },
    footerStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.secondary}`,
      boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
      
    },
    // Links: Mirror button styling
    linkStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.secondary}`,
      boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`, // Renamed
      hoverBackground: (colors) => colors.secondary,
      hoverTextColor: (colors) => getContrastColor(colors.secondary),
      hoverBorder: (colors) => `4px solid ${colors.primary}`, // Increased border
      hoverBoxShadow: (colors) => `4px 4px 0 ${colors.primary}`, // Renamed
      transition: standardTransition,
      borderRadius: '0px',
      active: (colors) => colors.secondary,
    },
    // Images: THICK accent border, NO radius, heavy secondary shadow
    imageStyles: (colors) => ({
      border: `4px solid ${colors.accent}`,
      borderRadius: '0',
      boxShadow: `8px 8px 0 ${colors.secondary}`, // Renamed
      transition: standardTransition
    }),
    bookingStyles: {
      formBackground: (colors) => colors.background,
      formBorder: (colors) => `4px solid ${colors.accent}`,
      formShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
      formTextColor: (colors) => colors.secondary,
      stepBackground: (colors, isActive) => isActive ? colors.primary : 'transparent',
      stepBorder: (colors, isActive) => `4px solid ${isActive ? colors.accent : colors.secondary}`,
      stepTextColor: (colors, isActive) => isActive ? colors.accent : colors.text,
      stepIconColor: (colors, isActive) => isActive ? colors.accent : colors.secondary,
      
      availabilityCard: {
        background: () => '#fffef8',
        border: (colors, isSelected) => `4px solid ${isSelected ? colors.accent : colors.secondary}`,
        shadow: colors => `4px 4px 0 ${colors.secondary}`,
        hoverShadow: colors => `8px 8px 0 ${colors.secondary}`,
        selectedBackground: () => '#fffef8',
        imageContainer: () => '#fffef8',
        priceTag: {
          background: (colors) => colors.accent,
          color: () => '#000000',
        },
        specContainer: {
          background: () => '#fffef8',
          border: (colors) => `2px solid ${colors.secondary}`,
        },
      },
      
      summaryCard: {
        background: () => '#fffef8',
        border: (colors) => `4px solid ${colors.accent}`,
        shadow: (colors) => `8px 8px 0 ${colors.secondary}`,
        headerBackground: (colors) => colors.accent,
        rowBackground: (colors, isAlternate) => isAlternate ? `${colors.secondary}20` : '#fffef8',
      },
      
      input: {
        background: () => '#fffef8',
        border: (colors) => `4px solid ${colors.secondary}`,
        focusBorder: (colors) => colors.accent,
        placeholderColor: () => 'rgba(0, 0, 0, 0.5)',
        labelColor: (colors) => colors.secondary,
      },
      
      timeSlot: {
        background: (colors, isAvailable) => isAvailable ? '#fffef8' : colors.secondary + '20',
        border: (colors, isAvailable) => `4px solid ${isAvailable ? colors.accent : colors.secondary}`,
        textColor: (colors, isAvailable) => isAvailable ? colors.text : colors.secondary,
      },
    },
    // Add imageTextStyles for retro theme
    imageTextStyles: {
      containerBackground: (colors) => colors.background || '#fffef8',
      titleColor: (colors) => colors.accent,
      textColor: (colors) => colors.secondary,
      imageContainerStyle: (colors) => ({
        border: `4px solid ${colors.accent}`,
        borderRadius: '0px',
        boxShadow: `8px 8px 0 ${colors.secondary}`,
      }),
    }
  },

  playful: {
    // Header: Accent bg, light shadow, dashed border
    headerBg: (colors) => colors.primary,
    headerTextColor: (colors) => colors.text,
    boxShadow: (_, scrolled) => scrolled ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.05)',
      extraBorderStyle: (colors) => ({
        borderBottom: `4px solid ${colors.accent}`,
      }),
    
    buttonStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.accent}`,
      boxShadow: () => '0 4px 8px rgba(0,0,0,0.15)',
      hoverBackground: (colors) => colors.secondary,
      hoverTextColor: (colors) => colors.text,
      hoverBorder: (colors) => `4px solid ${colors.accent}`,
      hoverBoxShadow: (colors) => `0px 0px 0 ${colors.primary}`,
      transition: standardTransition,
      borderRadius: '9999px'  
    },
    // Secondary Buttons: border, pill shape
    secondaryButtonStyles: {
      background: () => 'transparent',
      textColor: (colors) => colors.text,
      border: (colors) => `4px solid ${colors.accent}`,
      boxShadow: () => '0 4px 8px rgba(0,0,0,0.15)',
      hoverBackground: (colors) => colors.primary,
      hoverTextColor: (colors) => getContrastColor(colors.primary),
      hoverBorder: (colors) => `4px solid ${colors.accent}`,
      hoverBoxShadow: (colors) => `0px 0px 0 ${colors.primary}`,
      transition: standardTransition,
      borderRadius: '9999px'
    },
    // Cards: Dashed border, rounded
    cardStyles: {
      background: (colors) => colors.background,
      border: (colors) => `3px solid ${colors.accent}`,
      boxShadow: () => '0 4px 8px rgba(0,0,0,0.12)', // Renamed
      textColor: (colors) => getContrastColor(colors.background),
      borderRadius: '20px' // Added consistent rounding for playful cards
    },
    // Sections: Gradients and vibrant colors
    heroBackground: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    heroTitleColor: (colors) => colors.text,
    heroTextColor: (colors) => colors.secondary,
    featureSectionStyles: {
      titleColor: (colors) => colors.primary,
      cardBackground: (colors, index) => [ `${colors.primary}90`, `${colors.accent}90`, `${colors.secondary}90` ][index % 3],
      iconBackground: (colors, index) => [ `${colors.primary}`, `${colors.accent}`, `${colors.secondary}` ][index % 3],
      cardTitleColor: (colors) => colors.text,
      cardTextColor: (colors) => colors.secondary,
      iconBorder: (colors) => `4px solid ${colors.primary}33`,
      iconBoxShadow: () => '0 4px 8px rgba(0,0,0,0.15)',
      iconBorderRadius: () => '16px'
    },
    popularRentalsStyles: {
      background: (colors) => ({
        backgroundColor: colors.background || '#ffffff',
        backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}),
          radial-gradient(circle at 15% 85%, ${colors.primary}25, transparent 50%),
          radial-gradient(circle at 85% 25%, ${colors.secondary}25, transparent 50%)`
      }),
      titleColor: (colors) => colors.text,
      cardBackgroundGradient: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      priceColor: (colors) => colors.accent
    },
    ctaStyles: {
      background: (colors) => `linear-gradient(135deg, ${colors.accent}, ${colors.accent}90)`,
      titleColor: (colors) => getContrastColor(colors.accent),
      textColor: (colors) => getContrastColor(colors.accent)
    },
    contactStyles: {
      background: (colors) => `${colors.background}f5`,
      titleColor: (colors) => colors.primary,
      cardBackground: (colors) => `${colors.background}ff`,
      iconBackground: (colors, type) =>
        ({ primary: `${colors.primary}30`, accent: `${colors.accent}30`, secondary: `${colors.secondary}30` }[type]),
      textColor: (colors) => colors.text,
      serviceAreaTagBackground: (colors, index) => [ `${colors.primary}20`, `${colors.accent}20`, `${colors.secondary}20` ][index % 3],
      serviceAreaTagColor: (colors, index) => [ colors.primary, colors.accent, colors.secondary ][index % 3],
      cardBorder: (colors) => `2px solid ${colors.accent}`,
      cardBoxShadow: (colors) => `0 4px 8px ${colors.secondary}20`
    },
    footerStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => getContrastColor(colors.primary),
      border: (colors) => `4px solid ${colors.secondary}`,
      boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
      
    },
    // Links: Pill shape
    linkStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.text,
      border: (colors) => `2px solid ${colors.accent}`,
      boxShadow: (colors) => `0 0 0 ${colors.secondary}00`,
      hoverBackground: (colors) => colors.primary,
      hoverTextColor: (colors) => colors.text,
      hoverBorder: (colors) => `2px solid ${colors.accent}`,
      hoverBoxShadow: (colors) => `0 0 0 ${colors.secondary}00`,
      transition: standardTransition,
      active: (colors) => colors.secondary,
      borderRadius: '9999px'
    },
    // Images: Soft rounded corners, accent border, elevated shadow
    imageStyles: (colors) => ({
      border: `2px solid ${colors.accent}`,
      borderRadius: '20px',
      boxShadow: `0 6px 10px ${colors.secondary}30`,
      transition: standardTransition
    }),
    bookingStyles: {
      formBackground: (colors) => colors.background,
      formBorder: (colors) => `3px dashed ${colors.accent}`,
      formShadow: () => '0 8px 16px rgba(0, 0, 0, 0.1)',
      formTextColor: (colors) => colors.secondary,  
      
      stepBackground: (colors, isActive) => isActive ? colors.primary : 'transparent',
      stepBorder: (colors, isActive) => `3px solid ${isActive ? colors.accent : colors.secondary}`,
      stepTextColor: (colors, isActive) => isActive ? colors.accent : colors.secondary,
      stepIconColor: (colors, isActive) => isActive ? colors.accent : getContrastColor(colors.background),
      
      availabilityCard: {
        background: (colors) => `${colors.background}`,
        border: (colors, isSelected) => `3px dashed ${isSelected ? colors.accent : colors.secondary}`,
        shadow: () => '0 4px 8px rgba(0, 0, 0, 0.1)',
        hoverShadow: () => '0 8px 16px rgba(0, 0, 0, 0.15)',
        selectedBackground: (colors) => `${colors.accent}10`,
        imageContainer: (colors) => `${colors.accent}10`,
        priceTag: {
          background: (colors) => colors.accent,
          color: () => '#ffffff',
        },
        specContainer: {
          background: (colors) => `${colors.secondary}10`,
          border: (colors) => `2px dashed ${colors.secondary}`,
        },
      },
      
      summaryCard: {
        background: (colors) => `${colors.background}`,
        border: (colors) => `3px dashed ${colors.accent}`,
        shadow: () => '0 8px 16px rgba(0, 0, 0, 0.1)',
        headerBackground: (colors) => `${colors.accent}20`,
        rowBackground: (colors, isAlternate) => isAlternate ? `${colors.secondary}10` : '#ffffff',
      },
      
      input: {
        background: () => '#ffffff',
        border: (colors) => `3px dashed ${colors.secondary}`,
        focusBorder: (colors) => colors.accent,
        placeholderColor: () => 'rgba(0, 0, 0, 0.4)',
        labelColor: (colors) => colors.text,
      },
      
      timeSlot: {
        background: (colors, isAvailable) => isAvailable ? '#ffffff' : `${colors.secondary}20`,
        border: (colors, isAvailable) => `3px dashed ${isAvailable ? colors.accent : colors.secondary}`,
        textColor: (colors, isAvailable) => isAvailable ? colors.text : colors.secondary,
      },
    },
    // Add imageTextStyles for playful theme
    imageTextStyles: {
      containerBackground: (colors) => colors.background,
      titleColor: (colors) => colors.primary,
      textColor: (colors) => getContrastColor(colors.background),
      imageContainerStyle: (colors) => ({
        border: `3px dashed ${colors.accent}`,
        borderRadius: '20px',
        boxShadow: '0 6px 10px rgba(0,0,0,0.12)',
      }),
    }
  }
};
