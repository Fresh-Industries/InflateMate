'use client';

import { useState } from 'react';
import { BusinessWithSiteConfig, Theme } from '@/lib/business/domain-utils';
import { modern, playful, retro } from '@/lib/config/themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  business: BusinessWithSiteConfig;
  onChange: (theme: Theme) => void;
}

const themeDescriptions = {
  modern: {
    title: "Modern & Minimalistic",
    description: "Clean, refined, and understated design with subtle gradients and crisp edges. Perfect for a professional look.",
    preview: {
      cardBg: "#ffffff",
      buttonBg: "#4f46e5",
      accent: "#f97316",
      border: "1px solid rgba(0,0,0,0.1)",
      shadow: "0 2px 4px rgba(0,0,0,0.1)",
      radius: "12px"
    }
  },
  retro: {
    title: "Retro (Neobrutalism)",
    description: "Bold, raw, and unapologetic design with thick borders and heavy shadows. Makes a strong visual statement.",
    preview: {
      cardBg: "#fffef8",
      buttonBg: "#000000",
      accent: "#ff3e3e",
      border: "3px solid #000000",
      shadow: "4px 4px 0 #000000",
      radius: "0px"
    }
  },
  playful: {
    title: "Playful & Creative",
    description: "Vibrant and energetic design with colorful elements and playful interactions. Perfect for fun and engaging websites.",
    preview: {
      cardBg: "#ffffff",
      buttonBg: "#8b5cf6",
      accent: "#f59e0b",
      border: "2px solid #8b5cf6",
      shadow: "0 4px 12px rgba(139,92,246,0.3)",
      radius: "20px"
    }
  }
};

const themes: Theme[] = [modern, playful, retro].map(t => ({ id: t.id, name: t.themeName }));

export default function ThemeSelector({ business, onChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    business.siteConfig?.themeName || themes.find(t => t.id === modern.id) || themes[0]
  );

  const handleSelectTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    onChange(theme);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl">Select Website Theme</CardTitle>
        <CardDescription>Choose a theme that best represents your brand&apos;s personality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => {
            const themeInfo = themeDescriptions[theme.id as keyof typeof themeDescriptions];
            const isSelected = selectedTheme.id === theme.id;
            
            return (
              <div
                key={theme.id}
                className={`relative cursor-pointer group transition-all duration-300 ${
                  isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
                onClick={() => handleSelectTheme(theme)}
              >
                {/* Theme Preview Card */}
                <div
                  className="relative p-4 transition-all duration-300"
                  style={{
                    backgroundColor: themeInfo.preview.cardBg,
                    border: themeInfo.preview.border,
                    boxShadow: themeInfo.preview.shadow,
                    borderRadius: themeInfo.preview.radius,
                  }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  )}

                  {/* Theme Title */}
                  <h3 className="text-lg font-semibold mb-2">{themeInfo.title}</h3>

                  {/* Preview Elements */}
                  <div className="space-y-3 mb-4">
                    {/* Button Preview */}
                    <div
                      className="w-full py-2 px-4 text-white text-center text-sm"
                      style={{
                        backgroundColor: themeInfo.preview.buttonBg,
                        borderRadius: themeInfo.preview.radius,
                        boxShadow: themeInfo.preview.shadow,
                      }}
                    >
                      Button Preview
                    </div>

                    {/* Card Preview */}
                    <div
                      className="w-full h-12 mb-2"
                      style={{
                        backgroundColor: themeInfo.preview.accent + '20',
                        borderRadius: themeInfo.preview.radius,
                        border: themeInfo.preview.border,
                      }}
                    />

                    {/* Text Preview */}
                    <div className="space-y-1">
                      <div className="h-2 w-3/4 bg-gray-200 rounded" />
                      <div className="h-2 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>

                  {/* Theme Description */}
                  <p className="text-sm text-muted-foreground">{themeInfo.description}</p>
                </div>

                {/* Selection Border Overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                    isSelected
                      ? 'border-2 border-primary'
                      : 'border-2 border-transparent group-hover:border-primary/50'
                  }`}
                  style={{ borderRadius: themeInfo.preview.radius }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 