'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ArrowDown2, TickSquare, Lock } from 'iconsax-react';
import { cn } from '@/lib/utils';
import { FREE_FONTS, ALL_FONTS } from '@/constants/fonts';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface FontFamilyPickerProps { 
  attribute: string;
  currentFont: string;
  handleAttributeChange: (attribute: string, value: string) => void;
  userId: string;
}

const FontFamilyPicker: React.FC<FontFamilyPickerProps> = ({
  attribute,
  currentFont,
  handleAttributeChange,
  userId
}) => {
  // All fonts are now free
  const [isPaidUser, setIsPaidUser] = useState(true);
  const supabaseClient = useSupabaseClient();

  // User status check disabled - all fonts are now free
  useEffect(() => {
    // No need to check user status anymore
  }, []);

  return (
    <Popover>
      <div className='flex flex-row items-center justify-between gap-3 my-4'>
        <div className="flex flex-col items-start">
          <Label className="gap-1 text-[13px]">Font</Label>
        </div>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[240px] justify-between p-2",
              !currentFont && "text-gray-500 dark:text-gray-400"
            )}
          >
            {currentFont ? currentFont : "Select font"}
            <ArrowDown2 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search font..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup heading="All Fonts">
              {ALL_FONTS.map((font) => (
                <CommandItem
                  value={font}
                  key={font}
                  onSelect={() => handleAttributeChange(attribute, font)}
                  className='hover:cursor-pointer'
                  style={{ fontFamily: font }}
                >
                  {font}
                  <TickSquare
                    className={cn(
                      "ml-auto h-4 w-4",
                      font === currentFont ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FontFamilyPicker;