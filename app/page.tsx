'use client';

import React from 'react';
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { HeroImages } from '@/components/hero-images';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import { AdditionalInfo } from '@/components/additional-info';
import Link from 'next/link';


const page = () => {
    return ( 
        <div className='flex flex-col min-h-screen items-center w-full'>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1609710199882100" crossOrigin="anonymous"></script>

            <HeroHighlight>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: [20, -5, 0] }} 
                    transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                    className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black dark:text-white"
                >
                    Create {" "}
                    <Highlight className='text-white'>
                        text-underlay
                    </Highlight>
                    {" "} designs easily
                </motion.h1>
            </HeroHighlight>
            
            <div className="text-lg text-center font-semibold mb-4">
                300,000+ text underlays created
            </div>

            <Link href={'/app'} className="mb-10 block">
  <ShimmerButton className="w-full md:w-auto text-lg font-semibold px-8 py-3 rounded-full">
    Open the app
  </ShimmerButton>
</Link>

            <div className='w-full h-full mt-2'>
                <HeroImages />
                <HeroParallaxImages />
            </div>
            <div className="flex flex-col items-center justify-center my-10">
                <AdditionalInfo />
                <div className='text-2xl mt-10'>
                    2024 @ <Link href={'https://www.rexanwong.xyz'} target="_blank" rel="noopener noreferrer" className='hover:font-bold'>rexanwong.xyz</Link> - All Rights Reserved - Created by Rexan Wong
                </div> 
            </div>
        </div>
    );
}

export default page;