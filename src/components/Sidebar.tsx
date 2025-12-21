"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Music, 
  PlayCircle, 
  Download, 
  Heart, 
  Search,
  Library,
  Radio,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Discover', icon: Music, href: '/discover' },
    { name: 'Playlists', icon: PlayCircle, href: '/playlists' },
    { name: 'Downloads', icon: Download, href: '/downloads' },
    { name: 'Favorites', icon: Heart, href: '/favorites' },
    { name: 'Trending', icon: TrendingUp, href: '/trending' },
    { name: 'Radio', icon: Radio, href: '/radio' },
  ];

  const libraryItems = [
    { name: 'Recently Added', icon: Library, href: '/recent' },
    { name: 'Artists', icon: Library, href: '/artists' },
    { name: 'Albums', icon: Library, href: '/albums' },
    { name: 'Genres', icon: Library, href: '/genres' },
  ];

  return (
    <div className="hidden md:flex md:w-64 lg:w-72 flex-col bg-gray-900 border-r border-gray-800 h-screen fixed top-0 left-0 z-30">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">MusicStream</h1>
        <p className="text-gray-400 text-sm mt-1">Discover new music</p>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main
          </h2>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start mb-1"
                asChild
              >
                <Link to={item.href}>
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>

        <div className="space-y-1 mt-6">
          <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Library
          </h2>
          {libraryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start mb-1"
                asChild
              >
                <Link to={item.href}>
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;