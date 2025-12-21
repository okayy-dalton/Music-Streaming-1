"use client";

import React, { useState } from 'react';
import { Download, Play, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  isDownloaded: boolean;
}

interface PlaylistManagerProps {
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onAddTrackToPlaylist: (playlistId: string, track: Track) => void;
  onDownloadPlaylist: (playlist: Playlist) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  currentTrack: Track | null;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  onAddTrackToPlaylist,
  onDownloadPlaylist,
  onPlayPlaylist,
  currentTrack
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleCreatePlaylist} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium truncate">
                {playlist.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeletePlaylist(playlist.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{playlist.tracks.length} tracks</span>
                  <span>
                    {formatDuration(
                      playlist.tracks.reduce((acc, track) => acc + track.duration, 0)
                    )}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onPlayPlaylist(playlist)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onDownloadPlaylist(playlist)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {playlist.isDownloaded ? 'Downloaded' : 'Download'}
                  </Button>
                </div>
                
                <div className="max-h-32 overflow-y-auto">
                  {playlist.tracks.slice(0, 3).map((track) => (
                    <div key={track.id} className="flex items-center py-1 text-sm">
                      <img 
                        src={track.coverArt} 
                        alt={track.title} 
                        className="w-6 h-6 rounded-sm mr-2"
                      />
                      <span className="truncate">{track.title}</span>
                    </div>
                  ))}
                  {playlist.tracks.length > 3 && (
                    <p className="text-xs text-gray-400 mt-1">
                      + {playlist.tracks.length - 3} more tracks
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaylistManager;