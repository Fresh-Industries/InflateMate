'use client';

import React from 'react';
import { VideoTextSectionContent } from '@/lib/business/domain-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming usage of shadcn/ui

interface VideoTextSectionProps {
  content: VideoTextSectionContent;
}

// Basic component to render video and text
// Layout (e.g., side-by-side) will be handled by theme components
export default function VideoTextSection({ content }: VideoTextSectionProps) {
  const { title, text, videoUrl, videoPosition = 'left' } = content;

  // Basic iframe embed - consider using a library for more robust embedding
  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
    } catch (e) {
      console.error("Invalid video URL", url, e);
    }
    return url; // Fallback or handle unsupported URLs
  };
  
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {title && <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h2>}
      {/* Layout classes (like flex direction) will be added by theme components */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        {/* Video Element */}
        <div className={`w-full md:w-1/2 ${videoPosition === 'right' ? 'md:order-last' : ''}`}>
          {embedUrl ? (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
               <iframe 
                src={embedUrl} 
                title={title || 'Video Section'} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Invalid video URL</p>
            </div>
          )}
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