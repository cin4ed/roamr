'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import type { FeatureCollection, Feature } from 'geojson';
import { autocomplete } from '@/utils/photon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchBarProps {
  onResultSelect: (result: Feature) => void;
}

export default function SearchBar({ onResultSelect }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [debouncedInput] = useDebounce(input, 500);
  const [predictions, setPredictions] = useState<FeatureCollection>();

  useEffect(() => {
    async function fetchPredictions() {
      const newPredictions = await autocomplete(debouncedInput);
      setPredictions(newPredictions);
    }
    if (debouncedInput) {
      fetchPredictions();
    }
  }, [debouncedInput]);

  function selectFeature(feature: Feature) {
    onResultSelect(feature);
  }

  function clearSearchBar() {
    setInput('');
    setPredictions(undefined);
  }

  function onInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    if (e.target.value === '') clearSearchBar();
  }

  return (
    <div className={cn('overflow-hidden')}>
      <div
        className={cn(
          'flex h-9 w-full items-center rounded-tl-md rounded-tr-md border px-3 py-1 text-base'
        )}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          placeholder="Search"
          className="flex-1 bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          value={input}
          onChange={onInputChangeHandler}
        />
        {input.length > 0 && (
          <X
            className="ml-2 h-4 w-4 shrink-0 cursor-pointer opacity-50 transition-opacity hover:opacity-100"
            onClick={clearSearchBar}
          />
        )}
      </div>
      {predictions && (
        <ScrollArea className="h-56 rounded-bl-md rounded-br-md border-x border-b">
          <div className="divide-y">
            {predictions?.features.map(feature => (
              <div
                className="cursor-pointer px-2 py-1.5 text-sm hover:bg-zinc-800"
                key={crypto.randomUUID()}
                onClick={() => selectFeature(feature)}
              >
                {`${feature.properties?.name}, ${feature.properties?.country}`}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
