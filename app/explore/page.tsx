'use client';

import Map, { Source, StyleSpecification, useMap } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, Satellite, Maximize2, Compass, User, PlusCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/supabase';
import { LocationMarker } from '@/components/location-marker';
import ExploreDrawer from '@/components/ExploreDrawer';
import Link from 'next/link';

type Location = Database['public']['Tables']['locations']['Row'];
const snapPoints = ['100px', 0.5, 1];

export default function Explore() {
  const [isVectorStyle, setIsVectorStyle] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  async function loadLocations() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('locations').select(`*`);
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setLocations(data);
    }
  }

  useEffect(() => {
    loadLocations();
  }, []);

  const mapStyle: StyleSpecification | string = isVectorStyle
    ? 'https://tiles.openfreemap.org/styles/liberty'
    : {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      };

  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      void el.requestFullscreen();
    } else if ('webkitRequestFullscreen' in el) {
      // Safari
      void (el as { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen();
    } else if ('msRequestFullscreen' in el) {
      // IE11
      void (el as { msRequestFullscreen(): Promise<void> }).msRequestFullscreen();
    }
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)] flex">
      <div className="w-full h-full relative">
        <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={enterFullscreen}
            className="p-2 aspect-square rounded-md shadow-md"
          >
            <Maximize2 />
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsVectorStyle(!isVectorStyle)}
            className="p-2 aspect-square rounded-md shadow-md"
          >
            {isVectorStyle ? <Satellite /> : <MapIcon />}
          </Button>
        </div>

        <div className="fixed inset-0">
          <Map
            id="main"
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 3.5,
            }}
            maxZoom={15.9}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
            cursor="grab"
          >
            <MapContent locations={locations} onLocationSelect={handleLocationSelect} />
          </Map>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-24 px-4 z-[102]">
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
        </div>
      </div>

      {/* Drawer */}
      {selectedLocation && <ExploreDrawer location={selectedLocation} />}
    </div>
  );
}

function MapContent({
  locations,
  onLocationSelect,
}: {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}) {
  const { current: map } = useMap();

  const handleLocationClick = (location: Location) => {
    if (!map) return;
    onLocationSelect(location);
    map.panTo([Number(location.longitude), Number(location.latitude)], {
      duration: 1000,
      essential: true,
    });
  };

  const handleLocationDoubleClick = (location: Location) => {
    if (!map) return;
    map.flyTo({
      center: [Number(location.longitude), Number(location.latitude)],
      zoom: 14,
      duration: 1500,
      essential: true,
    });
  };

  return (
    <>
      <Source
        id="world-imagery"
        type="raster"
        tiles={[
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ]}
        tileSize={256}
      />

      {locations.map(location => (
        <LocationMarker
          key={location.id}
          location={location}
          onLocationClick={handleLocationClick}
          onLocationDoubleClick={handleLocationDoubleClick}
        />
      ))}
    </>
  );
}
