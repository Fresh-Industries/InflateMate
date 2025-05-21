import React, { Suspense } from 'react';
import { DynamicSection } from '@/lib/business/domain-utils';
import { ThemeColors } from '../_themes/types';
import { themeConfig } from '../_themes/themeConfig';

const ImageTextSection = React.lazy(() => import('./sections/ImageTextSection'));
const VideoTextSection = React.lazy(() => import('./sections/VideoTextSection'));
const TextCardsSection = React.lazy(() => import('./sections/TextCardsSection'));

export interface SectionRendererProps {
  section: DynamicSection;
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
}

// Map section types to components
const sectionComponentMap = {
  Image: ImageTextSection,
  Video: VideoTextSection,
  Cards: TextCardsSection,
};

// Renders a dynamic section based on its type
export default function SectionRenderer({ section, themeName, colors }: SectionRendererProps) {
  const Component = sectionComponentMap[section.type];

  if (!Component) {
    console.warn(`No component found for section type: ${section.type}`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = section.content as any;

  return (
    <Suspense fallback={<div>Loading section...</div>}>
      <Component content={content} colors={colors} themeName={themeName}  />
    </Suspense>
  );
} 