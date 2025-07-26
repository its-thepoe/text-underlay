"use client";

import { useEffect } from "react";
import { TypeWriter, ShineBorder, renderCanvas } from "./ui/hero";
import { Button } from "./ui/button";

export function HeroSection() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black">
      {/* Canvas Background */}
      <canvas
        id="canvas"
        className="fixed inset-0 pointer-events-none z-0"
        style={{ width: "100vw", height: "100vh" }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-tight">
            Create{" "}
            <span className="bg-black text-white px-2 py-1 rounded">
              text-underlay
            </span>{" "}
            designs easily
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            300,000+ text underlays created
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center">
            <ShineBorder
              borderRadius={12}
              borderWidth={2}
              duration={3}
              color={["#000000", "#ffffff"]}
              className="w-fit"
            >
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Open the app
              </Button>
            </ShineBorder>
          </div>
        </div>
      </div>
    </div>
  );
} 