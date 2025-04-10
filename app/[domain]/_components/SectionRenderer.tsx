'use client';

import React, { Suspense } from 'react';
import { DynamicSection } from '@/lib/business/domain-utils';

// Lazy load section components
const TextSection = React.lazy(() => import('./sections/TextSection'));
const ImageTextSection = React.lazy(() => import('./sections/ImageTextSection'));
const VideoTextSection = React.lazy(() => import('./sections/VideoTextSection'));
const TextCardsSection = React.lazy(() => import('./sections/TextCardsSection'));

interface SectionRendererProps {
  section: DynamicSection;
}

// Map section types to components
const sectionComponentMap = {
  text: TextSection,
  imageText: ImageTextSection,
  videoText: VideoTextSection,
  textCards: TextCardsSection,
};

// Renders a dynamic section based on its type
export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = sectionComponentMap[section.type];

  if (!Component) {
    console.warn(`No component found for section type: ${section.type}`);
    return null; // Or render a placeholder/error
  }

  // Pass the specific content object to the matched component
  const content = section.content as any; // Cast might be needed depending on exact types

  return (
    <Suspense fallback={<div>Loading section...</div>}>
      <Component content={content} />
    </Suspense>
  );
} 