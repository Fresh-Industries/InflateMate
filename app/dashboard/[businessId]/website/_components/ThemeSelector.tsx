'use client';

import { useState } from 'react';
import { BusinessWithSiteConfig, Theme } from '@/lib/business/domain-utils';
import { modern, playful, bouncy } from '@/lib/config/themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ThemeSelectorProps {
  business: BusinessWithSiteConfig;
  onChange: (theme: Theme) => void;
}

const themes: Theme[] = [modern, playful, bouncy].map(t => ({ id: t.id, name: t.themeName }));

export default function ThemeSelector({ business, onChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    business.siteConfig?.themeName || themes.find(t => t.id === modern.id) || themes[0]
  );

  const handleSelectTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    onChange(theme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Website Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant={selectedTheme.id === theme.id ? 'primary-gradient' : 'outline'}
              onClick={() => handleSelectTheme(theme)}
              className="h-20 flex flex-col items-center justify-center relative"
            >
              <span className="text-lg font-semibold capitalize">{theme.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 