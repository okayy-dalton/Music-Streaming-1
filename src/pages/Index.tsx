"use client";

import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithDyad } from '@/components/made-with-dyad';
import MusicPlayer from '@/components/MusicPlayer';
import TrackList from '@/components/TrackList';
import GenreFilter from '@/components/GenreFilter';
import PlaylistManager from '@/components/PlaylistManager';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { showSuccess, showError } from '@/utils/toast';

// Mock data for tracks
const mockTracks = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'Ocean View',
    album: 'Beach Days',
    duration: 213,
    genre: ['Pop', 'Chill'],
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
    isDownloaded: false
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
    isDownloaded: false
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
    isDownloaded: false
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
    isDownloaded: false
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
    isDownloaded: false
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
    isDownloaded: false
  }
];

// Extract unique genres
const allGenres = Array.from(
  new Set(mockTracks.flatMap(track => track.genre))
);

const Index = () => {
  // Player state
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState<Howl | null>(null);
  
  // Track and playlist state
  const [tracks, setTracks] = useState(mockTracks);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(allGenres);
  const [playlists, setPlaylists] = useState<any[]>([]);
  
  // Filter tracks by selected genres
  const filteredTracks = tracks.filter(track => 
    selectedGenres.length === 0 || 
    track.genre.some(g => selectedGenres.includes(g))
  );

  // Initialize player
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [sound]);

  // Update progress
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      progressInterval = setInterval(() => {
        if (sound) {
          setProgress(sound.seek());
        }
      }, 1000);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPlaying, currentTrack, sound]);

  const playTrack = (track: any) => {
    if (sound) {
      sound.stop();
    }
    
    const newSound = new Howl({
      src: [track.url],
      volume: volume / 100,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
      }
    });
    
    setSound(newSound);
    setCurrentTrack(track);
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

  const nextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    playTrack(filteredTracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
    playTrack(filteredTracks[prevIndex]);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (sound) {
      sound.volume(newVolume / 100);
    }
  };

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
    if (sound) {
      sound.seek(newProgress);
    }
  };

  const downloadTrack = (track: any) => {
    // Simulate download
    setTracks(prev => prev.map(t => 
      t.id === track.id ? { ...t, isDownloaded: true } : t
    ));
    
    showSuccess(`"${track.title}" downloaded for offline listening`);
  };

  const createPlaylist = (name: string) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      isDownloaded: false
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    showSuccess(`Playlist "${name}" created`);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    showSuccess('Playlist deleted');
  };

  const addTrackToPlaylist = (playlistId: string, track: any) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] } 
        : playlist
    ));
    showSuccess(`Added "${track.title}" to playlist`);
  };

  const downloadPlaylist = (playlist: any) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlist.id ? { ...p, isDownloaded: true } : p
    ));
    
    // Mark all tracks in playlist as downloaded
    setTracks(prev => prev.map(track => 
      playlist.tracks.some((t: any) => t.id === track.id) 
        ? { ...track, isDownloaded: true } 
        : track
    ));
    
    showSuccess(`Playlist "${playlist.name}" downloaded for offline listening`);
  };

  const playPlaylist = (playlist: any) => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <MobileNav />
      
      <div className="md:ml-64 lg:ml-72 pb-24">
        <div className="container mx-auto px-4 pt-20 md:pt-8 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Music Discovery</h1>
            <p className="text-gray-400">Discover and stream music across all genres</p>
          </header>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover">
              <GenreFilter 
                genres={allGenres}
                selectedGenres={selectedGenres}
                onGenreChange={setSelectedGenres}
              />
              
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {selectedGenres.length === 0 
                    ? 'All Tracks' 
                    : `${filteredTracks.length} Tracks in Selected Genres`}
                </h2>
              </div>
              
              <TrackList
                tracks={filteredTracks}
                onPlayTrack={playTrack}
                onDownloadTrack={downloadTrack}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
              />
            </TabsContent>
            
            <TabsContent value="playlists">
              <PlaylistManager
                playlists={playlists}
                onCreatePlaylist={createPlaylist}
                onDeletePlaylist={deletePlaylist}
                onAddTrackToPlaylist={addTrackToPlaylist}
                onDownloadPlaylist={downloadPlaylist}
                onPlayPlaylist={playPlaylist}
                currentTrack={currentTrack}
              />
            </TabsContent>
            
            <TabsContent value="downloads">
              <h2 className="text-xl font-bold mb-4">Downloaded Tracks</h2>
              <TrackList
                tracks={tracks.filter(track => track.isDownloaded)}
                onPlayTrack={playTrack}
                onDownloadTrack={downloadTrack}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        onPlayPause={togglePlayPause}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onVolumeChange={handleVolumeChange}
        onDownload={downloadTrack}
        onProgressChange={handleProgressChange}
        progress={progress}
      />
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;