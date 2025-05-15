import { ThemeDefinition } from '../types';
import { radii } from '../tokens';
import { makeBookingStyles } from '../themeFactories';



// Fun pattern library for bounce house company
const funPatterns = {
  // Balloon pattern
  balloons: (color: string, bgColor = 'transparent', opacity = 0.15) => 
    `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 13c5.523 0 10-4.477 10-10S31.523-7 26-7s-10 4.477-10 10 4.477 10 10 10zm0 52c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm26-13c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm-52 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z' fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'/%3E%3C/svg%3E"), ${bgColor}`,
  
  // Bouncy balls pattern
  bouncyBalls: (color: string, bgColor = 'transparent', opacity = 0.15) => 
    `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), ${bgColor}`,
  
  // Stars pattern
  stars: (color: string, bgColor = 'transparent', opacity = 0.15) =>
    `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'%3E%3Cpath d='M35 10l6.34 19.52h20.52l-16.6 12.05 6.34 19.52L35 49.04l-16.6 12.05 6.34-19.52-16.6-12.05h20.52z'/%3E%3C/g%3E%3C/svg%3E"), ${bgColor}`,
  
  // Confetti pattern
  confetti: (color: string, bgColor = 'transparent', opacity = 0.15) =>
    `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10zm10 0h10v10H20V10zm10 0h10v10H30V10zm10 0h10v10H40V10zm10 0h10v10H50V10zm10 0h10v10H60V10zm10 0h10v10H70V10zm10 0h10v10H80V10zM0 20h10v10H0V20zm10 0h10v10H10V20zm10 0h10v10H20V20zm10 0h10v10H30V20zm10 0h10v10H40V20zm10 0h10v10H50V20zm10 0h10v10H60V20zm10 0h10v10H70V20zm10 0h10v10H80V20zM0 30h10v10H0V30zm10 0h10v10H10V30zm10 0h10v10H20V30zm10 0h10v10H30V30zm10 0h10v10H40V30zm10 0h10v10H50V30zm10 0h10v10H60V30zm10 0h10v10H70V30zm10 0h10v10H80V30zM0 40h10v10H0V40zm10 0h10v10H10V40zm10 0h10v10H20V40zm10 0h10v10H30V40zm10 0h10v10H40V40zm10 0h10v10H50V40zm10 0h10v10H60V40zm10 0h10v10H70V40zm10 0h10v10H80V40zM0 50h10v10H0V50zm10 0h10v10H10V50zm10 0h10v10H20V50zm10 0h10v10H30V50zm10 0h10v10H40V50zm10 0h10v10H50V50zm10 0h10v10H60V50zm10 0h10v10H70V50zm10 0h10v10H80V50zM0 60h10v10H0V60zm10 0h10v10H10V60zm10 0h10v10H20V60zm10 0h10v10H30V60zm10 0h10v10H40V60zm10 0h10v10H50V60zm10 0h10v10H60V60zm10 0h10v10H70V60zm10 0h10v10H80V60zM0 70h10v10H0V70zm10 0h10v10H10V70zm10 0h10v10H20V70zm10 0h10v10H30V70zm10 0h10v10H40V70zm10 0h10v10H50V70zm10 0h10v10H60V70zm10 0h10v10H70V70zm10 0h10v10H80V70z'/%3E%3C/g%3E%3C/svg%3E"), ${bgColor}`,
  
  // Polka dots pattern
  polkaDots: (color: string, bgColor = 'transparent', opacity = 0.15) =>
    `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"), ${bgColor}`,

  // Party hats pattern
  partyHats: (color: string, bgColor = 'transparent', opacity = 0.15) =>
    `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10v20H20V20zm10-7.071c3.904 0 7.071 3.167 7.071 7.071v14.142h-14.142V20c0-3.904 3.167-7.071 7.071-7.071zM0 20c0-5.523 4.477-10 10-10s10 4.477 10 10v20H0V20zm10-7.071c3.904 0 7.071 3.167 7.071 7.071v14.142H2.929V20c0-3.904 3.167-7.071 7.071-7.071z' fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'/%3E%3C/svg%3E"), ${bgColor}`
};

export const playfulOverrides: Partial<ThemeDefinition> = {
  // Header - vibrant, eye-catching but professional
  headerBg: (c) => c.primary[500],
  headerTextColor: (c) => c.text[100],
  boxShadow: (c, scrolled) =>
    scrolled ? `0 6px 12px ${c.primary[900]}30` : "none",
  extraBorderStyle: (c) => ({
    borderBottom: `4px solid ${c.accent[500]}`,
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "-8px",
      left: 0,
      right: 0,
      height: "4px",
      background: `repeating-linear-gradient(90deg, 
        ${c.accent[500]}, ${c.accent[500]} 10px, 
        transparent 10px, transparent 20px)`,
    }
  }),
  headerGlassEffect: false,
  headerAccentElements: (c) => ({
    background: funPatterns.balloons(c.accent[100], 'transparent', 0.2),
    backgroundSize: "52px 52px",
  }),
  headerAnimation: "fadeIn 0.3s ease-out",
  navItemStyles: {
    normal: (c) => ({
      color: c.text[100],
      position: "relative",
      padding: "0.5rem 1rem",
      margin: "0 0.2rem",
      fontWeight: 600,
      fontSize: "1.05rem",
      transition: "all 0.2s ease",
    }),
    hover: (c) => ({
      color: c.accent[100],
      transform: "translateY(-3px)",
    }),
    active: (c) => ({
      color: c.accent[100],
      fontWeight: "bold",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "-5px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "8px",
        height: "8px",
        background: c.accent[100],
        borderRadius: "50%",
      },
    }),
  },

  // Buttons - fun, bouncy with clear calls to action
  buttonStyles: {
    background: (c) => c.accent[500],
    textColor: (c) => c.text[100],
    border: () => `none`,
    boxShadow: (c) => `0 6px 0 ${c.accent[900]}, 0 6px 10px ${c.primary[900]}20`,
    hoverBackground: (c) => c.accent[900],
    hoverTextColor: (c) => c.text[100],
    hoverBoxShadow: (c) => `0 4px 0 ${c.accent[900]}, 0 4px 6px ${c.primary[900]}20`,
    transition: "all 0.15s ease-out",
    borderRadius: radii.pill,
    animation: "none",
  },
  secondaryButtonStyles: {
    background: (c) => c.primary[100],
    textColor: (c) => c.primary[900],
    border: (c) => `3px dashed ${c.primary[500]}`,
    boxShadow: (c) => `0 4px 0 ${c.primary[500]}80, 0 4px 8px ${c.primary[900]}10`,
    hoverBackground: (c) => c.primary[100],
    hoverTextColor: (c) => c.primary[900],
    hoverBoxShadow: (c) => `0 2px 0 ${c.primary[500]}80, 0 2px 4px ${c.primary[900]}10`,
    transition: "all 0.15s ease-out",
    borderRadius: radii.pill,
  },

  // Cards - playful but clean
  cardStyles: {
    background: (c) => c.background[100],
    border: (c) => `3px solid ${c.secondary[500]}`,
    boxShadow: (c) => `0 8px 16px ${c.primary[900]}15`,
    textColor: (c) => c.text[900],
    borderRadius: `${radii.large}`,
  },

  // Hero - eye-catching with fun patterns
  heroBackground: (c) => funPatterns.polkaDots(c.primary[900], c.accent[100], 0.07),
  heroTitleColor: (c) => c.primary[900],
  heroTextColor: (c) => c.text[900],

  // Feature Section - clear, colorful sections that highlight offerings
  featureSectionStyles: {
    titleColor: (c) => c.primary[900],
    cardBackground: (c, index) => {
      // Different pattern for each card
      const patterns = [
        funPatterns.balloons(c.primary[500], c.primary[100], 0.05),
        funPatterns.stars(c.secondary[500], c.secondary[100], 0.05),
        funPatterns.bouncyBalls(c.accent[500], c.accent[100], 0.05)
      ];
      return patterns[index % patterns.length];
    },
    iconBackground: (c, index) => {
      const colors = [c.accent[100], c.primary[100], c.secondary[100]];
      return colors[index % colors.length];
    },
    cardTitleColor: (c, index) => {
      const colors = [c.primary[900], c.secondary[900], c.accent[900]];
      return colors[index % colors.length];
    },
    cardTextColor: (c) => c.text[900],
    iconBorder: (c, index) => {
      const colors = [c.accent[500], c.primary[500], c.secondary[500]];
      return `3px solid ${colors[index % colors.length]}`;
    },
    iconBoxShadow: (c, index) => {
      const colors = [c.accent[500], c.primary[500], c.secondary[500]];
      return `0 6px 0 ${colors[index % colors.length]}`;
    },
    iconBorderRadius: () => "16px",
  },

  // Popular Rentals - showcase products with fun backgrounds
  popularRentalsStyles: {
    background: (c) => ({
      background: c.secondary[100],
      backgroundImage: funPatterns.polkaDots(c.secondary[500], 'transparent', 0.1),
      position: "relative",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "8px",
        background: c.secondary[500],
      }
    }),
    titleColor: (c) => c.primary[900],
    cardBackgroundGradient: (c) => c.background[100],
    priceColor: (c) => c.accent[900],
  },

  // CTA - attention-grabbing but professional
  ctaStyles: {
    background: (c) => funPatterns.stars(c.accent[100], c.accent[500], 0.15),
    titleColor: (c) => c.text[100],
    textColor: (c) => c.text[100],
  },

  // Contact section - clean, professional but with playful elements
  contactStyles: {
    background: (c) => funPatterns.balloons(c.primary[500], c.background[100], 0.05),
    titleColor: (c) => c.primary[900],
    cardBackground: (c) => c.background[100],
    iconBackground: (c, type) => {
      const colors = {
        primary: c.primary[100],
        secondary: c.secondary[100],
        accent: c.accent[100],
      };
      return colors[type];
    },
    textColor: (c) => c.text[900],
    serviceAreaTagBackground: (c, index) => {
      const colors = [c.primary[100], c.secondary[100], c.accent[100]];
      return colors[index % colors.length];
    },
    serviceAreaTagColor: (c, index) => {
      const colors = [c.primary[900], c.secondary[900], c.accent[900]];
      return colors[index % colors.length];
    },
    cardBorder: (c) => `3px solid ${c.primary[500]}`,
    cardBoxShadow: (c) => `0 6px 12px ${c.primary[900]}15`,
  },

  // Footer - professional but with brand personality
  footerStyles: {
    background: (c) => c.primary[900],
    textColor: (c) => c.text[100],
    border: () => `none`,
    boxShadow: () => `0 -4px 12px rgba(0,0,0,0.1)`,
    pattern: (c) => funPatterns.bouncyBalls(c.primary[900], 'transparent', 0.1),
    accentElements: (c) => ({
      borderTop: `4px dashed ${c.accent[500]}`,
      paddingTop: "2rem",
    }),
    linkStyles: {
      normal: (c) => ({
        color: c.text[100],
        transition: "all 0.2s ease",
        position: "relative",
      }),
      hover: (c) => ({
        color: c.accent[100],
        textDecoration: "none",
        paddingLeft: "5px",
      }),
    },
    sectionTitleStyles: (c) => ({
      color: c.accent[100],
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      position: "relative",
      paddingLeft: "15px",
      "&:before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "10px",
        height: "10px",
        background: c.accent[500],
        borderRadius: "50%",
      }
    }),
    borderTop: (c) => `8px solid ${c.primary[900]}`,
  },

  // Booking Styles - professional but with playful elements
  bookingStyles: makeBookingStyles({
    formBackground: (c) => c.background[100],
    formBorder: (c) => `3px solid ${c.primary[500]}`,
    formShadow: (c) => `0 8px 20px ${c.primary[900]}15`,
    formTextColor: (c) => c.text[900],
    
    stepBackground: (c, active) =>
      active ? c.accent[100] : c.background[100],
    stepBorder: (c, active) =>
      `3px ${active ? "solid" : "dashed"} ${
        active ? c.accent[500] : c.secondary[500]
      }`,
    stepTextColor: (c, active) => (active ? c.primary[900] : c.text[500]),
    stepIconColor: (c, active) => (active ? c.accent[500] : c.secondary[500]),
    
    availabilityCard: {
      background: (c) => c.background[100],
      border: (c, isSelected) =>
        `3px ${isSelected ? "solid" : "dashed"} ${
          isSelected ? c.accent[500] : c.secondary[500]
        }`,
      shadow: (c) => `0 6px 12px ${c.primary[900]}10`,
      hoverShadow: (c) => `0 8px 16px ${c.accent[900]}20`,
      selectedBackground: (c) => funPatterns.confetti(c.accent[500], c.background[100], 0.05),
      imageContainer: (c) => c.primary[100],
      priceTag: {
        background: (c) => c.accent[500],
        color: (c) => c.text[100],
      },
      specContainer: {
        background: (c) => c.secondary[100],
        border: (c) => `2px dashed ${c.secondary[500]}`,
      },
    },
    
    summaryCard: {
      background: (c) => c.background[100],
      border: (c) => `3px dashed ${c.primary[500]}`,
      shadow: (c) => `0 6px 12px ${c.primary[900]}15`,
      headerBackground: (c) => c.primary[500],
      rowBackground: (c, isAlternate) =>
        isAlternate ? c.background[100] : funPatterns.polkaDots(c.primary[500], c.primary[100], 0.05),
    },
    
    input: {
      background: (c) => c.background[100],
      border: (c) => `2px solid ${c.secondary[500]}`,
      focusBorder: (c) => `2px solid ${c.accent[500]}`,
      placeholderColor: (c) => c.text[500],
      labelColor: (c) => c.primary[900],
    },
    
    timeSlot: {
      background: (c, isAvailable) =>
        isAvailable ? c.background[100] : c.background[100] + "80",
      border: (c, isAvailable) =>
        `2px ${isAvailable ? "solid" : "dashed"} ${
          isAvailable ? c.primary[500] : c.secondary[500]
        }`,
      textColor: (c, isAvailable) =>
        isAvailable ? c.text[900] : c.text[500],
    },
  }),

  // Image + Text Section - professional presentation with playful accents
  imageTextStyles: {
    containerBackground: (c) => c.background[100],
    titleColor: (c) => c.primary[900],
    textColor: (c) => c.text[900],
    imageContainerStyle: (c) => ({
      borderRadius: "20px",
      boxShadow: `0 8px 16px ${c.primary[900]}15`,
      border: `4px solid ${c.primary[500]}`,
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "-12px",
        right: "30px",
        width: "80px",
        height: "24px",
        background: c.accent[500],
        borderRadius: "12px",
      },
    }),
  },

  // Animations - bouncy and playful
  animations: {
    pageTransition: "fadeIn 0.4s ease-out",
    sectionTransition: "bounceIn 0.5s ease-out",
    elementEntrance: "popIn 0.3s ease-out",
    pulseGlow: "bounce 2s infinite ease-in-out",
  },

  // Decorative elements
  decorativeElements: {
    shapesColor: (c) => c.accent[500],
    patternOpacity: 0.1,
    enableParticles: true,
  },

  // Image styles - professional but with playful elements
  imageStyles: (c) => ({
    borderRadius: "16px",
    border: `4px solid ${c.primary[500]}`,
    boxShadow: `0 8px 16px ${c.primary[900]}15`,
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  }),
};
