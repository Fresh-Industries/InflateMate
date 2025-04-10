'use client';

import React from 'react';
import { TextSectionContent } from '@/lib/business/domain-utils';

interface TextSectionProps {
  content: TextSectionContent;
}

// Basic component to render a block of text
export default function TextSection({ content }: TextSectionProps) {
  const { title, text } = content;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {title && <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h2>}
      {text && (
        <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-muted-foreground whitespace-pre-wrap text-center">{text}</p>
        </div>
      )}
    </div>
  );
} 