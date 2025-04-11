// ThemedButton.tsx

import React from 'react';
import { ThemeColors, ThemeDefinition } from '@/app/[domain]/_themes/themeConfig'; // Removed themeConfig import
import { Button, ButtonProps } from '@/components/ui/button'; // Import ButtonProps
import { cn } from "@/lib/utils"; // Import cn utility

// Extend ButtonProps and add our theme-specific props
interface ThemedButtonProps extends ButtonProps {
  theme: ThemeDefinition; // Accept theme object directly
  colors: ThemeColors;
  children: React.ReactNode;
}

export default function ThemedButton({
  theme, // Use theme prop
  colors,
  children,
  className,
  style,
  ...props // Pass rest of the props to the underlying Button
}: ThemedButtonProps) {
  // Get the theme definition, defaulting to modern
  const btnStyles = theme.buttonStyles;
  
  // Calculate dynamic styles, including new ones
  const cssVariables = {
    '--btn-bg': btnStyles.background(colors),
    '--btn-text-color': btnStyles.textColor(colors),
    '--btn-hover-bg': btnStyles.hoverBackground(colors),
    // Optional styles - set only if defined in theme
    ...(btnStyles.border && { '--btn-border': btnStyles.border(colors) }),
    ...(btnStyles.shadow && { '--btn-shadow': btnStyles.shadow(colors) }),
    ...(btnStyles.hoverTextColor && { '--btn-hover-text-color': btnStyles.hoverTextColor(colors) }),
    ...(btnStyles.hoverBorder && { '--btn-hover-border': btnStyles.hoverBorder(colors) }),
    ...(btnStyles.hoverShadow && { '--btn-hover-shadow': btnStyles.hoverShadow(colors) }),
  } as React.CSSProperties;

  return (
    <Button
      style={{ ...cssVariables, ...style }} // Set CSS variables
      className={cn(
        'theme-aware-button', // Apply class for CSS rules
        'px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out', // Base styling & transition
        // Use shadow function existence to determine applying default hover shadow
        btnStyles.shadow ? '' : 'hover:shadow-md',
        'hover:scale-[1.03]', // Subtle hover effects
        className // Merge with any passed className
      )}
      {...props} // Spread the rest of the ButtonProps
    >
      {children}
    </Button>
  );
}
