// app/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { setNaturalSize, setPreviewSize, pctToPx } from '@/lib/imageMeta';

import { useUser } from '@/hooks/useUser';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/mode-toggle';
import { Profile } from '@/types';
import LoginButton from '@/components/login-button';
import TextCustomizer from '@/components/editor/text-customizer';

import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons';

import { removeBackground } from "@imgly/background-removal";

import '@/app/fonts.css';
import PayDialog from '@/components/pay-dialog';

const Page = () => {
    const { user } = useUser();
    const { session } = useSessionContext();
    const supabaseClient = useSupabaseClient();
    const [currentUser, setCurrentUser] = useState<Profile>()

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const [pastTextSets, setPastTextSets] = useState<Array<any>[]>([]);
    const [futureTextSets, setFutureTextSets] = useState<Array<any>[]>([]);
    const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('');
    const isUndoRedoRef = useRef(false);

    // Autosave draft to localStorage every 3 seconds
    useEffect(() => {
      const id = setInterval(() => {
        let safeBase64 = uploadedImageBase64;
        // Only save base64 if it's under 2MB (2,000,000 chars)
        if (safeBase64 && safeBase64.length > 2_000_000) {
          console.warn('Image too large to autosave in draft. Only text will be saved.');
          safeBase64 = null;
        }
        try {
          localStorage.setItem('draft', JSON.stringify({ textSets, selectedImage, uploadedImageBase64: safeBase64 }));
        } catch (e) {
          console.warn('Draft not saved: localStorage quota exceeded.');
        }
      }, 3000);
      return () => clearInterval(id);
    }, [textSets, selectedImage, uploadedImageBase64]);

    // Only show restore modal once per mount, even in strict mode
    const hasRestoredDraft = useRef(false);
    // On mount, prompt to restore draft if it exists
    useEffect(() => {
      if (typeof window === 'undefined' || hasRestoredDraft.current) return;
      setTimeout(() => {
        if (hasRestoredDraft.current) return;
        const draft = localStorage.getItem('draft');
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            if (parsed && Array.isArray(parsed.textSets) && parsed.textSets.length > 0) {
              if (window.confirm('A saved draft was found. Restore it?')) {
                setTextSets(parsed.textSets);
                if (parsed.uploadedImageBase64) {
                  setSelectedImage(parsed.uploadedImageBase64);
                  setUploadedImageBase64(parsed.uploadedImageBase64);
                  setupImage(parsed.uploadedImageBase64);
                } else if (parsed.selectedImage) {
                  setSelectedImage(parsed.selectedImage);
                  setupImage(parsed.selectedImage);
                }
              }
            }
          } catch {}
        }
        hasRestoredDraft.current = true;
      }, 0);
    }, []);

    const [isPayDialogOpen, setIsPayDialogOpen] = useState<boolean>(false); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const getCurrentUser = async (userId: string) => {
        try {
            const { data: profile, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', userId)

            if (error) {
                throw error;
            }

            if (profile) {
                setCurrentUser(profile[0]);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleUploadImage = () => {
        if (!user) {
            // Allow non-authenticated users to try the app
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        } else if (currentUser && (currentUser.images_generated < 2 || currentUser.paid)) {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        } else {
            alert("You have reached the limit of free generations.");
            setIsPayDialogOpen(true);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            // Convert file to base64 for persistent restore
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target?.result as string;
                setUploadedImageBase64(base64);
                await setupImage(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const setupImage = async (imageUrl: string) => {
        try {
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);

            if (currentUser) {
                await supabaseClient
                    .from('profiles')
                    .update({ images_generated: currentUser.images_generated + 1 })
                    .eq('id', currentUser.id) 
                    .select();
            }
            
            const img = new window.Image();
            img.src = imageUrl;
            img.onload = () => {
                setNaturalSize(img.width, img.height);
            };
        } catch (error) {
            console.error(error);
        }
    };

    const addNewTextSet = () => {
        if (!isUndoRedoRef.current) {
            setPastTextSets(past => [...past, textSets]);
            setFutureTextSets([]);
        } else {
            isUndoRedoRef.current = false;
        }
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: 'Text',
            fontFamily: 'Inter',
            xPct: 0,
            yPct: 50,
            color: 'white',
            fontSizePct: 10,
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0,
            tiltX: 0,
            tiltY: 0,
            letterSpacing: 0
        }]);
    };

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        if (!isUndoRedoRef.current) {
            setPastTextSets(past => [...past, textSets]);
            setFutureTextSets([]);
        } else {
            isUndoRedoRef.current = false;
        }
        setTextSets(prev => prev.map(set => 
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    };

    const duplicateTextSet = (textSet: any) => {
        if (!isUndoRedoRef.current) {
            setPastTextSets(past => [...past, textSets]);
            setFutureTextSets([]);
        } else {
            isUndoRedoRef.current = false;
        }
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    const removeTextSet = (id: number) => {
        if (!isUndoRedoRef.current) {
            setPastTextSets(past => [...past, textSets]);
            setFutureTextSets([]);
        } else {
            isUndoRedoRef.current = false;
        }
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    const saveCompositeImage = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
        // Set natural size in imageMeta
        setNaturalSize(bgImg.width, bgImg.height);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = bgImg.width * dpr;
        canvas.height = bgImg.height * dpr;
        canvas.style.width = `${bgImg.width}px`;
        canvas.style.height = `${bgImg.height}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any existing transforms
        ctx.scale(dpr, dpr);

        ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height);

        textSets.forEach(textSet => {
            ctx.save();

            // Convert percent font size to px (relative to image height)
            const fontSizePx = pctToPx('y', textSet.fontSizePct || 10);
            ctx.font = `${textSet.fontWeight} ${fontSizePx}px ${textSet.fontFamily}`;
            ctx.fillStyle = textSet.color;
            ctx.globalAlpha = textSet.opacity;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.letterSpacing = `${textSet.letterSpacing}px`;

            // Convert percent coordinates to px
            const x = pctToPx('x', textSet.xPct || 0) + canvas.width / 2;
            const y = canvas.height / 2 - pctToPx('y', textSet.yPct || 0);

            ctx.translate(x, y);

            // Apply 3D transforms
            const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
            const tiltYRad = (-textSet.tiltY * Math.PI) / 180;
            ctx.transform(
                Math.cos(tiltYRad),
                Math.sin(0),
                -Math.sin(0),
                Math.cos(tiltXRad),
                0,
                0
            );
            ctx.rotate((textSet.rotation * Math.PI) / 180);

            if (textSet.letterSpacing === 0) {
                ctx.fillText(textSet.text, 0, 0);
            } else {
                const chars = textSet.text.split('');
                let currentX = 0;
                const totalWidth = chars.reduce((width, char, i) => {
                    const charWidth = ctx.measureText(char).width;
                    return width + charWidth + (i < chars.length - 1 ? textSet.letterSpacing : 0);
                }, 0);
                currentX = -totalWidth / 2;
                chars.forEach((char, i) => {
                    const charWidth = ctx.measureText(char).width;
                    ctx.fillText(char, currentX + charWidth / 2, 0);
                    currentX += charWidth + textSet.letterSpacing;
                });
            }
            ctx.restore();
        });

        if (removedBgImageUrl) {
            const removedBgImg = new (window as any).Image();
            removedBgImg.crossOrigin = "anonymous";
            removedBgImg.onload = () => {
                ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
                triggerDownload();
            };
            removedBgImg.src = removedBgImageUrl;
        } else {
            triggerDownload();
        }
    };
    bgImg.src = selectedImage || '';

    function triggerDownload() {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'text-behind-image.png';
        link.href = dataUrl;
        link.click();
    }
};

    useEffect(() => {
      if (user?.id) {
        getCurrentUser(user.id)
      }
    }, [user])
    
    // Undo/Redo keyboard handlers
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrl = isMac ? e.metaKey : e.ctrlKey;
        if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
          // Undo
          if (pastTextSets.length > 0) {
            setFutureTextSets(future => [textSets, ...future]);
            setTextSets(pastTextSets[pastTextSets.length - 1]);
            setPastTextSets(past => past.slice(0, -1));
            setAriaAnnouncement('Undo');
          }
          e.preventDefault();
        } else if (ctrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
          // Redo
          if (futureTextSets.length > 0) {
            setPastTextSets(past => [...past, textSets]);
            setTextSets(futureTextSets[0]);
            setFutureTextSets(future => future.slice(1));
            setAriaAnnouncement('Redo');
          }
          e.preventDefault();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pastTextSets, futureTextSets, textSets]);

    // Undo/Redo UI button handlers
    const handleUndo = () => {
      if (pastTextSets.length > 0) {
        isUndoRedoRef.current = true;
        setFutureTextSets(future => [textSets, ...future]);
        setTextSets(pastTextSets[pastTextSets.length - 1]);
        setPastTextSets(past => past.slice(0, -1));
        setAriaAnnouncement('Undo');
      }
    };
    const handleRedo = () => {
      if (futureTextSets.length > 0) {
        isUndoRedoRef.current = true;
        setPastTextSets(past => [...past, textSets]);
        setTextSets(futureTextSets[0]);
        setFutureTextSets(future => future.slice(1));
        setAriaAnnouncement('Redo');
      }
    };

    // Only push undo checkpoint if textSets differs from last stack entry
    const pushUndoCheckpoint = () => {
      const last = pastTextSets[pastTextSets.length - 1];
      if (!last || JSON.stringify(last) !== JSON.stringify(textSets)) {
        setPastTextSets(past => [...past, textSets]);
        setFutureTextSets([]);
      }
    };

    return ( 
        <>
            <div aria-live="polite" style={{position:'absolute',left:'-9999px',height:0,width:0,overflow:'hidden'}}>{ariaAnnouncement}</div>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1609710199882100" crossOrigin="anonymous"></script>
                <div className='flex flex-col h-screen'>
                    <header className='flex flex-row items-center justify-between p-5 px-3 md:px-10'>
                        <h2 className="text-xl md:text-xl font-semibold tracking-tight">
                            <span className="block md:hidden">Text Underlay</span>
                            <span className="hidden md:block">Text Underlay</span>
                        </h2>
                        <div className='flex flex-row items-center gap-2'>
                            {user && session && session.user && currentUser ? (
                                <>
                                    <Button variant='outline' size='icon' onClick={handleUndo} aria-label="Undo" disabled={pastTextSets.length === 0}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h7a4 4 0 1 1 0 8h-1"/></svg>
                                    </Button>
                                    <Button variant='outline' size='icon' onClick={handleRedo} aria-label="Redo" disabled={futureTextSets.length === 0}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 14l5-5-5-5"/><path d="M20 9h-7a4 4 0 1 0 0 8h1"/></svg>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        accept=".jpg, .jpeg, .png"
                                    />
                                    <div className='flex items-center gap-5'>
                                        <div className='hidden md:block font-semibold'>
                                            {currentUser.paid ? (
                                                <p className='text-sm'>
                                                </p>
                                            ) : (
                                                <div className='flex items-center gap-2'>
                                                    <p className='text-sm'>
                                                        {2 - (currentUser.images_generated)} generations left
                                                    </p>
                                                    <Button 
                                                        variant="link" 
                                                        className="p-0 h-auto text-sm text-primary hover:underline"
                                                        onClick={() => setIsPayDialogOpen(true)}
                                                    >
                                                        Upgrade
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex gap-2'>
                                            <Button
                                                onClick={handleUploadImage}
                                                variant="secondary"
                                            >
                                                Upload image
                                            </Button>
                                            {selectedImage && (
                                                <Button onClick={saveCompositeImage} className='hidden md:flex'>
                                                    Save image
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={currentUser?.avatar_url} /> 
                                                <AvatarFallback>{currentUser?.full_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{currentUser?.full_name}</p>
                                                    <p className="text-xs font-normal leading-none text-muted-foreground">{user?.user_metadata.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setIsPayDialogOpen(true)}>
                                                <button>{currentUser?.paid ? 'View Plan' : 'Upgrade to Pro'}</button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                                                            ) : (
                                    <div className='flex items-center gap-2'>
                                        <Button
                                            onClick={() => setIsPayDialogOpen(true)}
                                            variant="outline"
                                            className="hidden md:flex"
                                        >
                                            Upgrade
                                        </Button>
                                        <LoginButton />
                                    </div>
                                )}
                            <ModeToggle />
                        </div>
                    </header>
                                        <Separator /> 
                    {selectedImage ? (
                        <div className='flex-1 flex flex-col md:flex-row gap-4 md:gap-8 overflow-hidden w-full h-full px-2 md:px-8 py-2'>
                            {/* Image Preview + Controls wrapper */}
                            <div className='flex flex-1 flex-col md:flex-row gap-4 w-full h-full'>
                             
                                {/* Controls Section */}
                                <div className='w-full md:w-[420px] max-w-full flex flex-col overflow-y-auto h-full pr-1 md:hidden'>
                                    <button
                                        onClick={saveCompositeImage}
                                        className="fixed z-50 md:hidden bottom-4 right-4 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary border border-gray-200 dark:bg-neutral-800 dark:border-gray-500 dark:shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                                        aria-label="Save image"
                                        style={{ bottom: 16, right: 16 }}
                                    >
                                        {/* Download Icon SVG */}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14" />
                                            <path d="M19 12l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className='block md:hidden'>
                                        {user && currentUser?.paid ? (
                                            <p className='text-sm'>

                                            </p>
                                        ) : (
                                            <div className='flex items-center gap-5'>
                                                <p className='text-sm'>
                                                    {user && currentUser ? `${2 - (currentUser.images_generated)} generations left` : 'Login to start creating'}
                                                </p>
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 h-auto text-sm text-primary hover:underline"
                                                    onClick={() => setIsPayDialogOpen(true)}
                                                >
                                                    Upgrade
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
    ref={previewRef}
    className="min-h-[400px] w-full p-4 border border-border rounded-lg relative overflow-hidden"
>
    {isImageSetupDone ? (
        <Image
            src={selectedImage}
            alt="Uploaded"
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            onLoadingComplete={img => {
                setNaturalSize(img.naturalWidth, img.naturalHeight);
            }}
        />
    ) : (
        <span className='flex items-center w-full gap-2'><ReloadIcon className='animate-spin' /> Loading, please wait</span>
    )}
    {isImageSetupDone && textSets.map(textSet => {
        const previewWidth = previewRef.current?.clientWidth || 1;
        const previewHeight = previewRef.current?.clientHeight || 1;
        const pxToPxPreview = (axis: 'x' | 'y', pct: number) => {
            if (axis === 'x') return (pct / 100) * previewWidth;
            if (axis === 'y') return (pct / 100) * previewHeight;
            return 0;
        };
        const previewTop = `calc(50% - ${pxToPxPreview('y', textSet.yPct || 0)}px)`;
        const previewLeft = `calc(50% + ${pxToPxPreview('x', textSet.xPct || 0)}px)`;
        const previewFontSize = `${pxToPxPreview('y', textSet.fontSizePct || 10)}px`;
        return (
            <div
                key={textSet.id}
                style={{
                    position: 'absolute',
                    top: previewTop,
                    left: previewLeft,
                    transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg) perspective(1000px) rotateX(${textSet.tiltX}deg) rotateY(${textSet.tiltY}deg)`,
                    color: textSet.color,
                    textAlign: 'center',
                    fontSize: previewFontSize,
                    fontWeight: textSet.fontWeight,
                    fontFamily: textSet.fontFamily,
                    opacity: textSet.opacity,
                    letterSpacing: `${textSet.letterSpacing}px`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {textSet.text}
            </div>
        );
    })}

                                    {removedBgImageUrl && (
                                        <Image
                                            src={removedBgImageUrl}
                                            alt="Removed bg"
                                            layout="fill"
                                            objectFit="contain" 
                                            objectPosition="center" 
                                            className="absolute top-0 left-0 w-full h-full"
                                        /> 
                                    )}
                                </div>
    
                            </div>
                            <div className='flex flex-col w-full md:w-1/2'>
                                <Button variant="secondary" onClick={addNewTextSet}><PlusIcon className='mr-2'/> Add New Text Set</Button>
                                <ScrollArea className="h-[calc(100vh-10rem)] p-2">
                                    <Accordion type="single" collapsible className="w-full mt-2">
                                        {textSets.map(textSet => (
                                            <TextCustomizer 
                                                key={textSet.id}
                                                textSet={textSet}
                                                handleAttributeChange={handleAttributeChange}
                                                removeTextSet={removeTextSet}
                                                duplicateTextSet={duplicateTextSet}
                                                userId={user && currentUser?.id ? currentUser.id : 'anonymous'}
                                                pushUndoCheckpoint={pushUndoCheckpoint}
                                            />
                                        ))}
                                    </Accordion>
                                </ScrollArea>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center min-h-screen w-full'>
                            <div className='text-center space-y-4'>
                                <h2 className="text-xl font-semibold">Welcome to Text Underlay!</h2>
                                <p className="text-muted-foreground">Upload an image to get started creating stunning text-underlay designs.</p>
                                {!user && (
                                    <div className='flex flex-col items-center gap-2'>
                                        <p className="text-sm text-muted-foreground">Login to save your work and access premium features</p>
                                        <LoginButton />
                                    </div>
                                )}
                            </div>
                        </div>
                    )} 
                    {user && currentUser && (
                        <PayDialog userDetails={currentUser as any} userEmail={user.user_metadata.email} isOpen={isPayDialogOpen} onClose={() => setIsPayDialogOpen(false)} />
                    )}
                </div>
        </>
    );
}

export default Page;