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
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

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
        className="fixed top-6 left-6 z-[50] p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200 ease-out dark:bg-gray-800 dark:border-gray-700"
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden transition-opacity duration-200 ease-out" 
          onClick={toggleSidebar}
          role="button"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 z-[45] transition-all duration-200 ease-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-80"}
          md:translate-x-0 md:static md:z-auto
          ${className}
        `}
        role="navigation"
        aria-label="Application Sidebar"
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between pl-5 py-5" role="banner" aria-label="Sidebar Header">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5" role="region" aria-label="App Logo">
              <div className="flex flex-col" role="region" aria-label="App Title">
                <span className="font-semibold text-slate-800 dark:text-white text-base">Text Underlay</span>
    
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mx-auto shadow-sm" role="region" aria-label="Collapsed App Logo">
              <span className="text-white font-bold text-base">T</span>
            </div>
          )}

          {/* Theme toggle button */}
          <ModeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 pl-3 py-2 overflow-y-auto" role="navigation" aria-label="Sidebar Navigation">
          <ul className="space-y-2" role="list" aria-label="Navigation Items">
            {/* Undo/Redo Controls */}
            {hasImage && (
              <li className="flex gap-2" role="listitem" aria-label="Undo Redo Controls">
                <Button 
                  variant='outline' 
                  size='icon' 
                  onClick={onUndo} 
                  disabled={!canUndo}
                  className="flex-1"
                  title="Undo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.13 18.31h8c2.76 0 5-2.24 5-5s-2.24-5-5-5h-11"/>
                    <path d="M6.43 10.81 3.87 8.25l2.56-2.56"/>
                  </svg>
                </Button>
                <Button 
                  variant='outline' 
                  size='icon' 
                  onClick={onRedo} 
                  disabled={!canRedo}
                  className="flex-1"
                  title="Redo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16.87 18.31h-8c-2.76 0-5-2.24-5-5s2.24-5 5-5h11"/>
                    <path d="M17.57 10.81 20.13 8.25l-2.56-2.56"/>
                  </svg>
                </Button>
              </li>
            )}

            {/* User Status */}
            {user && currentUser && (
              <li className="py-2" role="listitem" aria-label="User Status">
                <div className="text-sm text-slate-600 dark:text-gray-400" role="region" aria-label="User Plan Status">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.paid ? (
                    <p className="text-sm">Pro Plan</p>
                  ) : (
                    <div className="flex items-center gap-2" role="region" aria-label="Usage Limit">
                                              <p className="text-sm">
                          {2 - (currentUser.images_generated)} {2 - (currentUser.images_generated) === 1 ? 'generation' : 'generations'} left
                        </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm text-blue-600 hover:underline"
                        onClick={onPayDialogOpen}
                      >
                        Upgrade
                      </Button>
                    </div>
                  )}
                </p>
                </div>
              </li>
            )}

            {/* Upload Button */}
            <li role="listitem" aria-label="Upload Image Button">
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
              <li role="listitem" aria-label="Save Image Button">
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
          <div className="flex-1 overflow-hidden mt-6 border-t border-gray-200 dark:border-gray-700 pt-4" role="region" aria-label="News Feed">
            <News articles={DEMO_ARTICLES} />
          </div>
        )}

        {/* Bottom section with profile and logout */}
        <div className="mt-auto" role="region" aria-label="User Profile Section">
          {user && currentUser ? (
                          <>
                {/* Profile Section */}
                <div className={`  ${isCollapsed ? 'py-3 pl-2' : 'pl-3 py-3'}`} role="region" aria-label="User Profile">
                  {!isCollapsed ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center px-3 py-2 rounded-md bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors duration-200 ease cursor-pointer" role="button" aria-label="User Profile Menu">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/dipo-avatar.jpg" /> 
                            <AvatarFallback>{currentUser?.full_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 ml-2.5" role="region" aria-label="User Info">
                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{currentUser?.full_name}</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user?.user_metadata.email}</p>
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{currentUser?.full_name}</p>
                          <p className="text-xs font-normal leading-none text-gray-500 dark:text-gray-400">{user?.user_metadata.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onPayDialogOpen}>
                        <button>{currentUser?.paid ? 'View Plan' : 'Upgrade to Pro'}</button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                                  ) : (
                    <div className="flex justify-center" role="region" aria-label="Collapsed User Avatar">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src="public/dipo-avatar.png" /> 
                        <AvatarFallback>{currentUser?.full_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <div className="pl-3 py-3" role="region" aria-label="Logout Section">
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
              <div className="py-3 pl-3" role="region" aria-label="Login Section">
                <div className={`flex items-center justify-center ${isCollapsed ? "justify-center" : ""}`} role="region" aria-label="Login Button Container">
                  <LoginButton />
                </div>
              </div>
            )}
            
            {/* Built by section */}
            <div className="py-3 pl-3" role="region" aria-label="Developer Credits">
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-gray-400" role="region" aria-label="Credits Content">
                <div className="flex items-center" role="region" aria-label="Developer Info">
                  <span className="mr-1">Built by</span>
                  {isCollapsed ? (
                    <div className="flex items-center" role="region" aria-label="Collapsed Developer Avatar">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Avatar className="ml-1 h-5 w-5 cursor-pointer">
                            <AvatarImage src="/images/avatar.jpg" alt="Dipo" />
                            <AvatarFallback>DA</AvatarFallback>
                          </Avatar>
                        </PopoverTrigger>
                        <PopoverContent align="center" className="w-60 p-3">
                          <div className="flex justify-between space-x-4" role="region" aria-label="Developer Details">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/images/avatar.jpg" alt="Dipo" />
                              <AvatarFallback>DA</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1" role="region" aria-label="Developer Contact">
                              <h4 className="text-sm font-semibold">Dipo</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Design Engineer
                              </p>
                              <div className="flex items-center pt-1">
                                <a
                                  href="mailto:hi@thepoe.xyz"
                                  className="text-xs text-gray-500 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  hi@thepoe.xyz
                                  <ArrowUpRight className="w-3 h-3 inline-block" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <HoverCard openDelay={0} closeDelay={0}>
                      <HoverCardTrigger asChild>
                        <Avatar className="ml-1 h-5 w-5 cursor-pointer">
                          <AvatarImage src="/images/avatar.jpg" alt="Dipo" />
                          <AvatarFallback>DA</AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent align="end" className="w-60 p-3">
                        <div className="flex justify-between space-x-4" role="region" aria-label="Developer Details">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/images/avatar.jpg" alt="Dipo" />
                            <AvatarFallback>DA</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex-1" role="region" aria-label="Developer Contact">
                            <h4 className="text-sm font-semibold">Dipo</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Design Engineer
                            </p>
                            <div className="flex items-center pt-1">
                              <a
                                href="mailto:hi@thepoe.xyz"
                                className="text-xs text-gray-500 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                hi@thepoe.xyz
                                <ArrowUpRight className="w-3 h-3 inline-block" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
                <span className="flex items-center justify-center w-1 h-1 rounded-full bg-slate-500 dark:bg-gray-400">•</span>
                <a 
                  href="https://github.com/its-thepoe/text-underlay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-gray-300 transition-colors duration-200 ease"
                >
                  GitHub
                </a>
              </div>
            </div>
        </div>
      </div>


    </>
  );
} 