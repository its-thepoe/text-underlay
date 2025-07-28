import React, { useState, useEffect } from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker'; 
import { Button } from '../ui/button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Text, TextBold, RotateRight, Brush, Lamp, ArrowSwapHorizontal, Lock } from 'iconsax-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TextCustomizerProps {
    textSet: {
        id: number;
        text: string;
        fontFamily: string;
        xPct: number; // -100 to 100
        yPct: number; // -100 to 100
        color: string;
        fontSizePct: number; // 1 to 100 (relative to image height)
        fontWeight: number;
        opacity: number;
        rotation: number;
        shadowColor: string;
        shadowSize: number;
        tiltX: number;
        tiltY: number;
        letterSpacing: number;
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void;
    userId: string;
    pushUndoCheckpoint?: (id: number) => void;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet, userId, pushUndoCheckpoint = () => {} }) => {
    const [activeControl, setActiveControl] = useState<string | null>(null);
    // All features are now free
    const [isPaidUser, setIsPaidUser] = useState(true);
    const supabaseClient = useSupabaseClient();

    // User status check disabled - all features are now free
    useEffect(() => {
        // No need to check user status anymore
    }, []);

    const controls = [
        { id: 'text', icon: <Text size={20} />, label: 'Text' },
        { id: 'fontFamily', icon: <Text size={20} />, label: 'Font' },
        { id: 'color', icon: <Brush size={20} />, label: 'Color' },
        { id: 'position', icon: <ArrowSwapHorizontal size={20} />, label: 'Position' },
        { id: 'fontSize', icon: <Text size={20} />, label: 'Size' },
        { id: 'fontWeight', icon: <TextBold size={20} />, label: 'Weight' },
        { id: 'letterSpacing', icon: <ArrowSwapHorizontal size={20} />, label: 'Letter spacing' },
        { id: 'opacity', icon: <Lamp size={20} />, label: 'Opacity' },
        { id: 'rotation', icon: <RotateRight size={20} />, label: 'Rotate' },
        { id: 'tiltX', icon: <ArrowSwapHorizontal size={20} />, label: 'Tilt X (3D)' },
        { id: 'tiltY', icon: <ArrowSwapHorizontal size={20} />, label: 'Tilt Y (3D)' },
    ];  

    const handlePremiumAttributeChange = (attribute: string, value: any) => {
        // All features are now free
        if (true) {
            handleAttributeChange(textSet.id, attribute, value);
        }
    };

    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>{textSet.text}</AccordionTrigger>
            <AccordionContent>
                {/* Mobile Controls */}
                <div className="md:hidden max-h-[60vh] overflow-y-auto overflow-x-visible" role="region" aria-label="Mobile Text Controls">
                    <div className="flex w-full gap-1 mb-2 p-1" role="tablist" aria-label="Control Tabs">
                        {['text', 'position', 'effects'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveControl(tab)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${activeControl === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                                aria-label={
                                  tab === 'text' ? 'Text' : tab === 'position' ? 'Position' : 'Effects & Styling'
                                }
                                role="tab"
                                aria-selected={activeControl === tab}
                            >
                                {tab === 'text' && <Text size={22} />}
                                {tab === 'position' && <ArrowSwapHorizontal size={22} />}
                                {tab === 'effects' && <Brush size={22} />}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 pb-4" role="tabpanel" aria-label="Control Panel">
                        {/* TEXT TAB */}
                        {activeControl === 'text' && (
                            <>
                                <InputField
                                    attribute="text"
                                    label="Text"
                                    currentValue={textSet.text}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                                <FontFamilyPicker
                                    attribute="fontFamily"
                                    currentFont={textSet.fontFamily}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    userId={userId}
                                />
                                <SliderField
                                    attribute="fontSizePct"
                                    label="Text Size"
                                    min={1}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.fontSizePct}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    pushUndoCheckpoint={() => pushUndoCheckpoint(textSet.id)}
                                />
                                <SliderField
                                    attribute="fontWeight"
                                    label="Font Weight"
                                    min={100}
                                    max={900}
                                    step={100}
                                    currentValue={textSet.fontWeight}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    pushUndoCheckpoint={() => pushUndoCheckpoint(textSet.id)}
                                />
                            </>
                        )}
                        {/* POSITION TAB */}
                        {activeControl === 'position' && (
                            <>
                                <SliderField
                                    attribute="xPct"
                                    label="X Position"
                                    min={-100}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.xPct}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    pushUndoCheckpoint={() => pushUndoCheckpoint(textSet.id)}
                                />
                                <SliderField
                                    attribute="yPct"
                                    label="Y Position"
                                    min={-100}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.yPct}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    pushUndoCheckpoint={() => pushUndoCheckpoint(textSet.id)}
                                />
                                <SliderField
                                    attribute="rotation"
                                    label="Rotation"
                                    min={-360}
                                    max={360}
                                    step={1}
                                    currentValue={textSet.rotation}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                                <SliderField
                                    attribute="tiltX"
                                    label="Horizontal Tilt (3D)"
                                    min={-90}
                                    max={90}
                                    step={1}
                                    currentValue={textSet.tiltX}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                                <SliderField
                                    attribute="tiltY"
                                    label="Vertical Tilt (3D)"
                                    min={-90}
                                    max={90}
                                    step={1}
                                    currentValue={textSet.tiltY}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </>
                        )}
                        {/* EFFECTS TAB */}
                        {activeControl === 'effects' && (
                            <>
                                <ColorPicker
                                    attribute="color"
                                    label="Text Colour"
                                    currentColor={textSet.color}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                                <SliderField
                                    attribute="opacity"
                                    label="Text Opacity"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    currentValue={textSet.opacity}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                                <SliderField
                                    attribute="letterSpacing"
                                    label="Letter Spacing"
                                    min={-20}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.letterSpacing}
                                    handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                                    disabled={!isPaidUser}
                                    premiumFeature={!isPaidUser}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block max-h-[70vh] overflow-y-auto overflow-x-visible" role="region" aria-label="Desktop Text Controls">
                    <InputField
                        attribute="text"
                        label="Text"
                        currentValue={textSet.text}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                   
                        <FontFamilyPicker
                            attribute="fontFamily"
                            currentFont={textSet.fontFamily}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            userId={userId}
                        />
                        <ColorPicker
                            attribute="color"
                            label="Text Colour"
                            currentColor={textSet.color}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
              
                    <div className="flex flex-col gap-1 mt-4" role="region" aria-label="Text Positioning Controls">
                        <SliderField
                            attribute="xPct"
                            label="X Position"
                            min={-100}
                            max={100}
                            step={1}
                            currentValue={textSet.xPct}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="yPct"
                            label="Y Position"
                            min={-100}
                            max={100}
                            step={1}
                            currentValue={textSet.yPct}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="letterSpacing"
                            label="Letter Spacing"
                            min={-20}
                            max={100}
                            step={1}
                            currentValue={textSet.letterSpacing}
                            handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                            disabled={false}
                            premiumFeature={false}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="opacity"
                            label="Text Opacity"
                            min={0}
                            max={1}
                            step={0.01}
                            currentValue={textSet.opacity}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="rotation"
                            label="Rotation"
                            min={-360}
                            max={360}
                            step={1}
                            currentValue={textSet.rotation}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="tiltX"
                            label="Horizontal Tilt (3D)"
                            min={-45}
                            max={45}
                            step={1}
                            currentValue={textSet.tiltX}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="tiltY"
                            label="Vertical Tilt (3D)"
                            min={-45}
                            max={45}
                            step={1}
                            currentValue={textSet.tiltY}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-2 my-8" role="region" aria-label="Text Set Actions">
                    <Button 
  onClick={() => duplicateTextSet(textSet)}
  variant="secondary"
>
  Duplicate Text Set
</Button>
                    <Button variant="destructive" onClick={() => removeTextSet(textSet.id)}>Remove Text Set</Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

// Hide scrollbar utility
// Add this style globally or in a relevant CSS/SCSS file if not present
// .hide-scrollbar::-webkit-scrollbar { display: none; }
// .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

export default TextCustomizer;