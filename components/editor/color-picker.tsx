'use client'

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChromePicker } from 'react-color';
import { colors } from '@/constants/colors';

interface ColorPickerProps {
  attribute: string;
  label: string;
  currentColor: string;
  handleAttributeChange: (attribute: string, value: any) => void;
} 

const ColorPicker: React.FC<ColorPickerProps> = ({
  attribute,
  label,
  currentColor,
  handleAttributeChange,
}) => {

  return (
    <div className={`flex flex-row items-center justify-between gap-2`}>
      <Label htmlFor={attribute}>{label}</Label>

      <div className='flex flex-wrap gap-1 p-1'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant='outline' className='gap-2'>
              <div
                style={{ background: currentColor }}
                className="rounded-md h-full w-6 cursor-pointer active:scale-105"
              />
              <span>{currentColor}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='flex flex-col items-center justify-center w-[240px]'
            side='left'
            sideOffset={10}
          >
            <Tabs defaultValue='colorPicker'>
             
              <TabsContent value='colorPicker'>
                <ChromePicker
                  color={currentColor}
                  onChange={(color) => handleAttributeChange(attribute, color.hex)}
                />
              </TabsContent>
              <TabsContent value='suggestions'>
                <div className='flex flex-wrap gap-1 mt-2'>
                  {colors.map((color) => (
                    <div
                      key={color}
                      style={{ background: color }}
                      className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                      onClick={() => handleAttributeChange(attribute, color)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs> 
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ColorPicker;