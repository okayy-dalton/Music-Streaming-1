"use client";

import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Play, Pause, Volume2, Radio as RadioIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { MadeWithDyad } from '@/components/made-with-dyad';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { showSuccess } from '@/utils/toast';

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  location: string;
  genre: string;
  description: string;
  streamUrl: string;
  coverArt: string;
  isPlaying: boolean;
}

const Radio = () => {
  // Mock data for local radio stations
  const mockStations: RadioStation[] = [
    {
      id: '1',
      name: 'Rock FM',
      frequency: '92.5 FM',
      location: 'New York',
      genre: 'Rock',
      description: 'The best rock hits 24/7',
      streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      isPlaying: false
    },
    {
      id: '2',
      name: 'Jazz Lounge',
      frequency: '95.3 FM',
      location: 'Chicago',
      genre: 'Jazz',
      description: 'Smooth jazz for your soul',
      streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      isPlaying: false
    },
    {
      id: '3',
      name: 'Pop Hits',
      frequency: '98.7 FM',
      location: 'Los Angeles',
      genre: 'Pop',
      description: 'Today\'s top pop hits',
      streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300',
      isPlaying: false
    },
    {
      id: '4',
      name: 'Classical Moods',
      frequency: '101.2 FM',
      location: 'Boston',
      genre: 'Classical',
      description: 'Timeless classical masterpieces',
      streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      isPlaying: false
    },
    {
      id: '5',
      name: 'Hip Hop Nation',
      frequency: '103.9 FM',
      location: 'Atlanta',
      genre: 'Hip Hop',
      description: 'The hottest hip hop tracks',
      streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      coverArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300',
      isPlaying: false
    },
    {
      id: '6',
      name: 'Country Roads',
      frequency: '106.1 FM',
      location: 'Nashville',
      genre: 'Country',
      description: 'Country music from the heart',
      streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      isPlaying: false
    }
  ];

  const [stations, setStations] = useState<RadioStation[]>(mockStations);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [sound, setSound] = useState<Howl | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(100);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [sound]);

  const playStation = (station: RadioStation) => {
    // Stop current station if playing
    if (sound) {
      sound.stop();
    }

    // Update stations state to reflect which one is playing
    setStations(prev => prev.map(s => ({
      ...s,
      isPlaying: s.id === station.id
    })));

    // Create new sound instance
    const newSound = new Howl({
      src: [station.streamUrl],
      volume: volume / 100,
      html5: true, // Required for streaming
      onplay: () => {
        setIsPlaying(true);
        setCurrentStation(station);
        showSuccess(`Now playing: ${station.name}`);
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onloaderror: (id, err) => {
        console.error('Error loading station:', err);
        showSuccess('Error playing station. Please try another.');
      }
    });

    setSound(newSound);
    newSound.play();
  };

  const togglePlayPause = () => {
    if (!currentStation) return;

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

  const stopStation = () => {
    if (sound) {
      sound.stop();
      setIsPlaying(false);
      setCurrentStation(null);
      setStations(prev => prev.map(s => ({ ...s, isPlaying: false })));
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (sound) {
      sound.volume(newVolume / 100);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      if (sound) {
        sound.volume(previousVolume / 100);
      }
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      if (sound) {
        sound.volume(0);
      }
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <MobileNav />
      
      <div className="md:ml-64 lg:ml-72 pb-24">
        <div className="container mx-auto px-4 pt-20 md:pt-8 py-8">
          <header className="mb-8">
            <div className="flex items-center space-x-3">
              <RadioIcon className="h-8 w-8 text-purple-500" />
              <h1 className="text-3xl font-bold text-white">Local Radio Stations</h1>
            </div>
            <p className="text-gray-300 mt-2">Tune into local stations from around the country</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
              <Card 
                key={station.id} 
                className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors ${
                  currentStation?.id === station.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={station.coverArt} 
                      alt={station.name} 
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-white">{station.name}</CardTitle>
                      <p className="text-sm text-gray-300">{station.frequency} • {station.location}</p>
                      <p className="text-xs text-purple-400 mt-1">{station.genre}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-300 mb-4">{station.description}</p>
                  <Button
                    className="w-full"
                    onClick={() => 
                      currentStation?.id === station.id && isPlaying 
                        ? stopStation() 
                        : playStation(station)
                    }
                  >
                    {currentStation?.id === station.id && isPlaying ? (
                      <>
                        <Pause className="mr-2 h-4 w-4 text-white" /> Stop
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4 text-white" /> Play
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Player */}
      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 w-1/4">
              <img 
                src={currentStation.coverArt} 
                alt={currentStation.name} 
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-white">{currentStation.name}</h3>
                <p className="text-gray-300 text-sm">{currentStation.frequency}</p>
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
                className="text-white"
                onClick={stopStation}
              >
                Stop
              </Button>
            </div>

            <div className="flex items-center space-x-2 w-1/4 justify-end">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMute}
                className="text-gray-300 hover:text-white"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={([value]) => handleVolumeChange(value)}
                className="w-24"
              />
            </div>
          </div>
        </div>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Radio;