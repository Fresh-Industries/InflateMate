import React, { Suspense } from 'react';
import { DynamicSection } from '@/lib/business/domain-utils';
import { ThemeDefinition, ThemeColors } from '../_themes/themeConfig';

// Lazy load section components
const TextSection = React.lazy(() => import('./sections/TextSection'));
const ImageTextSection = React.lazy(() => import('./sections/ImageTextSection'));
const VideoTextSection = React.lazy(() => import('./sections/VideoTextSection'));
const TextCardsSection = React.lazy(() => import('./sections/TextCardsSection'));

export interface SectionRendererProps {
  section: DynamicSection;
  theme: ThemeDefinition;
  colors: ThemeColors;
}

// Map section types to components
const sectionComponentMap = {
  text: TextSection,
  imageText: ImageTextSection,
  videoText: VideoTextSection,
  textCards: TextCardsSection,
};

// Renders a dynamic section based on its type
export default function SectionRenderer({ section, theme, colors }: SectionRendererProps) {
  const Component = sectionComponentMap[section.type];

  if (!Component) {
    console.warn(`No component found for section type: ${section.type}`);
    return null; // Or render a placeholder/error
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = section.content as any; 

  return (
    <Suspense fallback={<div>Loading section...</div>}>
      <Component content={content} colors={colors} theme={theme} section={section} />
    </Suspense>
  );
} 