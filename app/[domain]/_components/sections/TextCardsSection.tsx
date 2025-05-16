
import React, { ComponentType, Suspense } from 'react';
import { TextCard, TextCardsSectionContent } from '@/lib/business/domain-utils';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { Card, CardContent, CardTitle } from "@/components/ui/card"; 
import * as LucideIcons from 'lucide-react'; 
import { Loader2 } from 'lucide-react'; 
import { themeConfig } from '../../_themes/themeConfig';

// Helper component to render Lucide icons dynamically by name
// (Should match the one used in IconPicker or be moved to shared utils)
const DynamicLucideIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as ComponentType<LucideIcons.LucideProps> | undefined;
  if (!IconComponent) {
    console.warn(`No Lucide icon found for name: ${name}`);
    return null;
  }
  return <IconComponent {...props} />;
};

interface TextCardsSectionProps {
  content: TextCardsSectionContent;
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
}

// Component to render text cards section
export default function TextCardsSection({ content, themeName, colors }: TextCardsSectionProps) {
  const cards = content.cards || [];
  const sectionStyle = { backgroundColor: content.backgroundColor || 'transparent' };
  const theme = themeConfig[themeName];

  // Adjusted getCardStyle definition
  const getCardStyle = (cardData: TextCard): React.CSSProperties => {
    const cardThemeStyles = theme.cardStyles; // Use a different name 
    const cardBg = cardData.backgroundColor || cardThemeStyles.background(colors) || '#ffffff';
    const cardBorder = cardThemeStyles.border(colors);
    const cardShadow = cardThemeStyles.boxShadow(colors);
    const cardColor = cardThemeStyles.textColor(colors);
    const cardRadius = cardThemeStyles.borderRadius || '16px';
    
    return { 
      backgroundColor: cardBg,
      border: cardBorder,
      boxShadow: cardShadow,
      color: cardColor,
      borderRadius: cardRadius,
    };
  };

  return (
    <section className="py-12 md:py-16" style={sectionStyle}>
      <div className="container mx-auto px-4">
        {/* ... Section Title ... */} 
        {content?.title && (
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12"
            style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary[500] }}
          >
            {content.title}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card) => (
            <Card 
              key={card.id}
              className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              // Use the getCardStyle helper function
              style={getCardStyle(card)} 
            >
              {/* Card Icon - Render if card.icon exists */}
              {card.icon && (
                 <div className="mb-5 p-3 rounded-full bg-primary/10 text-primary"> {/* Adjusted styling */}
                     <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin" />}>
                        {/* Use the helper, provide size */}
                        <DynamicLucideIcon name={card.icon} className="h-7 w-7" /> 
                    </Suspense>
                 </div>
              )}
               {/* Card Title */}
              {card.title && (
                <CardTitle 
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.featureSectionStyles?.cardTitleColor(colors, cards.indexOf(card)) || colors.primary[500] }}
                >
                  {card.title}
                </CardTitle>
              )}
               {/* Card Description */} 
              {card.description && (
                <CardContent className="text-base p-0">
                  <p 
                    style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text[500] }}
                    className="opacity-90"
                  >
                    {card.description}
                   </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 