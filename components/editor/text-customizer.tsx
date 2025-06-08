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
import { Move, Text, Bold, RotateCw, Palette, LightbulbIcon, CaseSensitive, TypeOutline, ArrowLeftRight, ArrowUpDown, AlignHorizontalSpaceAround, LockIcon } from 'lucide-react';
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
    const [isPaidUser, setIsPaidUser] = useState(false);
    const supabaseClient = useSupabaseClient();

    useEffect(() => { 
        const checkUserStatus = async () => {
            try {
                const { data: profile, error } = await supabaseClient
                    .from('profiles')
                    .select('paid')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                setIsPaidUser(profile?.paid || false);
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        };

        checkUserStatus();
    }, [userId, supabaseClient]);

    const controls = [
        { id: 'text', icon: <CaseSensitive size={20} />, label: 'Text' },
        { id: 'fontFamily', icon: <TypeOutline size={20} />, label: 'Font' },
        { id: 'color', icon: <Palette size={20} />, label: 'Color' },
        { id: 'position', icon: <Move size={20} />, label: 'Position' },
        { id: 'fontSize', icon: <Text size={20} />, label: 'Size' },
        { id: 'fontWeight', icon: <Bold size={20} />, label: 'Weight' },
        { id: 'letterSpacing', icon: <AlignHorizontalSpaceAround size={20} />, label: 'Letter spacing', premium: true },
        { id: 'opacity', icon: <LightbulbIcon size={20} />, label: 'Opacity' },
        { id: 'rotation', icon: <RotateCw size={20} />, label: 'Rotate' },
        { id: 'tiltX', icon: <ArrowLeftRight size={20} />, label: 'Tilt X (3D effect)', premium: true },
        { id: 'tiltY', icon: <ArrowUpDown size={20} />, label: 'Tilt Y (3D effect)', premium: true },
    ];  

    const handlePremiumAttributeChange = (attribute: string, value: any) => {
        if (isPaidUser || (attribute !== 'letterSpacing' && attribute !== 'tiltX' && attribute !== 'tiltY')) {
            handleAttributeChange(textSet.id, attribute, value);
        }
    };

    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>{textSet.text}</AccordionTrigger>
            <AccordionContent>
                {/* Mobile Controls */}
                <div className="md:hidden">
                    <div className="flex w-full gap-1 mb-2 p-1">
                        {['text', 'position', 'effects'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveControl(tab)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeControl === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                            >
                                {tab === 'text' && 'Text'}
                                {tab === 'position' && 'Position'}
                                {tab === 'effects' && 'Effects'}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2">
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
                                    label="Text Size (% of image height)"
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
                                    label="X Position (%)"
                                    min={-100}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.xPct}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    pushUndoCheckpoint={() => pushUndoCheckpoint(textSet.id)}
                                />
                                <SliderField
                                    attribute="yPct"
                                    label="Y Position (%)"
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
                                    label="Horizontal Tilt (3D effect)"
                                    min={-90}
                                    max={90}
                                    step={1}
                                    currentValue={textSet.tiltX}
                                    handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                                    disabled={!isPaidUser}
                                    premiumFeature={!isPaidUser}
                                />
                                <SliderField
                                    attribute="tiltY"
                                    label="Vertical Tilt (3D effect)"
                                    min={-90}
                                    max={90}
                                    step={1}
                                    currentValue={textSet.tiltY}
                                    handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                                    disabled={!isPaidUser}
                                    premiumFeature={!isPaidUser}
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
                <div className="hidden md:block hide-scrollbar" style={{overflowY: 'auto'}}>
                    <InputField
                        attribute="text"
                        label="Text"
                        currentValue={textSet.text}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <div className='flex flex-row items-center gap-12 w-full'>
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
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <SliderField
                            attribute="xPct"
                            label="X Position (%)"
                            min={-100}
                            max={100}
                            step={1}
                            currentValue={textSet.xPct}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="yPct"
                            label="Y Position (%)"
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
                            disabled={!isPaidUser}
                            premiumFeature={!isPaidUser}
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
                            label="Horizontal Tilt (3D effect)"
                            min={-45}
                            max={45}
                            step={1}
                            currentValue={textSet.tiltX}
                            handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                            disabled={!isPaidUser}
                            premiumFeature={!isPaidUser}
                            hasTopPadding={false}
                        />
                        <SliderField
                            attribute="tiltY"
                            label="Vertical Tilt (3D effect)"
                            min={-45}
                            max={45}
                            step={1}
                            currentValue={textSet.tiltY}
                            handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                            disabled={!isPaidUser}
                            premiumFeature={!isPaidUser}
                            hasTopPadding={false}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-2 my-8">
                    <Button onClick={() => duplicateTextSet(textSet)}>Duplicate Text Set</Button>
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