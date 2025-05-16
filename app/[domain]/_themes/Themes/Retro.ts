/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeDefinition, ThemeColors } from '../types';
import { transitions } from '../tokens';
import { retroPatterns } from '../patterns/retro';

// Text styling helpers
const retroText = {
  pixelShadow: (color: string) => `2px 2px 0 ${color}`,
  
  arcadeFont: () => ({
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    letterSpacing: '1px',
    lineHeight: '1.5',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  }),
  
  pixelFont: () => ({
    fontFamily: '"VT323", "Space Mono", monospace',
    letterSpacing: '0.5px',
    textRendering: 'pixelated',
  }),
  
  neonText: (color: string, glowColor: string) => ({
    color: color,
    textShadow: `0 0 5px ${glowColor}, 0 0 10px ${glowColor}80, 0 0 15px ${glowColor}40, 0 0 20px ${glowColor}20`,
    animation: 'neonPulse 1.5s ease-in-out infinite alternate',
  }),
  
  glitchText: () => ({
    position: 'relative',
    '&::before, &::after': {
      content: 'attr(data-text)',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.8,
    },
    '&::before': {
      left: '2px',
      textShadow: '-1px 0 #ff0000',
      animation: 'glitch-anim-1 2s infinite linear alternate-reverse',
      clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
    },
    '&::after': {
      left: '-2px',
      textShadow: '1px 0 #00ffff',
      animation: 'glitch-anim-2 3s infinite linear alternate-reverse',
      clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
    }
  }),
  
  retroLabel: () => ({
    fontFamily: '"Space Mono", monospace',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
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
      border: '2px solid currentColor',
      transform: 'rotate(1deg)',
      zIndex: -1,
    }
  }),
  
  vintageTitle: (color: string) => ({
    fontFamily: '"Rubik", "Roboto Slab", serif',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color,
    textTransform: 'uppercase',
    textDecoration: 'underline',
    textDecorationColor: color + '80',
    textDecorationThickness: '2px',
    textUnderlineOffset: '5px',
  })
};

// Helper for retro animations
const retroAnimations = {
  blinkingCursor: `
    @keyframes blinkingCursor {
      0% { opacity: 1; }
      49% { opacity: 1; }
      50% { opacity: 0; }
      99% { opacity: 0; }
      100% { opacity: 1; }
    }
  `,
  
  scanlineScroll: `
    @keyframes scanlineScroll {
      0% { background-position: 0 0; }
      100% { background-position: 0 100%; }
    }
  `,
  
  glitchEffect: `
    @keyframes glitch-anim-1 {
      0%, 100% { clip-path: inset(50% 0 30% 0); }
      20% { clip-path: inset(30% 0 60% 0); }
      40% { clip-path: inset(10% 0 40% 0); }
      60% { clip-path: inset(40% 0 20% 0); }
      80% { clip-path: inset(20% 0 50% 0); }
    }
    @keyframes glitch-anim-2 {
      0%, 100% { clip-path: inset(40% 0 60% 0); }
      20% { clip-path: inset(60% 0 30% 0); }
      40% { clip-path: inset(20% 0 50% 0); }
      60% { clip-path: inset(50% 0 70% 0); }
      80% { clip-path: inset(10% 0 40% 0); }
    }
  `,
  
  neonPulse: `
    @keyframes neonPulse {
      0% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor; }
      100% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor; }
    }
  `,
  
  pressDown: `
    @keyframes pressDown {
      0% { transform: scale(1); }
      40% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
  `,
  
  tickerTape: `
    @keyframes tickerTape {
      0% { transform: translateX(100%); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateX(0); opacity: 1; }
    }
  `,
  
  pixelButton: `
    @keyframes pixelButtonHover {
      0% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
      100% { filter: brightness(1); }
    }
  `
};

export const retroOverrides: Partial<ThemeDefinition> = {
  // Header - bold arcade cabinet style
  headerBg: (c) => c.primary[900],
  headerTextColor: (c) => c.text[100],
  boxShadow: (c, scrolled) => 
    scrolled ? `inset 0 -8px 0 0 ${c.accent[900]}, 0 4px 0 0 ${c.accent[900]}` : 'none',
  extraBorderStyle: (c) => ({
    borderBottom: `6px solid ${c.accent[900]}`,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-12px',
      left: 0,
      right: 0,
      height: '4px',
      background: retroPatterns.stripes(c.accent[500], c.secondary[500], 4),
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: retroPatterns.zigzag(c.primary[500], c.primary[900]),
      opacity: 0.5,
    }
  }),
  headerGlassEffect: false,
  headerAccentElements: (c) => ({
    background: retroPatterns.scanlines(c.accent[500], 2),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    opacity: 0.3,
    zIndex: 1,
    animation: 'scanlineScroll 10s linear infinite',
  }),
  headerAnimation: "fadeIn 0.2s steps(5)",
  navItemStyles: {
    normal: (c) => ({
      color: c.text[100],
      fontFamily: '"Space Mono", monospace',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '0.5rem 1rem',
      margin: '0 0.2rem',
      borderBottom: `2px solid transparent`,
      position: 'relative',
      transition: 'all 0.1s steps(2)',
    }),
    hover: (c) => ({
      color: c.accent[100],
      backgroundColor: c.primary[900],
      '&:before': {
        content: '"> "',
        position: 'absolute',
        left: '0',
        animation: 'blinkingCursor 1s steps(2) infinite',
      }
    }),
    active: (c) => ({
      color: c.accent[100],
      backgroundColor: c.primary[900],
      fontWeight: 'bold',
      borderBottom: `2px solid ${c.accent[100]}`,
      '&:before': {
        content: '"> "',
        position: 'absolute',
        left: '0',
      }
    }),
  },

  // Buttons - simple retro style matching the image
  buttonStyles: {
    background: (c) => c.accent[500],
    textColor: (c) => c.text[900],
    border: (c) => 'none',
    boxShadow: (c) => '3px 3px 0 rgba(0,0,0,0.8)',
    hoverBackground: (c) => c.accent[500],
    hoverTextColor: (c) => c.text[900],
    hoverBorder: (c) => 'none',
    hoverBoxShadow: (c) => '2px 2px 0 rgba(0,0,0,0.8)',
    transition: 'all 0.1s ease',
    borderRadius: '6px',
    animation: 'none',
    // The styling matches the image
    customStyles: (c: ThemeColors) => ({
      position: 'relative',
      fontFamily: '"Space Mono", monospace',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      background: `${retroPatterns.pixelGrid(c.accent[900], 0.05, 2)}, ${c.accent[500]}`,
      '&:active': {
        transform: 'translate(1px, 1px)',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.8)',
      }
    })
  },
  secondaryButtonStyles: {
    background: (c) => c.primary[100],
    textColor: (c) => c.text[900],
    border: (c) => 'none',
    boxShadow: (c) => '3px 3px 0 rgba(0,0,0,0.8)',
    hoverBackground: (c) => c.primary[100],
    hoverTextColor: (c) => c.text[900],
    hoverBorder: (c) => 'none',
    hoverBoxShadow: (c) => '2px 2px 0 rgba(0,0,0,0.8)',
    transition: 'all 0.1s ease',
    borderRadius: '6px',
    animation: 'none',
    // The styling matches the image but with different colors
    customStyles: (c: ThemeColors) => ({
      position: 'relative',
      fontFamily: '"Space Mono", monospace',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      background: `${retroPatterns.pixelGrid(c.primary[500], 0.05, 2)}, ${c.primary[100]}`,
      '&:active': {
        transform: 'translate(1px, 1px)',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.8)',
      }
    })
  },

  // Cards - chunky arcade/console style frames
  cardStyles: {
    background: (c) => c.background[100],
    border: (c) => `5px solid ${c.primary[900]}`,
    boxShadow: (c) => `8px 8px 0 ${c.secondary[500]}`,
    textColor: (c) => c.text[900],
    borderRadius: '0px',
  },

  // Hero section - bold arcade style with better CRT effect
  heroBackground: (c: ThemeColors) => c.accent[900],
  heroTitleColor: (c: ThemeColors) => c.text[100],
  heroTextColor: (c: ThemeColors) => c.secondary[900],
  heroAccentElements: (c: ThemeColors) => ({
    topLeft: {
      background: retroPatterns.stars(c.accent[500], c.primary[900]),
      transform: 'rotate(-45deg)',
      animation: 'fadeIn 0.5s steps(5)'
    },
    topRight: {
      background: retroPatterns.memphis(c.primary[500] + '20', c.accent[500] + '20', 'transparent'),
      transform: 'rotate(45deg)',
      animation: 'fadeIn 0.7s steps(5)'
    },
    bottomLeft: {
      background: retroPatterns.pixelGrid(c.secondary[500], 0.1, 4),
      transform: 'rotate(45deg)',
      animation: 'fadeIn 0.9s steps(5)'
    },
    bottomRight: {
      background: retroPatterns.cassetteTape(c.accent[900] + '20', c.primary[900] + '20'),
      transform: 'rotate(-45deg)',
      animation: 'fadeIn 1.1s steps(5)'
    }
  }),

  // Feature section - 80s color block style
  featureSectionStyles: {
    titleColor: (c) => c.accent[900],
    cardBackground: (c, index) => {
      // Alternating pattern styles for each card
      const patterns = [
        retroPatterns.pixelGrid(c.primary[900], 0.05, 4),
        retroPatterns.polkaDots(c.secondary[900] + '10', c.secondary[100], 2),
        retroPatterns.scanlines('rgba(0,0,0,0.04)', 2) + `, ${c.primary[100]}`
      ];
      return patterns[index % 3];
    },
    iconBackground: (c, index) => {
      const colors = [c.accent[500], c.primary[500], c.secondary[500]];
      return colors[index % 3];
    },
    cardTitleColor: (c, index) => {
      const colors = [c.primary[900], c.accent[900], c.secondary[900]];
      return colors[index % 3];
    },
    cardTextColor: (c) => c.text[900],
    iconBorder: (c, index) => {
      const colors = [c.accent[900], c.primary[900], c.secondary[900]];
      return `4px solid ${colors[index % 3]}`;
    },
    iconBoxShadow: (c, index) => {
      const colors = [c.secondary[500], c.accent[500], c.primary[500]];
      return `5px 5px 0 ${colors[index % 3]}`;
    },
    iconBorderRadius: () => '0px',
  },

  // Popular rentals - retro graph paper style
  popularRentalsStyles: {
    background: (c) => ({
      backgroundColor: c.primary[100],
      backgroundImage: retroPatterns.grid(c.primary[500] + '30', c.primary[100], 20),
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '10px',
        background: c.primary[900],
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        top: '10px',
        left: 0,
        right: 0,
        height: '4px',
        background: retroPatterns.stripes(c.primary[500], c.secondary[500], 4),
      }
    }),
    titleColor: (c) => c.primary[900],
    cardBackgroundGradient: (c) => c.background[100],
    priceColor: (c) => c.accent[900],
  },

  // Call to action - eye-catching old school graphic style
  ctaStyles: {
    background: (c) => retroPatterns.zigzag(c.accent[900], c.accent[500]),
    titleColor: (c) => c.text[100],
    textColor: (c) => c.text[100],
  },

  // Contact section - organized with better retro patterns
  contactStyles: {
    background: (c) => retroPatterns.pixelGrid(c.primary[900], 0.03, 10) + `, ${c.background[100]}`,
    titleColor: (c) => c.primary[900],
    cardBackground: (c) => c.background[100],
    iconBackground: (c, type) => {
      const colors = {
        primary: c.primary[500],
        accent: c.accent[500],
        secondary: c.secondary[500],
      };
      return colors[type];
    },
    textColor: (c) => c.text[900],
    serviceAreaTagBackground: (c, index) => {
      const colors = [c.accent[500], c.primary[500], c.secondary[500]];
      return colors[index % 3];
    },
    serviceAreaTagColor: (c) => c.text[100],
    cardBorder: (c) => `4px solid ${c.primary[900]}`,
    cardBoxShadow: (c) => `8px 8px 0 ${c.secondary[500]}`,
  },

  // Footer - distinct separation with pattern
  footerStyles: {
    background: (c) => c.primary[900],
    textColor: (c) => c.text[100],
    border: () => `none`,
    boxShadow: () => `none`,
    pattern: (c) => retroPatterns.scanlines('rgba(255,255,255,0.03)', 2),
    borderTop: (c) => `8px solid ${c.accent[500]}`,
    accentElements: (c) => ({
      backgroundImage: `linear-gradient(to right, ${c.accent[500]}, ${c.accent[500]} 10px, transparent 10px)`,
      backgroundSize: '20px 4px',
      backgroundRepeat: 'repeat-x',
      paddingTop: '1.5rem',
    }),
    linkStyles: {
      normal: (c) => ({
        color: c.text[100],
        position: 'relative',
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        paddingLeft: '0',
        transition: 'all 0.1s steps(2)',
        display: 'inline-block',
        borderBottom: `1px solid transparent`,
      }),
      hover: (c) => ({
        color: c.accent[100],
        paddingLeft: '14px',
        borderBottom: `1px dashed ${c.accent[500]}`,
        '&:before': {
          content: '">>"',
          position: 'absolute',
          left: '0',
          top: '0',
          color: c.accent[500],
          animation: 'blinkingCursor 1s steps(2) infinite',
        }
      }),
    },
    sectionTitleStyles: (c) => ({
      color: c.accent[100],
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '1rem',
      position: 'relative',
      paddingLeft: '24px',
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '15px',
        height: '15px',
        backgroundColor: c.accent[500],
      }
    }),
  },

  // Links - dramatically improved with authentic terminal/arcade styling
  linkStyles: {
    background: (_c) => 'transparent',
    textColor: (c) => c.accent[500],
    border: (_c) => 'none',
    boxShadow: (_c) => 'none',
    hoverBackground: (_c) => 'transparent',
    hoverTextColor: (c) => c.accent[100],
    hoverBorder: (_c) => 'none',
    hoverBoxShadow: (_c) => 'none',
    transition: 'all 0.1s steps(2)',
    active: (c) => c.accent[900],
    activeBoxShadow: (c) => `inset 0 0 0 2px ${c.accent[900]}`,
    borderRadius: '0px',
   
  },

  // Image styles - retro monitor/polaroid style
  imageStyles: (c) => ({
    border: `5px solid ${c.primary[900]}`,
    borderRadius: '0',
    boxShadow: `10px 10px 0 ${c.secondary[500]}`,
    position: 'relative',
    background: c.background[100],
    padding: '3px',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: retroPatterns.scanlines('rgba(0,0,0,0.15)', 2),
      pointerEvents: 'none',
      zIndex: 2,
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '70%',
      height: '10px',
      backgroundColor: c.primary[900],
    }
  }),

  // Image + Text Section
  imageTextStyles: {
    containerBackground: (c) => c.background[100],
    titleColor: (c) => c.primary[900],
    textColor: (c) => c.text[900],
    imageContainerStyle: (c) => ({
      border: `5px solid ${c.primary[900]}`,
      borderRadius: '0px',
      boxShadow: `10px 10px 0 ${c.secondary[500]}`,
      position: 'relative',
      overflow: 'hidden',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: retroPatterns.scanlines('rgba(0,0,0,0.1)', 2),
        pointerEvents: 'none',
        zIndex: 2,
        animation: 'scanlineScroll 10s linear infinite',
      }
    }),
  },

  // Booking styles - consistent with theme
  bookingStyles: {
    formBackground: (c) => retroPatterns.pixelGrid(c.primary[900], 0.02, 10) + `, ${c.background[100]}`,
    formBorder: (c) => `5px solid ${c.primary[900]}`,
    formShadow: (c) => `10px 10px 0 ${c.secondary[500]}`,
    formTextColor: (c) => c.text[900],
    
    stepBackground: (c, active) => 
      active ? retroPatterns.stripes(c.accent[500], c.accent[900], 5) : c.background[100],
    stepBorder: (c, active) => 
      `3px solid ${active ? c.accent[900] : c.secondary[500]}`,
    stepTextColor: (c, active) => 
      active ? c.text[100] : c.text[900],
    stepIconColor: (c, active) => 
      active ? c.text[100] : c.secondary[500],
    
    availabilityCard: {
      background: (c) => c.background[100],
      border: (c, isSelected) => 
        `4px solid ${isSelected ? c.accent[900] : c.primary[500]}`,
      shadow: (c) => `8px 8px 0 ${c.secondary[500]}`,
      hoverShadow: (c) => `5px 5px 0 ${c.secondary[500]}`,
      selectedBackground: (c) => retroPatterns.polkaDots(c.accent[900] + '10', c.background[100], 2),
      imageContainer: (c) => c.background[100],
      priceTag: {
        background: (c) => retroPatterns.stripes(c.accent[500], c.accent[900], 5),
        color: (c) => c.text[100],
      },
      specContainer: {
        background: (c) => c.secondary[100],
        border: (c) => `2px dashed ${c.secondary[500]}`,
      },
    },
    
    summaryCard: {
      background: (c) => c.background[100],
      border: (c) => `4px solid ${c.primary[900]}`,
      shadow: (c) => `8px 8px 0 ${c.secondary[500]}`,
      headerBackground: (c) => c.primary[500],
      rowBackground: (c, isAlternate) => 
        isAlternate ? c.background[100] : retroPatterns.pixelGrid(c.primary[900], 0.03, 8) + `, ${c.background[100]}`,
    },
    
    input: {
      background: (c) => c.background[100],
      border: (c) => `3px solid ${c.primary[500]}`,
      focusBorder: (c) => `3px solid ${c.accent[500]}`,
      placeholderColor: (c) => c.text[500],
      labelColor: (c) => c.primary[900],
    },
    
    timeSlot: {
      background: (c, isAvailable) => 
        isAvailable ? c.background[100] : c.background[100] + '80',
      border: (c, isAvailable) => 
        `3px ${isAvailable ? 'solid' : 'dashed'} ${isAvailable ? c.primary[500] : c.secondary[500]}`,
      textColor: (c, isAvailable) => 
        isAvailable ? c.text[900] : c.text[500],
    },
  },

  // Decorative elements - retro tech style
  decorativeElements: {
    shapesColor: (c) => c.accent[500],
    patternOpacity: 0.2,
    enableParticles: true,
  },
  
  // Global background patterns with improved CRT effect
  globalBackground: (c) => ({
    main: `${retroPatterns.checkerboard(c.primary[900] + '08', c.background[100], 20)}`,
    accent: `${retroPatterns.diagonalStripes(c.accent[500] + '15', c.primary[500] + '10', 12)}`,
    overlay: `${retroPatterns.scanlines('rgba(0,0,0,0.05)', 2)}, ${retroPatterns.grain('rgba(0,0,0,0.02)')}`,
  }),

  // Section transitions with retro effects
  sectionTransitions: {
    enter: 'fadeInUp 0.3s steps(6)',
    exit: 'fadeOutDown 0.3s steps(6)',
    duration: '0.3s',
  },

  // Additional decorative patterns
  additionalPatterns: {
    cornerDecorations: (c: ThemeColors) => ({
      topLeft: {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderTop: `2px solid ${c.accent[500]}`,
          borderLeft: `2px solid ${c.accent[500]}`,
        },
      },
      topRight: {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '8px',
          height: '8px',
          borderTop: `2px solid ${c.primary[500]}`,
          borderRight: `2px solid ${c.primary[500]}`,
        },
      },
      bottomLeft: {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderBottom: `2px solid ${c.secondary[500]}`,
          borderLeft: `2px solid ${c.secondary[500]}`,
        },
      },
      bottomRight: {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '8px',
          height: '8px',
          borderBottom: `2px solid ${c.accent[900]}`,
          borderRight: `2px solid ${c.accent[900]}`,
        },
      },
    }),
    borderPatterns: (c: ThemeColors) => ({
      top: retroPatterns.stripes(c.accent[500], c.primary[500], 4),
      bottom: retroPatterns.zigzag(c.accent[900], c.primary[900]),
      left: retroPatterns.polkaDots(c.secondary[500] + '20', 'transparent', 3),
      right: retroPatterns.polkaDots(c.secondary[900] + '20', 'transparent', 3),
    }),
    backgroundPatterns: (c: ThemeColors) => [
      retroPatterns.memphis(c.accent[500] + '10', c.primary[500] + '20', 'transparent'),
      retroPatterns.pixelGrid(c.primary[900], 0.03, 8),
      retroPatterns.cassetteTape(c.accent[500] + '20', c.primary[500] + '20'),
    ],
  },

  // Animations - old school digital feel
  animations: {
    pageTransition: "slideInRight 0.25s steps(10)",
    sectionTransition: "fadeInUp 0.3s steps(6)",
    elementEntrance: "fadeIn 0.2s steps(4)",
    pulseGlow: "blinkingCursor 1s steps(2) infinite",
    pixelButton: "pixelButtonHover 2s infinite"
  },
};