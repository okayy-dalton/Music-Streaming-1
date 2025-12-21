"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenres,
  onGenreChange
}) => {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  const selectAll = () => {
    onGenreChange(genres);
  };

  const clearAll = () => {
    onGenreChange([]);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Genres</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenres.includes(genre) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleGenre(genre)}
            className="rounded-full"
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;