// Demo file for Hugeicons setup
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';

export const HugeiconsDemo = () => (
  <div className="flex flex-col items-center gap-2 p-4">
    <HugeiconsIcon icon={SearchIcon} size={48} color="#0D78F2" />
    <span className="text-base">Hugeicons is working!</span>
  </div>
);

export default HugeiconsDemo;
