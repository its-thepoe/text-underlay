'use client'

import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Lock } from 'iconsax-react';

interface SliderFieldProps {
  attribute: string;
  label: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  hasTopPadding?: boolean;
  disabled?: boolean;
  premiumFeature?: boolean;
  handleAttributeChange: (attribute: string, value: number) => void;
  pushUndoCheckpoint?: () => void;
}

const SliderField: React.FC<SliderFieldProps> = ({
  attribute,
  label,
  min,
  max,
  step,
  currentValue,
  hasTopPadding = true,
  disabled = false,
  premiumFeature = false,
  handleAttributeChange,
  pushUndoCheckpoint = () => {}
}) => {
  const handleValueChange = (value: number[]) => {
    if (disabled) return;
    handleAttributeChange(attribute, value[0]);
  };

  const handlePointerDown = () => {
    // Optional: Add any pointer down logic here
  };

  const handlePointerUp = () => {
    if (pushUndoCheckpoint) pushUndoCheckpoint();
  };

  return (
    <div className={`flex items-center gap-4 ${hasTopPadding ? 'mt-4' : 'mt-2'}`} style={{ position: 'relative', minHeight: 44 }}>
      <div className="flex items-center gap-2 min-w-[120px]">
        <Label htmlFor={attribute} className="whitespace-nowrap text-[13px]">{label}</Label>
        {premiumFeature && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Lock size="16" />
            <span>Pro</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative', width: '100%' }}>
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          showTooltip={true}
          tooltipContent={(value) => `${value}`}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SliderField