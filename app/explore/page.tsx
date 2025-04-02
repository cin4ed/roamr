'use client';

import { useState, useCallback } from 'react';
import ExploreMap from '@/components/ExploreMap';
import type { Location } from '@/types';
import LocationCard from '@/components/LocationCard';

export default function Explore() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationClick = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)]">
      <ExploreMap className="fixed inset-0" onLocationClick={handleLocationClick} />
      {selectedLocation && <LocationCard location={selectedLocation} className="fixed inset-0" />}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-24 px-4 z-[102]">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Compass className="w-6 h-6" />
          <span className="text-xs">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <User className="w-6 h-6" />
          <span className="text-xs">You</span>
        </button>
        <Link href="/locations/create">
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Contribute</span>
          </button>
        </Link>
      </div> */}

      {/* {selectedLocation && <ExploreDrawer location={selectedLocation} />} */}
    </div>
  );
}
