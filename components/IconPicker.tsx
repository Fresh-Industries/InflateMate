'use client';

import React, { useState, useMemo, ComponentType } from 'react';
import * as LucideIcons from 'lucide-react'; // Keep full import for mapping
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames
import { Search, Sparkles, PartyPopper, Cake, CalendarDays, MapPin, Phone, Mail, Users, DollarSign, Settings, Home, Info, Smile, Star, Sun, Castle, Tent, Award, Gift, CheckCircle } from 'lucide-react'; // Import specific icons for the curated list

// Define the curated list of icons
const curatedIcons: { name: string; icon: ComponentType<LucideIcons.LucideProps> }[] = [
  { name: 'PartyPopper', icon: PartyPopper },
  { name: 'Cake', icon: Cake },
  { name: 'Gift', icon: Gift },
  { name: 'CalendarDays', icon: CalendarDays },
  { name: 'MapPin', icon: MapPin },
  { name: 'Phone', icon: Phone },
  { name: 'Mail', icon: Mail },
  { name: 'Users', icon: Users },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Settings', icon: Settings },
  { name: 'Home', icon: Home },
  { name: 'Info', icon: Info },
  { name: 'Smile', icon: Smile },
  { name: 'Star', icon: Star },
  { name: 'Sun', icon: Sun },
  { name: 'Castle', icon: Castle }, // Relevant?
  { name: 'Tent', icon: Tent },   // Relevant?
  { name: 'Award', icon: Award }, 
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'Sparkles', icon: Sparkles }, // Default/Fallback
  // Add more relevant icons as needed...
  { name: 'ClipboardCheck', icon: LucideIcons.ClipboardCheck }, 
  { name: 'PackageCheck', icon: LucideIcons.PackageCheck },
  { name: 'Truck', icon: LucideIcons.Truck },
  { name: 'Wand2', icon: LucideIcons.Wand2 },
  { name: 'ThumbsUp', icon: LucideIcons.ThumbsUp },
];

// Helper to get the component for a given name from the curated list
const getIconComponent = (name?: string): ComponentType<LucideIcons.LucideProps> => {
  const found = curatedIcons.find(icon => icon.name === name);
  return found ? found.icon : Sparkles; // Default to Sparkles if not found
};

interface IconPickerProps {
  value?: string; // Current icon name
  onChange: (iconName: string) => void;
  className?: string;
  popoverClassName?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value = 'Sparkles', // Default to Sparkles if no value
  onChange,
  className,
  popoverClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return curatedIcons; // Return the full curated list
    }
    // Filter the curated list by name
    return curatedIcons.filter((iconInfo) =>
      iconInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]); // Dependency is only searchTerm now

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false); // Close popover on selection
    setSearchTerm(''); // Reset search
  };

  const SelectedIconComponent = getIconComponent(value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start gap-2', className)}
          aria-label="Pick an icon"
        >
           <SelectedIconComponent className="h-5 w-5 text-muted-foreground" />
           <span className="capitalize text-muted-foreground">{value.replace(/([A-Z])/g, ' $1')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[300px] p-0', popoverClassName)} align="start">
        <div className="p-2 border-b"> {/* Added border */}
          <div className="relative">
            <Input
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9" // Keep smaller search input
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
           </div>
        </div>
        <ScrollArea className="h-[200px]"> {/* Slightly reduced height */}
          <div className="grid grid-cols-6 gap-1 p-2"> {/* Adjusted columns slightly */}
            {/* Map over the filtered curated list */}
            {filteredIcons.length > 0 ? (
              filteredIcons.map(({ name, icon: IconComponent }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleIconSelect(name)}
                  className={cn(
                    'h-9 w-9 rounded-md', // Made buttons slightly smaller
                    value === name && 'bg-primary/10 text-primary ring-1 ring-primary' // Adjusted selected style
                  )}
                  title={name}
                >
                  {/* Render the icon component directly */}
                  <IconComponent className="h-5 w-5" /> 
                </Button>
              ))
            ) : (
              <p className="col-span-full text-center text-sm text-muted-foreground p-4">
                No icons found.
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}; 