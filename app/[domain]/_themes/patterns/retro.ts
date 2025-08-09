import { CSSProperties } from 'react';

interface RetroPatterns {
  grid: (color1: string, color2: string, size: number) => string;
  vhsTracking: () => string;
  stars: (starColor: string, bgColor: string) => string;
  pixelCorners: (color: string) => CSSProperties;
  stripes: (color1: string, color2: string, size: number) => string;
  zigzag: (color1: string, color2: string) => string;
  polkaDots: (color1: string, color2: string, size: number) => string;
  memphis: (color1: string, color2: string, color3: string) => string;
  pixelGrid: (color: string, opacity: number, size: number) => string;
  cassetteTape: (color1: string, color2: string) => string;
  scanlines: (color: string, size: number) => string;
  grain: (color: string) => string;
  diagonalStripes: (color1: string, color2: string, size: number) => string;
  squareGrid: (color1: string, color2: string, size: number) => string;
  checkerboard: (color1: string, color2: string, size: number) => string;
  neonGlow: (baseColor: string, glowColor: string, size: number) => string;
}

export const retroPatterns: RetroPatterns = {
  grid: (color1, color2) => `
    linear-gradient(${color1} 1px, transparent 1px),
    linear-gradient(90deg, ${color1} 1px, transparent 1px),
    linear-gradient(${color2} 1px, transparent 1px),
    linear-gradient(90deg, ${color2} 1px, transparent 1px)
  `,

  vhsTracking: () => `
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 0px,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 2px
    )
  `,

  stars: (starColor, bgColor) => `
    radial-gradient(
      1px 1px at 25px 5px,
      ${starColor},
      transparent
    ),
    radial-gradient(
      1px 1px at 50px 25px,
      ${starColor},
      transparent
    ),
    radial-gradient(
      1px 1px at 125px 20px,
      ${starColor},
      transparent
    ),
    radial-gradient(
      1.5px 1.5px at 50px 75px,
      ${starColor},
      transparent
    ),
    radial-gradient(
      2px 2px at 15px 125px,
      ${starColor},
      transparent
    ),
    radial-gradient(
      2.5px 2.5px at 110px 80px,
      ${starColor},
      transparent
    ),
    ${bgColor}
  `,

  pixelCorners: (color) => ({
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '8px',
      height: '8px',
      borderTop: `2px solid ${color}`,
      borderLeft: `2px solid ${color}`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '8px',
      height: '8px',
      borderBottom: `2px solid ${color}`,
      borderRight: `2px solid ${color}`,
    },
  }),

  stripes: (color1, color2, size) => `
    repeating-linear-gradient(
      45deg,
      ${color1},
      ${color1} ${size}px,
      ${color2} ${size}px,
      ${color2} ${size * 2}px
    )
  `,

  zigzag: (color1, color2) => `
    linear-gradient(135deg, ${color1} 25%, transparent 25%) -10px 0,
    linear-gradient(225deg, ${color1} 25%, transparent 25%) -10px 0,
    linear-gradient(315deg, ${color1} 25%, transparent 25%),
    linear-gradient(45deg, ${color1} 25%, transparent 25%);
    background-size: 20px 20px;
    background-color: ${color2};
  `,

  polkaDots: (color1, color2, size) => `
    radial-gradient(
      ${color1} ${size}px,
      ${color2} ${size}px
    );
    background-size: ${size * 2}px ${size * 2}px;
  `,

  memphis: (color1, color2, color3) => `
    linear-gradient(45deg, ${color1} 25%, transparent 25%),
    linear-gradient(-45deg, ${color2} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${color1} 75%),
    linear-gradient(-45deg, ${color3} 75%, ${color2} 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  `,

  pixelGrid: (color, opacity, size) => `
    linear-gradient(
      ${color} ${opacity},
      transparent ${opacity}
    ),
    linear-gradient(
      90deg,
      ${color} ${opacity},
      transparent ${opacity}
    );
    background-size: ${size}px ${size}px;
  `,

  cassetteTape: (color1, color2) => 
    `linear-gradient(
      45deg,
      ${color1} 25%,
      transparent 25%,
      transparent 75%,
      ${color1} 75%,
      ${color1}
    ),
    linear-gradient(
      -45deg,
      ${color2} 25%,
      transparent 25%,
      transparent 75%,
      ${color2} 75%,
      ${color2}
    )`,

  scanlines: (color = 'rgba(0, 0, 0, 0.1)', size = 2) => 
    `linear-gradient(to bottom, transparent, transparent ${size-1}px, ${color} ${size-1}px, ${color} ${size}px)`,
    
  grain: (color: string) => `
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.25' fill='${color.replace('#', '%23')}' /%3E%3C/svg%3E");
  `,
  
  diagonalStripes: (color1: string, color2: string, size: number) => `
    repeating-linear-gradient(
      -45deg,
      ${color1},
      ${color1} ${size/2}px,
      ${color2} ${size/2}px,
      ${color2} ${size}px
    )
  `,
  
  squareGrid: (color1: string, color2: string, size: number) => `
    linear-gradient(to right, ${color1} 1px, transparent 1px) 0 0 / ${size}px ${size}px,
    linear-gradient(to bottom, ${color1} 1px, transparent 1px) 0 0 / ${size}px ${size}px,
    ${color2}
  `,
  
  checkerboard: (color1: string, color2: string, size: number) => `
    linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%),
    linear-gradient(45deg, ${color1} 25%, transparent 25%, transparent 75%, ${color1} 75%);
    background-color: ${color2};
    background-size: ${size}px ${size}px;
    background-position: 0 0, ${size/2}px ${size/2}px;
  `,

  neonGlow: (baseColor: string, glowColor: string, size: number) => `
    linear-gradient(to right, ${baseColor}, ${baseColor}),
    0 0 ${size}px ${glowColor},
    0 0 ${size*2}px ${glowColor},
    0 0 ${size*3}px ${glowColor}
  `

  
}; 

