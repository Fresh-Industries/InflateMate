'use client';

import React from 'react';
import { VideoTextSectionContent } from '@/lib/business/domain-utils';
import { ThemeDefinition, ThemeColors } from '@/app/[domain]/_themes/types';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { themeConfig } from '../../_themes/themeConfig';

interface VideoTextSectionProps {
  content: VideoTextSectionContent;
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
}

// Helper function from ImageTextSection for card styling
const getCardStyle = (theme: ThemeDefinition, colors: ThemeColors): React.CSSProperties => {
  const styles = theme.cardStyles;
  return {
    backgroundColor: styles.background(colors),
    border: styles.border(colors),
    boxShadow: styles.boxShadow(colors),
    color: styles.textColor(colors),
    borderRadius: styles.borderRadius || '16px',
  };
};

export default function VideoTextSection({ content, themeName, colors }: VideoTextSectionProps) {
  const theme = themeConfig[themeName];
  const { title, text, videoUrl, videoPosition = 'left', backgroundColor } = content || {};
  const textColor = colors.text[500];
  const cardStyles = getCardStyle(theme, colors);



  return (
    <div className="container mx-auto px-4 py-8 md:py-12" style={{ backgroundColor: backgroundColor || 'transparent' }}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        {/* Video Element */}
        <div className={`w-full md:w-1/2 ${videoPosition === 'right' ? 'md:order-last' : ''}`}>
          {videoUrl ? (
            // Use HTML <video> tag for direct URLs
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg bg-black">
              <video
                src={videoUrl}
                controls // Show default browser controls
                playsInline // Recommended for mobile compatibility
                className="w-full h-full object-cover" // Use object-cover or object-contain
                title={title || 'Video Section'} // Accessibility
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Video URL missing</p>
            </div>
          )}
        </div>
        {/* Text Content */}
         <Card className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8" style={cardStyles}>
           {title && <CardTitle className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6" style={{ color: textColor }}>{title}</CardTitle>}
           {text && (
             <CardContent className="p-0" style={{ color: textColor }}>
               <p className="text-base md:text-lg text-center text-muted-foreground whitespace-pre-wrap">{text}</p>
             </CardContent>
           )}
         </Card>
      </div>
    </div>
  );
} 