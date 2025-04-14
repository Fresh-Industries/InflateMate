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
    text?: string;
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
    text: "#1f2937",
  },
  {
    name: "Green",
    primary: "#10b981",
    secondary: "#6b7280",
    accent: "#f97316",
    background: "#f9fafb",
    text: "#1f2937",
  },
  {
    name: "Purple",
    primary: "#8b5cf6",
    secondary: "#6b7280",
    accent: "#ec4899",
    background: "#f9fafb",
    text: "#1f2937",
  },
  {
    name: "Red",
    primary: "#ef4444",
    secondary: "#6b7280",
    accent: "#3b82f6",
    background: "#f9fafb",
    text: "#1f2937",
  },
  {
    name: "Orange",
    primary: "#f97316",
    secondary: "#6b7280",
    accent: "#8b5cf6",
    background: "#f9fafb",
    text: "#1f2937",
  },
];

export default function ColorSettings({ colors, updateColors }: ColorSettingsProps) {
  const [primaryColor, setPrimaryColor] = useState(colors.primary || "#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState(colors.secondary || "#6b7280");
  const [accentColor, setAccentColor] = useState(colors.accent || "#f59e0b");
  const [backgroundColor, setBackgroundColor] = useState(colors.background || "#f9fafb");
  const [textColor, setTextColor] = useState(colors.text || "#1f2937");
  
  // Update the colors in the parent component when they change
  useEffect(() => {
    updateColors({
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: backgroundColor,
      text: textColor,
    });
  }, [primaryColor, secondaryColor, accentColor, backgroundColor, textColor, updateColors]);
  
  // Apply a predefined color palette
  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setAccentColor(palette.accent);
    setBackgroundColor(palette.background);
    setTextColor(palette.text);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>
            Customize the colors for your website. Choose from presets or create your own unique color scheme.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Presets - Moved to top for better UX */}
          <div className="space-y-2">
            <Label className="text-lg">Quick Start with Presets</Label>
            <div className="flex flex-wrap gap-2">
              {colorPalettes.map((palette, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center gap-2 p-4 hover:scale-105 transition-transform"
                  onClick={() => applyColorPalette(palette)}
                >
                  <div className="flex">
                    <div 
                      className="w-5 h-5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full -ml-2 ring-2 ring-white"
                      style={{ backgroundColor: palette.accent }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full -ml-2 ring-2 ring-white"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  {palette.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Label className="text-lg">Fine-Tune Your Colors</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="flex items-center gap-2">
                  Primary Color
                  <span className="text-xs text-muted-foreground">(buttons, links, headings)</span>
                </Label>
                <div className="flex items-center space-x-2 group">
                  <div 
                    className="w-10 h-10 rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
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
                    className="w-12 h-12 p-0 border-0 cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor" className="flex items-center gap-2">
                  Secondary Color
                  <span className="text-xs text-muted-foreground">(accents, subtle elements)</span>
                </Label>
                <div className="flex items-center space-x-2 group">
                  <div 
                    className="w-10 h-10 rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
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
                    className="w-12 h-12 p-0 border-0 cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor" className="flex items-center gap-2">
                  Accent Color
                  <span className="text-xs text-muted-foreground">(highlights, call-to-actions)</span>
                </Label>
                <div className="flex items-center space-x-2 group">
                  <div 
                    className="w-10 h-10 rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
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
                    className="w-12 h-12 p-0 border-0 cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor" className="flex items-center gap-2">
                  Text Color
                  <span className="text-xs text-muted-foreground">(main content text)</span>
                </Label>
                <div className="flex items-center space-x-2 group">
                  <div 
                    className="w-10 h-10 rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: textColor }}
                  />
                  <Input
                    id="textColor"
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-12 p-0 border-0 cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor" className="flex items-center gap-2">
                  Background Color
                  <span className="text-xs text-muted-foreground">(page background)</span>
                </Label>
                <div className="flex items-center space-x-2 group">
                  <div 
                    className="w-10 h-10 rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
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
                    className="w-12 h-12 p-0 border-0 cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="font-medium mb-4 text-lg">Live Preview</h3>
            <div className="p-6 rounded-lg transition-all" style={{ backgroundColor: backgroundColor }}>
              <div className="space-y-6">
                <h4 className="text-2xl font-bold" style={{ color: primaryColor }}>
                  Welcome to Your Site
                </h4>
                <p style={{ color: textColor }} className="text-lg">
                  This is how your content will look. The main text uses your chosen text color for optimal readability.
                </p>
                <p style={{ color: secondaryColor }} className="text-sm">
                  Secondary text uses the secondary color for subtle hierarchy.
                </p>
                <div className="flex gap-3">
                  <Button 
                    style={{ backgroundColor: primaryColor, color: backgroundColor }}
                    className="hover:scale-105 transition-transform"
                  >
                    Primary Button
                  </Button>
                  <Button 
                    variant="outline" 
                    style={{ color: accentColor, borderColor: accentColor }}
                    className="hover:scale-105 transition-transform"
                  >
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