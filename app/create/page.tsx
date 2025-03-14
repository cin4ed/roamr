'use client';

import Map, { Source, Marker, StyleSpecification } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, Satellite, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Create() {
  const router = useRouter();
  const { session } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isVectorStyle, setIsVectorStyle] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

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

  const handleMapClick = (event: { lngLat: { lng: number; lat: number } }) => {
    const { lng, lat } = event.lngLat;
    setSelectedLocation({
      longitude: lng,
      latitude: lat,
    });
  };

  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)] flex">
      <div className="w-full h-full relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsVectorStyle(!isVectorStyle)}
            className="p-2 aspect-square rounded-md shadow-md"
          >
            {isVectorStyle ? <Satellite /> : <MapIcon />}
          </Button>
        </div>

        <Map
          id="create"
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5,
          }}
          maxZoom={15.9}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyle}
          onClick={handleMapClick}
          cursor="crosshair"
        >
          <Source
            id="world-imagery"
            type="raster"
            tiles={[
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ]}
            tileSize={256}
          />

          {selectedLocation && (
            <Marker
              longitude={selectedLocation.longitude}
              latitude={selectedLocation.latitude}
              color="#ff0000"
            />
          )}
        </Map>

        <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-black/70 text-white px-4 py-2 rounded-md z-10">
          Click anywhere on the map to select a location
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 p-4 flex gap-2 justify-center"
          style={{ paddingBottom: `max(20px, env(safe-area-inset-bottom, 24px))` }}
        >
          <Button
            className="h-[80px] text-md shadow-lg w-full max-w-[200px]"
            variant="outline"
            onClick={() => router.push('/explore')}
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
          <Button
            className="h-[80px] text-md shadow-lg w-full max-w-[200px]"
            onClick={() => {
              if (selectedLocation) {
                // TODO: Navigate to the form page with the selected location
                router.push(
                  `/create/details?lat=${selectedLocation.latitude}&lng=${selectedLocation.longitude}`
                );
              }
            }}
            disabled={!selectedLocation}
          >
            <Check className="w-5 h-5 mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
