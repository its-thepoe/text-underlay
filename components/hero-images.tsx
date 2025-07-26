"use client";
import React from "react";
import { LayoutGrid } from "./ui/layout-grid";



export function HeroImages() {
  return (
    <div className="h-screen w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: "/pov.png"
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "/ride.png"
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "/goats.png"
  },
  
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: "/sf.png"
  },
];