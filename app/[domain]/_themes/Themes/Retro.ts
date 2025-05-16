/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeDefinition, ThemeColors } from '../types';
import { transitions } from '../tokens';
import { retroPatterns } from '../patterns/retro';

// Text styling helpers
const retroText = {
  pixelShadow: (color: string) => `2px 2px 0 ${color}`,
  
  neoBrutalFont: () => ({
    fontFamily: '"Rubik", "Inter", sans-serif',
    letterSpacing: '0.5px',
    lineHeight: '1.3',
    fontWeight: 'bold',
  }),
  
  funFont: () => ({
    fontFamily: '"Outfit", "Nunito", sans-serif',
    letterSpacing: '0.5px',
    textRendering: 'optimizeLegibility',
  }),
  
  playfulText: (color: string) => ({
    color: color,
    transform: 'rotate(-1deg)',
    display: 'inline-block',
  }),
  
  bouncyLabel: () => ({
    fontFamily: '"Outfit", "Nunito", sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
    padding: '3px 8px',
    transform: 'rotate(-2deg)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: '3px solid currentColor',
      transform: 'rotate(1deg)',
      zIndex: -1,
    }
  }),
  
  chunkTitle: (color: string) => ({
    fontFamily: '"Rubik", "Inter", sans-serif',
    fontWeight: '800',
    letterSpacing: '0.5px',
    color,
    textTransform: 'uppercase',
  })
};

// Helper for animations
const neoAnimations = {
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  
  wiggle: `
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(2deg); }
      75% { transform: rotate(-2deg); }
    }
  `,
  
  popIn: `
    @keyframes popIn {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
  `,
  
  pressDown: `
    @keyframes pressDown {
      0% { transform: translateY(0); }
      50% { transform: translateY(3px); }
      100% { transform: translateY(0); }
    }
  `
};

export const retroOverrides: Partial<ThemeDefinition> = {
  // Header - bold neobrutalist style with retro patterns
  headerBg: (c, scrolled) => scrolled ? c.primary[500] : c.primary[500],
  headerTextColor: (c) => c.text[100],
  boxShadow: (c, scrolled) => 
    scrolled ? `0 4px 8px rgba(0, 0, 0, 0.2), 0 4px 0 0 ${c.accent[500]}` : 'none',
  extraBorderStyle: (c) => ({
    borderBottom: `4px solid ${c.accent[500]}`,
  }),
  navItemStyles: {
    normal: (c) => ({
      color: c.text[100],
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      padding: '0.5rem 1rem',
      margin: '0 0.25rem',
      border: `3px solid transparent`,
      borderRadius: '8px',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: retroPatterns.pixelGrid(c.accent[500], 0.1, 8),
        borderRadius: '8px',
        opacity: 0,
        transition: 'opacity 0.2s ease',
      }
    }),
    hover: (c) => ({
      color: c.text[900],
      backgroundColor: c.accent[100],
      border: `3px solid ${c.accent[500]}`,
      transform: 'translateY(-2px)',
      boxShadow: `3px 3px 0 ${c.accent[500]}`,
      '&:before': {
        opacity: 1,
      }
    }),
    active: (c) => ({
      color: c.text[900],
      backgroundColor: c.accent[100],
      fontWeight: 'bold',
      border: `3px solid ${c.accent[500]}`,
      boxShadow: `4px 4px 0 ${c.accent[900]}`,
      '&:before': {
        opacity: 1,
      }
    }),
  },

  // Buttons - chunky neobrutalist style with retro patterns
  buttonStyles: {
    background: (c) => c.accent[500],
    textColor: (c) => c.text[900],
    border: (c) => `3px solid ${c.accent[500]}`,
    boxShadow: (c) => `4px 4px 0 ${c.accent[900]}`,
    hoverBackground: (c) => c.accent[100],
    hoverTextColor: (c) => c.text[900],
    hoverBorder: (c) => `3px solid ${c.accent[500]}`,
    hoverBoxShadow: (c) => `5px 5px 0 ${c.accent[500]}`,
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    animation: 'none',
    customStyles: (c: ThemeColors) => ({
      position: 'relative',
      fontFamily: '"Rubik", "Inter", sans-serif',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: retroPatterns.pixelGrid(c.accent[900], 0.1, 8),
        borderRadius: '8px',
        opacity: 0,
        transition: 'opacity 0.2s ease',
      },
      '&:hover:before': {
        opacity: 1,
      },
      '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.8)',
      }
    })
  },
  secondaryButtonStyles: {
    background: (c) => c.primary[100],
    textColor: (c) => c.text[900],
    border: (c) => `3px solid ${c.primary[500]}`,
    boxShadow: (c) => `4px 4px 0 ${c.primary[500]}`,
    hoverBackground: (c) => c.primary[100],
    hoverTextColor: (c) => c.text[900],
    hoverBorder: (c) => `3px solid ${c.primary[500]}`,
    hoverBoxShadow: (c) => `5px 5px 0 ${c.primary[500]}`,
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    animation: 'none',
    customStyles: (c: ThemeColors) => ({
      position: 'relative',
      fontFamily: '"Rubik", "Inter", sans-serif',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.8)',
      }
    })
  },

  // Cards - chunky neobrutalist cards with retro patterns
  cardStyles: {
    background: (c) => c.background[100],
    border: (c) => `3px solid ${c.primary[500]}`,
    boxShadow: (c) => `6px 6px 0 ${c.primary[900]}`,
    textColor: (c) => c.text[900],
    borderRadius: '12px',
  },

  // Hero section - bold, playful style with retro patterns
  heroBackground: (c: ThemeColors) => retroPatterns.checkerboard(c.primary[900], c.accent[100], 500),
  heroTitleColor: (c: ThemeColors) => c.primary[900],
  heroTextColor: (c: ThemeColors) => c.text[900],
  

  // Feature section - fun, bouncy style with retro patterns
  featureSectionStyles: {
    titleColor: (c: ThemeColors) => c.primary[900],
    cardBackground: (c: ThemeColors, index: number) => {
      // Use solid color background for better readability
      const colors = [c.accent[100], c.primary[100], c.secondary[100]];
      return colors[index % 3];
    },
    iconBackground: (c: ThemeColors, index: number) => {
      const colors = [c.accent[100], c.primary[100], c.secondary[100]];
      return colors[index % 3];
    },
    cardTitleColor: (c: ThemeColors, index: number) => {
      const colors = [c.accent[900], c.primary[900], c.secondary[900]];
      return colors[index % 3];
    },
    cardTextColor: (c: ThemeColors) => c.text[900],
    iconBorder: (c: ThemeColors, index: number) => {
      const colors = [c.accent[500], c.primary[500], c.secondary[500]];
      return `3px solid ${colors[index % 3]}`;
    },
    iconBoxShadow: (c: ThemeColors, index: number) => {
      const colors = [c.accent[900], c.primary[900], c.secondary[900]];
      return `4px 4px 0 ${colors[index % 3]}`;
    },
    iconBorderRadius: () => '12px',
  },

  // Popular rentals - fun grid layout with retro patterns
  popularRentalsStyles: {
    background: (c: ThemeColors) => c.secondary[500],
    titleColor: (c: ThemeColors) => c.text[100],
    cardBackgroundGradient: (c: ThemeColors) => c.background[100],
    priceColor: (c: ThemeColors) => c.accent[500],
  },

  // Call to action - eye-catching style with retro patterns
  ctaStyles: {
    background: (c: ThemeColors) => c.accent[500],
    titleColor: (c: ThemeColors) => c.text[100],
    textColor: (c: ThemeColors) => c.text[100],
  },

  // Contact section - organized with clean layout and retro patterns
  contactStyles: {
    background: (c: ThemeColors) => c.background[100],
    titleColor: (c: ThemeColors) => c.primary[900],
    cardBackground: (c: ThemeColors) => c.background[100],
    iconBackground: (c: ThemeColors, type: "primary" | "secondary" | "accent") => {
      const colors = {
        primary: c.primary[100],
        accent: c.accent[100],
        secondary: c.secondary[100],
      };
      return colors[type];
    },
    textColor: (c: ThemeColors) => c.text[900],
    serviceAreaTagBackground: (c: ThemeColors, index: number) => {
      const colors = [c.accent[100], c.primary[100], c.secondary[100]];
      return colors[index % 3];
    },
    serviceAreaTagColor: (c: ThemeColors, index: number) => {
      const colors = [c.accent[900], c.primary[900], c.secondary[900]];
      return colors[index % 3];
    },
    cardBorder: (c: ThemeColors) => `3px solid ${c.primary[500]}`,
    cardBoxShadow: (c: ThemeColors) => `6px 6px 0 ${c.primary[900]}`,
  },

  // Footer - distinct neobrutalist style with retro patterns
  footerStyles: {
    background: (c: ThemeColors) => retroPatterns.polkaDots(c.primary[900], c.accent[100], 1),
    textColor: (c: ThemeColors) => c.text[100],
    border: (c: ThemeColors) => `3px solid ${c.accent[500]}`,
    boxShadow: (c: ThemeColors) => `0 -6px 0 ${c.primary[500]}`,
    pattern: (c: ThemeColors) => retroPatterns.pixelGrid(c.primary[900], 0.2, 20),
    borderTop: (c: ThemeColors) => `6px solid ${c.primary[900]}`,
    accentElements: (c: ThemeColors) => ({
      borderTop: `3px solid ${c.accent[500]}`,
      paddingTop: '1.5rem',
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: retroPatterns.diagonalStripes(c.accent[500], c.primary[900], 8),
      }
    }),
    linkStyles: {
      normal: (c: ThemeColors) => ({
        color: c.text[100],
        position: 'relative',
        fontFamily: '"Rubik", "Inter", sans-serif',
        fontSize: '0.95rem',
        textTransform: 'uppercase',
        padding: '0.25rem 0',
        fontWeight: 'bold',
        borderBottom: `2px solid transparent`,
        transition: 'all 0.2s ease',
      }),
      hover: (c: ThemeColors) => ({
        color: c.text[100],
        borderBottom: `2px solid ${c.accent[100]}`,
        transform: 'translateX(3px)',
      }),
    },
    sectionTitleStyles: (c: ThemeColors) => ({
      color: c.text[100],
      fontFamily: '"Rubik", "Inter", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      position: 'relative',
      paddingLeft: '12px',
      marginBottom: '1rem',
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '6px',
        height: '100%',
        backgroundColor: c.accent[500],
        borderRadius: '3px',
      }
    }),
    footerLogo: (c: ThemeColors) => ({
      fontFamily: '"Rubik", "Inter", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: c.accent[100],
      textTransform: 'uppercase',
      letterSpacing: '1px',
      textShadow: `2px 2px 0 ${c.primary[900]}`,
    }),
    copyrightStyle: (c: ThemeColors) => ({
      position: 'relative',
      paddingTop: '1.5rem',
      marginTop: '1.5rem',
      borderTop: `2px solid ${c.primary[500]}`,
      fontSize: '0.9rem',
      fontFamily: '"Rubik", "Inter", sans-serif',
      textAlign: 'center',
      color: c.text[100],
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '4px',
        backgroundColor: c.accent[500],
        borderRadius: '2px',
      }
    }),
    socialIcons: (c: ThemeColors) => ({
      display: 'flex',
      gap: '1rem',
      fontSize: '1.5rem',
      '& a': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        backgroundColor: c.primary[500],
        border: `2px solid ${c.accent[500]}`,
        borderRadius: '8px',
        boxShadow: `3px 3px 0 ${c.primary[500]}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `3px 6px 0 ${c.primary[500]}`,
        }
      }
    }),
  },

  // Links - neobrutalist styling
  linkStyles: {
    background: (_c) => 'transparent',
    textColor: (c) => c.accent[500],
    border: (_c) => 'none',
    boxShadow: (_c) => 'none',
    hoverBackground: (_c) => 'transparent',
    hoverTextColor: (c) => c.accent[900],
    hoverBorder: (_c) => 'none',
    hoverBoxShadow: (_c) => 'none',
    transition: 'all 0.2s ease',
    active: (c) => c.accent[500],
    activeBoxShadow: (_c) => 'none',
    borderRadius: '8px',
  },

  // Image styles - playful border style
  imageStyles: (c) => ({
    border: `3px solid ${c.primary[500]}`,
    borderRadius: '12px',
    boxShadow: `8px 8px 0 ${c.primary[900]}`,
    position: 'relative',
    background: c.background[100],
    overflow: 'hidden',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: retroPatterns.scanlines(c.primary[900], 2),
      opacity: 0.05,
      pointerEvents: 'none',
    }
  }),

  // Image + Text Section
  imageTextStyles: {
    containerBackground: (c) => c.background[100],
    titleColor: (c) => c.primary[900],
    textColor: (c) => c.text[900],
    imageContainerStyle: (c) => ({
      border: `3px solid ${c.primary[500]}`,
      borderRadius: '12px',
      boxShadow: `8px 8px 0 ${c.primary[900]}`,
      position: 'relative',
      overflow: 'hidden',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: retroPatterns.vhsTracking(),
        opacity: 0.1,
        pointerEvents: 'none',
      }
    }),
  },

  // Decorative elements - playful style
  decorativeElements: {
    shapesColor: (c: ThemeColors) => c.accent[500],
    patternOpacity: 0.15,
    enableParticles: false,
  },
  
  // Global background patterns
  globalBackground: (c) => ({
    main: c.background[100],
    accent: c.accent[100],
    overlay: `
      ${neoAnimations.bounce}
      ${neoAnimations.wiggle}
      ${neoAnimations.popIn}
      ${neoAnimations.pressDown}
      
      /* Retro Theme Custom Styles */
      .retro-theme {
        position: relative;
      }
      
      header {
        position: sticky;
        top: 0;
        z-index: 100;
        width: 100%;
        transition: all 0.3s ease;
      }
      
      header.scrolled {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 4px 0 0 var(--accent-500);
      }
      
      .retro-theme .hero-section {
        position: relative;
        background-color: var(--secondary-100);
        background-image: linear-gradient(135deg, var(--secondary-100), var(--secondary-500));
      }
      
      .retro-theme .hero-section::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: ${retroPatterns.scanlines('rgba(0,0,0,0.05)', 3)};
        pointer-events: none;
        z-index: 0;
      }
      
      .retro-theme .hero-content {
        position: relative;
        z-index: 1;
        padding: 2rem;
        border-radius: 12px;
        background-color: rgba(255, 255, 255, 0.85);
        border: 4px solid var(--primary-500);
        box-shadow: 8px 8px 0 var(--primary-900);
      }
      
      .retro-theme .feature-card {
        position: relative;
        overflow: hidden;
        padding: 2rem 1.5rem 1.5rem;
        border: 3px solid var(--primary-500);
        box-shadow: 6px 6px 0 var(--text-900);
        background-color: var(--background-100);
      }
      
      .retro-theme .feature-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: currentColor;
      }
      
      .retro-theme .popular-rentals {
        background-color: var(--secondary-500);
        position: relative;
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      
      .retro-theme .popular-rentals::before,
      .retro-theme .popular-rentals::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 20px;
        background-image: ${retroPatterns.zigzag('var(--secondary-900)', 'var(--secondary-500)')};
      }
      
      .retro-theme .popular-rentals::before {
        top: 0;
      }
      
      .retro-theme .popular-rentals::after {
        bottom: 0;
        transform: rotate(180deg);
      }
      
      .retro-theme .section-title {
        position: relative;
        display: inline-block;
        padding: 0.5rem 1.5rem;
        margin-bottom: 2rem;
        background: var(--secondary-900);
        border-radius: 8px;
        border: 3px solid var(--text-100);
        box-shadow: 4px 4px 0 var(--text-100);
        font-family: "Rubik", "Inter", sans-serif;
        font-weight: bold;
        text-transform: uppercase;
      }
    `,
  }),

  // Section transitions with playful effects
  sectionTransitions: {
    enter: 'fadeIn 0.3s ease-out',
    exit: 'fadeOut 0.3s ease-out',
    duration: '0.3s',
  },

  // Animations - playful feel
  animations: {
    pageTransition: "fadeIn 0.3s ease-out",
    sectionTransition: "fadeIn 0.3s ease-out",
    elementEntrance: "popIn 0.3s ease-out",
    pulseGlow: "wiggle 3s infinite ease-in-out",
  },
};