'use client';

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { getContrastColor } from "@/app/[domain]/_themes/utils";

interface ColorSettingsProps {
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateColors: (colors: any) => void;
}
const colorPalettes = [
  {
    name: "Pastel Playground",
    primary:    "#A2D5F2", // sky‑blue buttons & links
    secondary:  "#F2A2E8", // cotton‑candy panels & icons
    accent:     "#FFE066", // sunny‑yellow badges & hovers
    background: "#F7F9FC", // whisper‑light page BG
    text:       "#2E3A59", // deep‑blue text for 4.5:1+ contrast
  },
  {
    name: "Sunshine Pop",
    primary:    "#FFC947", // mustard CTAs
    secondary:  "#FF6A00", // tangerine outlines & icons
    accent:     "#00B8A9", // teal highlights & hover states
    background: "#FFF8E7", // warm cream background
    text:       "#333333", // dark charcoal copy
  },
  {
    name: "Bubblegum Bliss",
    primary:    "#FF6EC7", // hot‑pink buttons
    secondary:  "#6EC1E4", // pastel‑blue cards
    accent:     "#FFD670", // pale‑gold micro‑interactions
    background: "#F0F8FF", // airy light‑blue BG
    text:       "#1A1A1A", // almost‑black for headlines
  },
  {
    name: "Tropic Treat",
    primary:    "#FF9F1C", // bright‑orange primary
    secondary:  "#2EC4B6", // sea‑green secondaries
    accent:     "#E71D36", // raspberry accent pops
    background: "#FBFCFD", // near‑white base
    text:       "#2E2E2E", // dark gray body text
  },
  {
    name: "Confetti Carnival",
    primary:    "#FFCA3A", // marigold primaries
    secondary:  "#8AC926", // lime‑green secondaries
    accent:     "#1982C4", // cerulean accent details
    background: "#FFFFFF", // neutral white canvas
    text:       "#212121", // pure black headlines
  },
  {
    name: "Balloon Bonanza Rev",
    primary:    "#357ABD", // deeper, calmer sky‑blue for CTAs & headings
    secondary:  "#2AA69A", // richer teal for outlines, icons & secondary buttons
    accent:     "#FFBE00", // warmer gold for badges, hovers & micro‑interactions
    background: "#F7FAFF", // very pale off‑white so primary really stands out
    text:       "#1A1A1A", // rock‑solid dark for all copy & headings
  },
  {
    name: "Neon Party",
    primary:    "#FF4081", // electric pink primaries
    secondary:  "#536DFE", // electric indigo secondaries
    accent:     "#00E5FF", // cyan pop accents
    background: "#FAFAFA", // clean light gray
    text:       "#263238", // slate gray copy
  },
  {
    name: "Starburst Fun",
    primary:    "#D81159", // punchy magenta
    secondary:  "#8F2D56", // rich berry secondary
    accent:     "#218380", // teal accent for contrast
    background: "#FCFCFC", // bright neutral BG
    text:       "#0C090D", // near‑black text
  },
];

export default function ColorSettings({
  colors,
  updateColors,
}: ColorSettingsProps) {
  const [primaryColor, setPrimaryColor] = useState(
    colors.primary || "#3b82f6"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    colors.secondary || "#6b7280"
  );
  const [accentColor, setAccentColor] = useState(
    colors.accent || "#f59e0b"
  );
  const [backgroundColor, setBackgroundColor] = useState(
    colors.background || "#f9fafb"
  );
  const [textColor, setTextColor] = useState(colors.text || "#1f2937");

  useEffect(() => {
    updateColors({
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: backgroundColor,
      text: textColor,
    });
  }, [
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    textColor,
    updateColors,
  ]);

  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setAccentColor(palette.accent);
    setBackgroundColor(palette.background);
    setTextColor(palette.text);
  };

  const colorFields = [
    {
      id: "primaryColor",
      label: "Primary Color",
      tooltip: "Used for main buttons, links, and headings.",
      value: primaryColor,
      setter: setPrimaryColor,
    },
    {
      id: "secondaryColor",
      label: "Secondary Color",
      tooltip: "Used for subtle accents, icons, and outlines.",
      value: secondaryColor,
      setter: setSecondaryColor,
    },
    {
      id: "accentColor",
      label: "Accent Color",
      tooltip: "Used for badges, highlights, and hover states.",
      value: accentColor,
      setter: setAccentColor,
    },
    {
      id: "textColor",
      label: "Text Color",
      tooltip: "Used for all body and heading text.",
      value: textColor,
      setter: setTextColor,
    },
    {
      id: "backgroundColor",
      label: "Background Color",
      tooltip: "Used as the page or card background.",
      value: backgroundColor,
      setter: setBackgroundColor,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>
            Customize your site colors. Pick a preset or fine‑tune each role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-lg">Quick Start with Presets</Label>
            <div className="flex flex-wrap gap-2">
              {colorPalettes.map((p, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="flex items-center gap-2 p-3 hover:scale-105 transition-transform"
                  onClick={() => applyColorPalette(p)}
                >
                  <div className="flex -space-x-1">
                    <div
                      className="w-5 h-5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: p.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: p.accent }}
                    />
                    <div
                      className="w-5 h-5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: p.secondary }}
                    />
                  </div>
                  {p.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Fine‑Tune */}
          <div className="space-y-2">
            <Label className="text-lg">Fine‑Tune Your Colors</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colorFields.map(({ id, label, tooltip, value, setter }) => (
                <div key={id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={id}>{label}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2 group">
                    <div
                      className="w-10 h-10 rounded-lg border shadow-sm group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: value }}
                    />
                    <Input
                      id={id}
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-12 h-12 p-0 border-0 cursor-pointer hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <Card className="p-6">
            <CardTitle>Live Preview</CardTitle>
            <CardContent
              className="rounded-lg p-6"
              style={{ backgroundColor }}
            >
              <h4
                className="text-2xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                Sample Heading
              </h4>
              <p style={{ color: textColor }} className="mb-2">
                This is a paragraph using your Text Color for maximum readability.
              </p>
              <p style={{ color: secondaryColor }} className="mb-4">
                Secondary text example (subtle hierarchy).
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Button
                  style={{
                    backgroundColor: primaryColor,
                    color: getContrastColor(primaryColor),
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  variant="outline"
                  style={{
                    borderColor: secondaryColor,
                    color: secondaryColor,
                  }}
                >
                  Secondary Button
                </Button>
                <Button
                  variant="outline"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  Accent Button
                </Button>
              </div>
              <span
                className="inline-block px-2 py-1 rounded text-sm mb-4"
                style={{
                  backgroundColor: accentColor,
                  color: getContrastColor(accentColor),
                }}
              >
                Accent Badge
              </span>
              <div>
                <a
                  href="#"
                  style={{ color: primaryColor }}
                  className="underline"
                >
                  Sample Link
                </a>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
