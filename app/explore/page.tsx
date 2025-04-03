'use client';

import { useState, useCallback } from 'react';
import ExploreMap from '@/components/ExploreMap';
import type { Location } from '@/types';
import LocationCard from '@/components/LocationCard';
import ExploreDrawer from '@/components/ExploreDrawer';

export default function Explore() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationClick = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)]">
      {/* Desktop Layout */}
      <div className="hidden h-full md:flex">
        {selectedLocation && <LocationCard location={selectedLocation} className="w-2/6 p-6" />}
        <div className={`${selectedLocation ? 'w-4/6' : 'w-full'} transition-all duration-300`}>
          <ExploreMap className="h-full w-full" onLocationClick={handleLocationClick} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="h-full md:hidden">
        <div className="h-full">
          <ExploreMap className="h-full w-full" onLocationClick={handleLocationClick} />
        </div>
        {selectedLocation && (
          <>
            <div
              className="fixed inset-0 z-[101] bg-black/50 md:hidden"
              onClick={handleCloseDrawer}
            />
            <ExploreDrawer location={selectedLocation} onClose={handleCloseDrawer} />
          </>
        )}
      </div>
    </div>
  );
}
