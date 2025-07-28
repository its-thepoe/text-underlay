import React from "react";
import { cn } from "@/lib/utils";

interface LoaderFiveProps {
  text?: string;
  className?: string;
}

export const LoaderFive: React.FC<LoaderFiveProps> = ({ 
  text = "Loading, please wait", 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div className="relative">
        <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-6 h-6 border-2 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      </div>
      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
        {text}
      </span>
    </div>
  );
}; 