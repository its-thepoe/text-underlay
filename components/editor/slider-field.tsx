'use client'

import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LockIcon } from 'lucide-react';

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
  handleAttributeChange
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
      <div className={`flex items-center justify-between ${hasTopPadding ? 'mt-8' : ''}`}>
        <div className="flex items-center gap-2">
          <Label htmlFor={attribute}>{label}</Label>
          {premiumFeature && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <LockIcon size={12} />
              <span>Pro</span>
            </div>
          )}
        </div>
        <div
          style={{
            width: 54,
            borderRadius: 4,
            border: 'none',
            padding: '4px 6px',
            fontSize: 15,
            fontWeight: 400,
            outline: 'none',
            textAlign: 'center',
            background: 'transparent',
            color: '#666',
            userSelect: 'none',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={label + ' Value Display'}
        >
          {currentValue}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8, position: 'relative', minHeight: 60 }}>
        <div style={{ flex: 1, position: 'relative' }}>
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
            onBlur={() => setShowBadge(false)}
            onMouseDown={() => { setShowBadge(true); updateBadgePos(); }}
            onMouseUp={() => setShowBadge(false)}
            onTouchStart={() => { setShowBadge(true); updateBadgePos(); }}
            onTouchEnd={() => setShowBadge(false)}
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
                transition: 'left 0.08s cubic-bezier(.4,1.6,.6,1)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {currentValue}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <button
            type="button"
            aria-label={label + ' Decrement'}
            disabled={disabled || currentValue <= min}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              background: '#f4f4f5',
              color: '#222',
              fontWeight: 700,
              fontSize: 20,
              cursor: disabled || currentValue <= min ? 'not-allowed' : 'pointer',
              opacity: disabled || currentValue <= min ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              userSelect: 'none',
            }}
            onClick={() => {
              if (!disabled && currentValue > min) {
                handleAttributeChange(attribute, Math.max(min, currentValue - step));
              }
            }}
          >
            –
          </button>
          <button
            type="button"
            aria-label={label + ' Increment'}
            disabled={disabled || currentValue >= max}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              background: '#f4f4f5',
              color: '#222',
              fontWeight: 700,
              fontSize: 20,
              cursor: disabled || currentValue >= max ? 'not-allowed' : 'pointer',
              opacity: disabled || currentValue >= max ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              userSelect: 'none',
            }}
            onClick={() => {
              if (!disabled && currentValue < max) {
                handleAttributeChange(attribute, Math.min(max, currentValue + step));
              }
            }}
          >
            +
          </button>
        </div>
      </div>
    </>
  );
};

export default SliderField