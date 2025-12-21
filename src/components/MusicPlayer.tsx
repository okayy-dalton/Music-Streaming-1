"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string[];
  url: string;
  coverArt: string;
  isDownloaded: boolean;
}

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onDownload: (track: Track) => void;
  onProgressChange: (progress: number) => void;
  progress: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onDownload,
  onProgressChange,
  progress
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(100);

  const toggleMute = () => {
    if (isMuted) {
      Howler.volume(previousVolume / 100);
      onVolumeChange(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      Howler.volume(0);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 border-t border-gray-700">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4 w-1/4">
          {currentTrack ? (
            <>
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className="w-16 h-16 rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDownload(currentTrack)}
                className="text-gray-400 hover:text-white"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-gray-400">No track selected</p>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center space-x-4 mb-2">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white text-black hover:bg-gray-200 rounded-full h-10 w-10"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full space-x-2">
            <span className="text-xs text-gray-400 w-10">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={currentTrack?.duration || 100}
              step={1}
              onValueChange={([value]) => onProgressChange(value)}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-10">
              {currentTrack ? formatTime(currentTrack.duration) : '0:00'}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMute}
            className="text-gray-400 hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={([value]) => {
              onVolumeChange(value);
              Howler.volume(value / 100);
              if (value > 0 && isMuted) setIsMuted(false);
            }}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;