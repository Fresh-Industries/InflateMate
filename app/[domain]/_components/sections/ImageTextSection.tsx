'use client';

import React from 'react';
import Image from 'next/image'; // Use Next.js Image for optimization
import { ImageTextSectionContent } from '@/lib/business/domain-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming usage of shadcn/ui

interface ImageTextSectionProps {
  content: ImageTextSectionContent;
}

// Basic component to render image and text
// Layout (e.g., side-by-side) will be handled by theme components
export default function ImageTextSection({ content }: ImageTextSectionProps) {
  const { title, text, imageUrl, imagePosition = 'left' } = content;
  // Alt text should ideally be configurable, but using title or a default for now
  const altText = title || "Section Image"; 

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {title && <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h2>}
       {/* Layout classes (like flex direction) will be added by theme components */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        {/* Image Element */} 
        <div className={`w-full md:w-1/2 ${imagePosition === 'right' ? 'md:order-last' : ''}`}>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg"> 
            <Image 
              src={imageUrl} 
              alt={altText} 
              fill // Use fill for responsive images within a sized container
              style={{ objectFit: "cover" }} // or contain, depending on desired behavior
              sizes="(max-width: 768px) 100vw, 50vw" // Help Next.js optimize
            />
          </div>
        </div>
        {/* Text Content */}
        {text && (
          <div className="w-full md:w-1/2">
            <p className="text-base md:text-lg text-muted-foreground whitespace-pre-wrap">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
} 