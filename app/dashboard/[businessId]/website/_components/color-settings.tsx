'use client';

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface ColorSettingsProps {
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  updateColors: (colors: any) => void;
}

// Predefined color palettes
const colorPalettes = [
  {
    name: "Blue",
    primary: "#3b82f6",
    secondary: "#6b7280",
    accent: "#f59e0b",
    background: "#f9fafb",
  },
  {
    name: "Green",
    primary: "#10b981",
    secondary: "#6b7280",
    accent: "#f97316",
    background: "#f9fafb",
  },
  {
    name: "Purple",
    primary: "#8b5cf6",
    secondary: "#6b7280",
    accent: "#ec4899",
    background: "#f9fafb",
  },
  {
    name: "Red",
    primary: "#ef4444",
    secondary: "#6b7280",
    accent: "#3b82f6",
    background: "#f9fafb",
  },
  {
    name: "Orange",
    primary: "#f97316",
    secondary: "#6b7280",
    accent: "#8b5cf6",
    background: "#f9fafb",
  },
];

export default function ColorSettings({ colors, updateColors }: ColorSettingsProps) {
  const [primaryColor, setPrimaryColor] = useState(colors.primary || "#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState(colors.secondary || "#6b7280");
  const [accentColor, setAccentColor] = useState(colors.accent || "#f59e0b");
  const [backgroundColor, setBackgroundColor] = useState(colors.background || "#f9fafb");
  
  // Update the colors in the parent component when they change
  useEffect(() => {
    updateColors({
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: backgroundColor,
    });
  }, [primaryColor, secondaryColor, accentColor, backgroundColor, updateColors]);
  
  // Apply a predefined color palette
  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setAccentColor(palette.accent);
    setBackgroundColor(palette.background);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>
            Customize the colors for your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-md border"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    id="primaryColor"
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for buttons, links, and primary elements
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-md border"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <Input
                    id="secondaryColor"
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for secondary text and elements
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-md border"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Input
                    id="accentColor"
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for highlights and accent elements
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-md border"
                    style={{ backgroundColor: backgroundColor }}
                  />
                  <Input
                    id="backgroundColor"
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for page backgrounds
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Color Presets</Label>
            <div className="flex flex-wrap gap-2">
              {colorPalettes.map((palette, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => applyColorPalette(palette)}
                >
                  <div className="flex">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full -ml-1"
                      style={{ backgroundColor: palette.accent }}
                    />
                  </div>
                  {palette.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="p-4 rounded-md" style={{ backgroundColor: backgroundColor }}>
              <div className="space-y-4">
                <h4 className="text-lg font-bold" style={{ color: primaryColor }}>
                  Sample Heading
                </h4>
                <p style={{ color: secondaryColor }}>
                  This is a sample paragraph showing how your colors will look on your website.
                </p>
                <div className="flex gap-2">
                  <Button style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
                    Primary Button
                  </Button>
                  <Button variant="outline" style={{ color: accentColor, borderColor: accentColor }}>
                    Accent Button
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 