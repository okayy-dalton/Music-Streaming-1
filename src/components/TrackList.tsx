"use client";

import React from 'react';
import { Download, Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface TrackListProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  onDownloadTrack: (track: Track) => void;
  currentTrackId: string | null;
  isPlaying: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onPlayTrack,
  onDownloadTrack,
  currentTrackId,
  isPlaying
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div 
          key={track.id}
          className={`flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors ${
            currentTrackId === track.id ? 'bg-gray-800' : ''
          }`}
        >
          <div className="flex items-center w-1/12">
            <img 
              src={track.coverArt} 
              alt={track.title} 
              className="w-10 h-10 rounded-md object-cover"
            />
          </div>
          
          <div className="w-4/12">
            <h3 className="font-medium">{track.title}</h3>
            <p className="text-sm text-gray-400">{track.artist}</p>
          </div>
          
          <div className="w-3/12">
            <p className="text-sm">{track.album}</p>
          </div>
          
          <div className="w-2/12 flex flex-wrap gap-1">
            {track.genre.map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>
          
          <div className="w-1/12 text-right">
            <span className="text-sm text-gray-400">{formatDuration(track.duration)}</span>
          </div>
          
          <div className="w-1/12 flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPlayTrack(track)}
              className="h-8 w-8"
            >
              {currentTrackId === track.id && isPlaying ? (
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDownloadTrack(track)}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;