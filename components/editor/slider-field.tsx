'use client'

import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lock } from 'iconsax-react';

// Accessible slider thumb size
const sliderStyles = `
input[type=range]::-webkit-slider-thumb {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background: var(--primary, #6366f1);
  border: 2px solid var(--border, #d1d5db);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background: var(--primary, #6366f1);
  border: 2px solid var(--border, #d1d5db);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
}
input[type=range]::-ms-thumb {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background: var(--primary, #6366f1);
  border: 2px solid var(--border, #d1d5db);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
}
input[type=range] {
  accent-color: var(--primary, #6366f1);
  height: 44px;
  width: 100%;
  margin: 0;
  background: transparent;
}
`;

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
  const [showBadge, setShowBadge] = useState(false);
  const [badgePos, setBadgePos] = useState(0);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSliderInputFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = parseFloat(event.target.value);
    handleAttributeChange(attribute, value);
  };

  // Calculate badge position above thumb
  const updateBadgePos = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const percent = (Number(slider.value) - min) / (max - min);
      setBadgePos(percent * slider.offsetWidth);
    }
  };

  return (
    <>
      <style>{sliderStyles}</style>
      <div className={`flex items-center gap-4 ${hasTopPadding ? 'mt-4' : 'mt-2'}`} style={{ position: 'relative', minHeight: 44 }}>
        <div className="flex items-center gap-2 min-w-[120px]">
          <Label htmlFor={attribute} className="whitespace-nowrap">{label}</Label>
          {premiumFeature && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Lock size="16" />
              <span>Pro</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, position: 'relative', width: '100%' }}>
          <input
            ref={sliderRef}
            id={attribute}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={e => {
              handleSliderInputFieldChange(e);
              setShowBadge(true);
              updateBadgePos();
            }}
            onInput={updateBadgePos}
            onFocus={() => { setShowBadge(true); updateBadgePos(); }}
            onBlur={e => {
              setShowBadge(false);
              if (pushUndoCheckpoint) pushUndoCheckpoint();
            }}
            onMouseDown={() => { setShowBadge(true); updateBadgePos(); }}
            onMouseUp={e => {
              setShowBadge(false);
              if (pushUndoCheckpoint) pushUndoCheckpoint();
            }}
            onTouchStart={() => { setShowBadge(true); updateBadgePos(); }}
            onTouchEnd={e => {
              setShowBadge(false);
              if (pushUndoCheckpoint) pushUndoCheckpoint();
            }}
            aria-label={label}
            disabled={disabled}
            style={{ width: '100%', zIndex: 1, position: 'relative' }}
          />
          {showBadge && (
            <div
              style={{
                position: 'absolute',
                left: sliderRef.current
                  ? `calc(${badgePos}px - 28px)`
                  : '50%',
                top: '-24px',
                minWidth: '44px',
                height: '36px',
                background: '#222',
                color: '#fff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                border: '1px solid #fff',
                padding: '0 10px',
                transition: 'left 0.2s cubic-bezier(.25, .46, .45, .94)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {currentValue}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SliderField