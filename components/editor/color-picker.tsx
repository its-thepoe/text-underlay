'use client'

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChromePicker, SketchPicker } from 'react-color';
import { colors } from '@/constants/colors';
import { Check, ColorSwatch } from 'iconsax-react';

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
  const [isOpen, setIsOpen] = useState(false);

  // Enhanced preset colors with better organization
  const presetColors = [
    // Primary colors
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    // Warm colors
    '#ff6b35', '#f7931e', '#ffd23f', '#ff6b9d', '#ff8a80',
    // Cool colors
    '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
    // Neutral colors
    '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
    '#6c757d', '#495057', '#343a40', '#212529', '#1a1a1a',
  ];

  const handleColorChange = (color: any) => {
    handleAttributeChange(attribute, color.hex);
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2 my-4">
      <Label htmlFor={attribute} className="text-[13px] text-gray-100 dark:text-gray-100">{label}</Label>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 h-9 px-3 border-gray-700 dark:border-gray-600 bg-gray-800/50 dark:bg-gray-900/50 hover:bg-gray-700/50 dark:hover:bg-gray-800/50 text-gray-100 dark:text-gray-100"
          >
            <div
              style={{ background: currentColor }}
              className="rounded-md h-4 w-4 border border-gray-500 dark:border-gray-400 shadow-sm"
            />
            <span className="text-[13px] font-medium text-gray-100 dark:text-gray-100">{currentColor}</span>
            <ColorSwatch size={14} className="text-gray-300 dark:text-gray-300" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-72 p-0 border-gray-700 dark:border-gray-600 bg-gray-900 dark:bg-gray-950 shadow-xl"
          side="left"
          sideOffset={10}
        >
          <Tabs defaultValue="picker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-600">
              <TabsTrigger value="picker" className="text-[13px] text-gray-200 dark:text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gray-700 dark:data-[state=active]:bg-gray-800">Color Picker</TabsTrigger>
              <TabsTrigger value="presets" className="text-[13px] text-gray-200 dark:text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gray-700 dark:data-[state=active]:bg-gray-800">Presets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="picker" className="p-4">
              <SketchPicker
                color={currentColor}
                onChange={handleColorChange}
                disableAlpha={false}
                presetColors={[]}
                styles={{
                  default: {
                    picker: {
                      background: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      padding: '0',
                      width: '100%',
                    },
                    saturation: {
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    },
                    hue: {
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      height: '20px',
                      marginBottom: '12px',
                    },
                    alpha: {
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      height: '20px',
                      marginBottom: '12px',
                    },
                    
                  },
                }}
              />
            </TabsContent>
            
            <TabsContent value="presets" className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[13px] font-medium text-gray-100 dark:text-gray-100 mb-3">Quick Colors</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handleAttributeChange(attribute, color);
                          setIsOpen(false);
                        }}
                        className="relative w-7 h-7 rounded-md border-2 border-gray-700 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-colors group"
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {currentColor.toLowerCase() === color.toLowerCase() && (
                          <Check 
                            size={12} 
                            className="absolute inset-0 m-auto text-white drop-shadow-lg" 
                          />
                        )}
                        <div className="absolute inset-0 rounded-md bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[13px] font-medium text-gray-100 dark:text-gray-100 mb-3">Common Colors</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.slice(0, 15).map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handleAttributeChange(attribute, color);
                          setIsOpen(false);
                        }}
                        className="relative w-7 h-7 rounded-md border-2 border-gray-700 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-colors group"
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {currentColor.toLowerCase() === color.toLowerCase() && (
                          <Check 
                            size={12} 
                            className="absolute inset-0 m-auto text-white drop-shadow-lg" 
                          />
                        )}
                        <div className="absolute inset-0 rounded-md bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;