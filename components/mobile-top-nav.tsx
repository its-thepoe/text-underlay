import React from 'react';
import { Button } from '@/components/ui/button';


import { HambergerMenu, CloseSquare } from 'iconsax-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface MobileTopNavProps {
  user: any;
  currentUser: any;
  hasImage: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onUploadImage: () => void;
  onSaveImage: () => void;
  onPayDialogOpen: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function MobileTopNav({
  user,
  currentUser,
  hasImage,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onUploadImage,
  onSaveImage,
  onPayDialogOpen,
  isSidebarOpen,
  onToggleSidebar
}: MobileTopNavProps) {
  const supabaseClient = useSupabaseClient();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 px-4 py-3">
      <div className="flex items-center justify-start gap-4">
        {/* Left side - Sidebar trigger, app title and undo/redo */}
        <div className="flex items-center gap-3">
          {/* Sidebar trigger */}
          <button
            onClick={onToggleSidebar}
            className="py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ease-out"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? 
              <CloseSquare size="20" className="text-slate-600 dark:text-gray-300" /> : 
              <HambergerMenu size="20" className="text-slate-600 dark:text-gray-300" />
            }
          </button>
          
          <h1 className="font-semibold text-slate-800 dark:text-white text-base">Text Underlay</h1>
          
          {/* Undo/Redo buttons */}
          {hasImage && (
            <div className="flex gap-1">
              <Button 
                variant='outline' 
                size='icon' 
                onClick={onUndo} 
                disabled={!canUndo}
                className="h-8 w-8"
                title="Undo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.13 18.31h8c2.76 0 5-2.24 5-5s-2.24-5-5-5h-11"/>
                  <path d="M6.43 10.81 3.87 8.25l2.56-2.56"/>
                </svg>
              </Button>
              <Button 
                variant='outline' 
                size='icon' 
                onClick={onRedo} 
                disabled={!canRedo}
                className="h-8 w-8"
                title="Redo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.87 18.31h-8c-2.76 0-5-2.24-5-5s2.24-5 5-5h11"/>
                  <path d="M17.57 10.81 20.13 8.25l-2.56-2.56"/>
                </svg>
              </Button>
            </div>
          )}
        </div>

        {/* Right side - Actions and user */}
        <div className="flex items-center gap-2">
          {/* Upload button */}
          <Button
            onClick={onUploadImage}
            variant="secondary"
            size="sm"
            className="h-8 px-3"
          >
            Upload
          </Button>

          {/* Save button */}
          {hasImage && (
            <Button
              onClick={onSaveImage}
              size="sm"
              className="h-8 px-3"
            >
              Save
            </Button>
          )}

          {/* User status/actions */}
          {user && currentUser ? (
            <div className="flex items-center gap-2">
              {/* Usage info */}
              {!currentUser.paid && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {2 - (currentUser.images_generated)} {2 - (currentUser.images_generated) === 1 ? 'gen' : 'gens'} left
                </div>
              )}
            </div>
          ) : null}


        </div>
      </div>
    </div>
  );
} 