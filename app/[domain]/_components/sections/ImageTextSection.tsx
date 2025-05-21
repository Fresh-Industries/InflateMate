import React from 'react';
import Image from 'next/image'; // Use Next.js Image for optimization
import { ImageTextSectionContent } from '@/lib/business/domain-utils';
import { Card, CardContent, CardTitle } from '@/components/ui/card'; 
import { ThemeColors, ThemeDefinition } from '@/app/[domain]/_themes/types';
import { themeConfig } from '../../_themes/themeConfig';

interface ImageTextSectionProps {
  content: ImageTextSectionContent;
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
}

const getCardStyle = (theme: ThemeDefinition, colors: ThemeColors): React.CSSProperties => {
  const styles = theme.cardStyles;
  return {
    backgroundColor: styles.background(colors),
    border: styles.border(colors),
    boxShadow: styles.boxShadow(colors),
    color: styles.textColor(colors),
    borderRadius: styles.borderRadius || '16px', // Default modern rounding if not specified
  };
};

// Basic component to render image and text
// Layout (e.g., side-by-side) will be handled by theme components
export default function ImageTextSection({ content, themeName, colors }: ImageTextSectionProps) {
  const theme = themeConfig[themeName];
  const { title, text, imageUrl, imagePosition = 'left', backgroundColor } = content;
  // Alt text should ideally be configurable, but using title or a default for now
  const altText = title || "Section Image"; 
console.log('backgroundColor',backgroundColor)
  const textColor = theme.imageTextStyles?.textColor(colors) ?? colors.text[500];
  const imageStyles = theme.imageStyles(colors) ?? {};
  const cardStyles = getCardStyle(theme, colors);


  return (
    <div className="container mx-auto px-4 py-8 md:py-12" style={{ background: backgroundColor }}>
      
       {/* Layout classes (like flex direction) will be added by theme components */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        {/* Image Element */} 
        <div className={`w-full md:w-1/2 ${imagePosition === 'right' ? 'md:order-last' : ''}`}>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg" style={imageStyles}> 
            <Image 
              src={imageUrl} 
              alt={altText} 
              fill // Use fill for responsive images within a sized container
              className='w-full h-72 md:h-[450px] object-cover' // or contain, depending on desired behavior
              sizes="(max-width: 768px) 100vw, 50vw" // Help Next.js optimize
            />
          </div>
        </div>
        {/* Text Content */}
        <Card className="w-full md:w-1/2 flex flex-col items-center justify-center" style={cardStyles}>
        {title && <CardTitle className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: textColor }}>{title}</CardTitle>}
        {text && (
          <CardContent className="w-full md:w-1/2" style={{ color: textColor }}>
            <p className="text-base md:text-lg text-muted-foreground whitespace-pre-wrap">{text}</p>
          </CardContent>
        )}
      </Card>
      </div>
    </div>
  );
} 