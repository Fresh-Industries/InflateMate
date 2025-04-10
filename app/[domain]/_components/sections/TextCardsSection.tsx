'use client';

import React from 'react';
import { TextCardsSectionContent, TextCard } from '@/lib/business/domain-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming usage of shadcn/ui
// Import Lucide icons dynamically or select specific ones
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react'; 

interface TextCardsSectionProps {
  content: TextCardsSectionContent;
}

// Map icon names (if used) to actual components
const iconMap: { [key: string]: React.ElementType } = {
  check: CheckCircle,
  zap: Zap,
  shield: ShieldCheck,
  // Add more icons as needed
};

// Basic component to render text cards
export default function TextCardsSection({ content }: TextCardsSectionProps) {
  const { title, cards } = content;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {title && <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>}
      {cards && cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            // Dynamically select icon component based on name (if provided)
            const IconComponent = card.icon ? iconMap[card.icon] : null; 

            return (
              <Card key={card.id} className="text-center shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  {IconComponent && (
                    <div className="flex justify-center mb-4">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  {card.title && <CardTitle>{card.title}</CardTitle>}
                </CardHeader>
                <CardContent>
                  {card.description && <p className="text-muted-foreground">{card.description}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 