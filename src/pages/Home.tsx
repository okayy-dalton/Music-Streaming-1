"use client";

import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Play, Pause, Heart, Clock, TrendingUp, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MadeWithDyad } from '@/components/made-with-dyad';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { showSuccess } from '@/utils/toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string[];
  url: string;
  coverArt: string;
  isFavorite: boolean;
  playCount: number;
  lastPlayed?: Date;
}

const Home = () => {
  // Mock data for tracks
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'Ocean View',
      album: 'Beach Days',
      duration: 213,
      genre: ['Pop', 'Chill'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      isFavorite: true,
      playCount: 42
    },
    {
      id: '2',
      title: 'Midnight Drive',
      artist: 'Neon Lights',
      album: 'City Nights',
      duration: 198,
      genre: ['Electronic', 'Synthwave'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      isFavorite: true,
      playCount: 38
    },
    {
      id: '3',
      title: 'Mountain High',
      artist: 'Wilderness',
      album: 'Nature Calls',
      duration: 245,
      genre: ['Folk', 'Acoustic'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300',
      isFavorite: false,
      playCount: 27
    },
    {
      id: '4',
      title: 'Urban Jungle',
      artist: 'Concrete Dreams',
      album: 'Metropolis',
      duration: 187,
      genre: ['Hip Hop', 'Rap'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      isFavorite: true,
      playCount: 56
    },
    {
      id: '5',
      title: 'Desert Wind',
      artist: 'Sandy Dunes',
      album: 'Oasis',
      duration: 267,
      genre: ['World', 'Ambient'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      coverArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300',
      isFavorite: false,
      playCount: 19
    },
    {
      id: '6',
      title: 'Rock Anthem',
      artist: 'Thunder Bay',
      album: 'Electric Storm',
      duration: 234,
      genre: ['Rock', 'Alternative'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      isFavorite: true,
      playCount: 33
    },
    {
      id: '7',
      title: 'Jazz Evening',
      artist: 'Smooth Operators',
      album: 'Night Sessions',
      duration: 298,
      genre: ['Jazz', 'Smooth'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      isFavorite: true,
      playCount: 45
    },
    {
      id: '8',
      title: 'Country Roads',
      artist: 'Prairie Winds',
      album: 'Open Fields',
      duration: 212,
      genre: ['Country', 'Folk'],
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300',
      isFavorite: false,
      playCount: 15
    }
  ];

  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [sound]);

  const playTrack = (track: Track) => {
    // Stop current track if playing
    if (sound) {
      sound.stop();
    }

    // Create new sound instance
    const newSound = new Howl({
      src: [track.url],
      onplay: () => {
        setIsPlaying(true);
        setCurrentTrack(track);
        showSuccess(`Now playing: ${track.title}`);
      },
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    });

    setSound(newSound);
    newSound.play();
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
      } else {
        sound.play();
        setIsPlaying(true);
      }
    }
  };

  const stopTrack = () => {
    if (sound) {
      sound.stop();
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const toggleFavorite = (trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, isFavorite: !track.isFavorite } 
        : track
    ));
  };

  // Get favorite tracks
  const favoriteTracks = tracks.filter(track => track.isFavorite);
  
  // Get recently played tracks (mocked as last 4 played)
  const recentlyPlayed = [...tracks]
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 4);
  
  // Get trending tracks (mocked as most played)
  const trendingTracks = [...tracks]
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 6);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <MobileNav />
      
      <div className="md:ml-64 lg:ml-72 pb-24">
        <div className="container mx-auto px-4 pt-20 md:pt-8 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Good evening</h1>
            <p className="text-gray-400">Your personalized music dashboard</p>
          </header>

          {/* Quick Picks Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Heart className="mr-2 text-red-500" /> Quick Picks
              </h2>
              <Button variant="link" className="text-gray-400 hover:text-white">
                See all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTracks.slice(0, 6).map((track) => (
                <Card 
                  key={track.id} 
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group"
                >
                  <CardContent className="p-4 flex items-center">
                    <img 
                      src={track.coverArt} 
                      alt={track.title} 
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold truncate">{track.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => playTrack(track)}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recently Played Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Clock className="mr-2 text-blue-500" /> Recently Played
              </h2>
              <Button variant="link" className="text-gray-400 hover:text-white">
                See all
              </Button>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {recentlyPlayed.map((track, index) => (
                <div 
                  key={track.id} 
                  className="flex items-center p-3 hover:bg-gray-750 transition-colors group"
                >
                  <span className="text-gray-500 w-8">{index + 1}</span>
                  <img 
                    src={track.coverArt} 
                    alt={track.title} 
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                  <div className="text-sm text-gray-400 mr-4">
                    {formatDuration(track.duration)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => playTrack(track)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleFavorite(track.id)}
                    className={track.isFavorite ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={track.isFavorite ? "fill-current" : ""} size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Now Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp className="mr-2 text-green-500" /> Trending Now
              </h2>
              <Button variant="link" className="text-gray-400 hover:text-white">
                See all
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingTracks.map((track) => (
                <Card 
                  key={track.id} 
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group"
                >
                  <div className="relative">
                    <img 
                      src={track.coverArt} 
                      alt={track.title} 
                      className="w-full aspect-square object-cover rounded-t-lg"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute bottom-2 right-2 bg-green-500 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => playTrack(track)}
                    >
                      <Play className="h-5 w-5 text-black" />
                    </Button>
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium truncate">{track.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Access Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 transition-colors cursor-pointer">
                <CardContent className="p-5 flex flex-col items-center justify-center h-32">
                  <Radio className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Radio</h3>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 transition-colors cursor-pointer">
                <CardContent className="p-5 flex flex-col items-center justify-center h-32">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">New Releases</h3>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900 to-green-700 hover:from-green-800 hover:to-green-600 transition-colors cursor-pointer">
                <CardContent className="p-5 flex flex-col items-center justify-center h-32">
                  <Heart className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Favorites</h3>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 transition-colors cursor-pointer">
                <CardContent className="p-5 flex flex-col items-center justify-center h-32">
                  <Clock className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Recently Added</h3>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* Mini Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 w-1/4">
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white text-black hover:bg-gray-200 rounded-full h-10 w-10"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={stopTrack}
              >
                Stop
              </Button>
            </div>

            <div className="flex items-center space-x-2 w-1/4 justify-end">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toggleFavorite(currentTrack.id)}
                className={currentTrack.isFavorite ? "text-red-500" : "text-gray-400"}
              >
                <Heart className={currentTrack.isFavorite ? "fill-current" : ""} size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Home;