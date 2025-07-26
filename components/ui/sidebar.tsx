"use client";
import React, { useState, useEffect } from 'react';
import { 
  HambergerMenu,
  CloseSquare,
  ArrowLeft2,
  ArrowRight2,
  DocumentUpload,
  DocumentDownload,
  Setting2,
  User,
  Logout,
  Sun1,
  Moon
} from 'iconsax-react';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { ModeToggle } from '@/components/mode-toggle';
import LoginButton from '@/components/login-button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { News, type NewsArticle } from '@/components/ui/sidebar-news';

interface SidebarProps {
  className?: string;
  onUploadImage: () => void;
  onSaveImage: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasImage: boolean;
  user: any;
  currentUser: any;
  onPayDialogOpen: () => void;
}

export function Sidebar({ 
  className = "", 
  onUploadImage, 
  onSaveImage, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  hasImage,
  user,
  currentUser,
  onPayDialogOpen
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const supabase = useSupabaseClient();

  // Demo news articles
  const DEMO_ARTICLES: NewsArticle[] = Array.from({ length: 10 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: `Feature Announcement ${i + 1}`,
    summary: `Discover the latest updates and improvements in version 1.${i + 1}.0. We've been working hard to bring you new features.`,
    image: `https://picsum.photos/400/300?random=${i}`,
  }));

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <CloseSquare size="20" className="text-slate-600 dark:text-gray-300" /> : 
          <HambergerMenu size="20" className="text-slate-600 dark:text-gray-300" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-700 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-80"}
          md:translate-x-0 md:static md:z-auto
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-gray-700 bg-slate-50/60 dark:bg-gray-800/60">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-white text-base">Text Underlay</span>
                <span className="text-xs text-slate-500 dark:text-gray-400">Built by</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <span className="text-white font-bold text-base">T</span>
            </div>
          )}

          {/* Theme toggle button */}
          <ModeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-2">
            {/* Undo/Redo Controls */}
            <li className="flex gap-2">
              <Button 
                variant='outline' 
                size='icon' 
                onClick={onUndo} 
                disabled={!canUndo}
                className="flex-1"
                title="Undo"
              >
                <ArrowLeft2 size="16" />
              </Button>
              <Button 
                variant='outline' 
                size='icon' 
                onClick={onRedo} 
                disabled={!canRedo}
                className="flex-1"
                title="Redo"
              >
                <ArrowRight2 size="16" />
              </Button>
            </li>

            {/* User Status */}
            {user && currentUser && (
              <li className="px-3 py-2">
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  {currentUser.paid ? (
                    <p className="text-sm">Pro Plan</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        {2 - (currentUser.images_generated)} generations left
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm text-primary hover:underline"
                        onClick={onPayDialogOpen}
                      >
                        Upgrade
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            )}

            {/* Upload Button */}
            <li>
              <Button
                onClick={onUploadImage}
                variant="secondary"
                className="w-full gap-2"
              >
                <DocumentUpload size="16" />
                {!isCollapsed && "Upload image"}
              </Button>
            </li>

            {/* Save Button */}
            {hasImage && (
              <li>
                <Button 
                  onClick={onSaveImage} 
                  className="w-full gap-2"
                >
                  <DocumentDownload size="16" />
                  {!isCollapsed && "Save image"}
                </Button>
              </li>
            )}

          </ul>
        </nav>

        {/* News Section */}
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <News articles={DEMO_ARTICLES} />
          </div>
        )}

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-slate-200 dark:border-gray-700">
          {user && currentUser ? (
            <>
              {/* Profile Section */}
              <div className={`border-b border-slate-200 dark:border-gray-700 bg-slate-50/30 dark:bg-gray-800/30 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
                {!isCollapsed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center px-3 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={currentUser?.avatar_url} /> 
                          <AvatarFallback>{currentUser?.full_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 ml-2.5">
                          <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{currentUser?.full_name}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user?.user_metadata.email}</p>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{currentUser?.full_name}</p>
                          <p className="text-xs font-normal leading-none text-muted-foreground">{user?.user_metadata.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onPayDialogOpen}>
                        <button>{currentUser?.paid ? 'View Plan' : 'Upgrade to Pro'}</button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex justify-center">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={currentUser?.avatar_url} /> 
                      <AvatarFallback>{currentUser?.full_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div className="p-3">
                <Button
                  variant="outline"
                  className={`w-full gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 ${isCollapsed ? "justify-center p-2" : ""}`}
                  onClick={handleLogout}
                >
                  <Logout size="16" />
                  {!isCollapsed && "Logout"}
                </Button>
              </div>
            </>
          ) : (
            /* Login Section for non-authenticated users */
            <div className="p-3">
              <div className={`flex items-center justify-center ${isCollapsed ? "justify-center" : ""}`}>
                <LoginButton />
              </div>
            </div>
          )}
        </div>
      </div>


    </>
  );
} 