import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { Location } from '@/types';
import Fuse from 'fuse.js';
import { cn } from '@/lib/cn';

interface SearchBarProps {
  locations: Location[];
  onSearchResultClick: (location: Location) => void;
  className?: string;
}

interface FuseResult {
  item: Location;
  score?: number;
  refIndex: number;
}

export default function SearchBar({ locations, onSearchResultClick, className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(locations, {
    keys: ['name', 'description', 'city', 'country'],
    threshold: 0.3,
    includeScore: true,
  });

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim() === '') {
        setSearchResults([]);
        return;
      }

      const results = fuse.search(query).map((result: FuseResult) => result.item);
      setSearchResults(results);
    },
    [fuse]
  );

  return (
    <div className={className}>
      <label className="input w-full rounded-md">
        <Search className="h-4 w-4" />
        <input
          type="search"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </label>
      {isOpen && searchResults.length > 0 && (
        <div className="dropdown-content rounded-box bg-base-100 mt-2 w-full p-2 shadow-lg">
          {searchResults.map(location => (
            <button
              key={location.id}
              className="btn btn-ghost btn-block justify-start"
              onClick={() => {
                onSearchResultClick(location);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{location.name}</span>
                {location.city && location.country && (
                  <span className="text-base-content/70 text-sm">
                    {location.city}, {location.country}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
