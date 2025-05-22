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
    name: "Circus Spectacular",
    primary: "#FF3D7F", // vibrant magenta (main buttons/CTAs)
    secondary: "#32B4FF", // bright sky blue (sections, cards)
    accent: "#FFD100", // sunshine yellow (highlights, badges)
    background: "#F9F4FF", // soft lavender white (background)
    text: "#2B2D42", // deep navy (readable text)
  },
  {
    name: "Tropical Bounce",
    primary: "#00BFB2", // turquoise (primary actions)
    secondary: "#FF9F1C", // sunset orange (feature sections)
    accent: "#FC4F67", // coral pink (accents, notifications)
    background: "#F0FFF6", // mint white (background)
    text: "#1F2D3D", // charcoal blue (text)
  },
  {
    name: "Neon Playground",
    primary: "#6C11FF", // electric purple (main CTAs)
    secondary: "#00E0A6", // bright mint (secondary elements)
    accent: "#FF427F", // hot pink (highlights, special offers)
    background: "#FBFAFE", // pale lilac white (background)
    text: "#120D31", // deep indigo (text contrast)
  },
  {
    name: "Fantasy Kingdom",
    primary: "#5271FF", // royal blue (primary buttons)
    secondary: "#FF9F8C", // coral peach (cards, banners)
    accent: "#35D282", // emerald green (highlights, tags)
    background: "#FEF8FF", // ivory white (background)
    text: "#2D2B55", // twilight purple (text)
  },
  {
    name: "Bubblegum Party",
    primary: "#FF6BB8", // bubblegum pink (main actions)
    secondary: "#4DB5FF", // clear blue (sections, headers)
    accent: "#FFDE59", // cheerful yellow (highlights)
    background: "#FFF0F9", // cotton candy (background)
    text: "#33264E", // plum purple (text)
  },
  {
    name: "Adventure Safari",
    primary: "#FF8427", // safari orange (primary CTAs)
    secondary: "#4CAF50", // jungle green (panels, cards)
    accent: "#FFCD38", // sun yellow (badges, icons)
    background: "#FFFAED", // sand beige (background)
    text: "#33302E", // dark brown (text)
  },
  {
    name: "Space Bounce",
    primary: "#7B4DFF", // cosmic purple (main actions)
    secondary: "#14CAFF", // nebula blue (cards, sections)
    accent: "#FF6584", // asteroid pink (highlights)
    background: "#F5F6FF", // star white (background)
    text: "#1E1656", // deep space (text)
  },
  {
    name: "Sweet Celebration",
    primary: "#FF5C8D", // strawberry (primary buttons)
    secondary: "#7BD9D0", // mint ice cream (sections)
    accent: "#FFBE0B", // honey gold (highlights, special tags)
    background: "#FFF9FA", // vanilla cream (background)
    text: "#3D3A50", // chocolate (text)
  },
  {
    name: "Superhero Bounce",
    primary: "#E63946", // hero red (main CTAs)
    secondary: "#457B9D", // navy blue (panels, cards)
    accent: "#FFD60A", // power yellow (badges, stars)
    background: "#F4F9FF", // sky white (background)
    text: "#1D3557", // midnight blue (text)
  },
  {
    name: "Magic Wonderland",
    primary: "#9D4EDD", // enchanted purple (primary actions)
    secondary: "#06D6A0", // magical teal (sections, features)
    accent: "#FF7C43", // spellbound orange (accents)
    background: "#F8F7FF", // fairy dust white (background)
    text: "#2B2D42", // mystic charcoal (text)
  },
  {
    name: "Happy Hopper",
    primary:    "#41C9E2", // swimming pool blue (primary/hero)
    secondary:  "#F27C1E", // orange pop (buttons, nav highlights)
    accent:     "#EDE23B", // daffodil yellow (badges, tags)
    background: "#FDFDF6", // pale lemonade (background)
    text:       "#232B30", // dark slate, readable on light BG
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
