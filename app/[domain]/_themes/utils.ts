import chroma from 'chroma-js';

export type ColorScale = {
  100: string;
  500: string;
  900: string;
};

// Helper to calculate contrast: returns "#000000" for light backgrounds, or "#ffffff" for dark backgrounds.
export const getContrastColor = (hex: string | ColorScale): string => {
    // Handle ColorScale input
    let colorValue: string;
    if (typeof hex === 'object' && hex !== null && '500' in hex) {
      colorValue = hex[500];
    } else {
      colorValue = hex as string;
    }
    
    // Simplified hex validation and expansion
    let color = (colorValue || '#ffffff').replace('#', '');
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    if (color.length !== 6) {
      console.warn('Invalid hex color format for contrast calculation:', colorValue);
      return '#000000'; // Default to black on error
    }
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
};

export function makeScale(baseHex: string): ColorScale {
    const clampL = (c: chroma.Color, delta: number) => {
      const [l] = c.lab();
      return c.set('lab.l', Math.min(100, Math.max(0, l + delta)));
    };

    
  
    const light = clampL(chroma(baseHex), +20);
    const dark  = clampL(chroma(baseHex), -20);
    // bias stops closer to base for smoother gradients
    const scale = chroma.scale([light, baseHex, dark]).mode('lab').domain([0, 0.5, 1]);
  
    return {
      100: scale(0.2).hex(),  // softer pastel
      500: baseHex,
      900: scale(0.8).hex(),  // not full black
    };
  }

console.log(makeScale('#8b5cf6'));
