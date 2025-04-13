import React from 'react';
import { ThemeColors, ThemeDefinition } from '@/app/[domain]/_themes/themeConfig';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from "@/lib/utils";

// Helper function to compute contrast color (black or white) based on background brightness.
function getContrastColor(hex: string): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map((c) => c + c).join('');
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Use a standard luminance formula to determine brightness.
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}

interface ThemedButtonProps extends ButtonProps {
  theme: ThemeDefinition;
  colors: ThemeColors;
  children: React.ReactNode;
}

export default function ThemedButton({
  theme,
  colors,
  children,
  className,
  style,
  ...props
}: ThemedButtonProps) {
  const btnStyles = theme.buttonStyles;
  
  // Compute hover text color automatically if not provided in the theme
  const computedHoverTextColor = btnStyles.hoverTextColor
    ? btnStyles.hoverTextColor(colors)
    : getContrastColor(btnStyles.hoverBackground(colors));
  
  const cssVariables = {
    '--btn-bg': btnStyles.background(colors),
    '--btn-text-color': btnStyles.textColor(colors),
    '--btn-hover-bg': btnStyles.hoverBackground(colors),
    '--btn-hover-text-color': computedHoverTextColor,
    ...(btnStyles.border && { '--btn-border': btnStyles.border(colors) }),
    ...(btnStyles.shadow && { '--btn-shadow': btnStyles.shadow(colors) }),
    ...(btnStyles.hoverBorder && { '--btn-hover-border': btnStyles.hoverBorder(colors) }),
    ...(btnStyles.hoverShadow && { '--btn-hover-shadow': btnStyles.hoverShadow(colors) }),
  } as React.CSSProperties;

  return (
    <Button
      style={{ ...cssVariables, ...style }}
      className={cn(
        'theme-aware-button',
        'px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out',
        btnStyles.shadow ? '' : 'hover:shadow-md',
        'hover:scale-[1.03]',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
