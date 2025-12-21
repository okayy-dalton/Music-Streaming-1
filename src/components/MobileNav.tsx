"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Music, PlayCircle, Download, Heart, Menu, X, TrendingUp, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Discover', icon: Music, href: '/discover' },
    { name: 'Playlists', icon: PlayCircle, href: '/playlists' },
    { name: 'Downloads', icon: Download, href: '/downloads' },
    { name: 'Favorites', icon: Heart, href: '/favorites' },
    { name: 'Trending', icon: TrendingUp, href: '/trending' },
    { name: 'Radio', icon: Radio, href: '/radio' },
  ];

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-40">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-white">
          MusicStream
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-gray-900 border-gray-800 p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">MusicStream</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)} 
                className="text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start mb-1 text-white"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link to={item.href}>
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;