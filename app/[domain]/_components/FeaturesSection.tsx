'use client';

import React from 'react';

interface FeaturesSectionProps {
  colors: { primary: string; accent: string; secondary: string };
}

// Static Features section (content could be dynamic later)
export default function FeaturesSection({ colors }: FeaturesSectionProps) {
  const { primary: primaryColor, accent: accentColor, secondary: tertiaryColor } = colors;

  const features = [
    {
      emoji: '🧼',
      title: 'Clean & Safe',
      description: 'All our inflatables are thoroughly cleaned and sanitized before every rental for your peace of mind.',
      bgColor: `${primaryColor}10`,
      iconBg: `${primaryColor}20`,
      titleColor: primaryColor
    },
    {
      emoji: '🎉',
      title: 'Fun for Everyone',
      description: 'Our bounce houses are perfect for kids and adults of all ages - creating unforgettable experiences.',
      bgColor: `${accentColor}10`,
      iconBg: `${accentColor}20`,
      titleColor: accentColor
    },
    {
      emoji: '🚚',
      title: 'Hassle-Free Setup',
      description: 'We can handle delivery, setup, and pickup for a completely stress-free experience for your event.',
      bgColor: `${tertiaryColor}10`,
      iconBg: `${tertiaryColor}20`,
      titleColor: tertiaryColor
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16"
          style={{ color: primaryColor }}
        >
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
              style={{ backgroundColor: feature.bgColor }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md"
                style={{ backgroundColor: feature.iconBg }}
              >
                <span className="text-3xl">{feature.emoji}</span>
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: feature.titleColor }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 