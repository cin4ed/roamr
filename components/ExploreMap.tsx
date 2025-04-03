'use client';

import { useRef, useCallback, useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocationMarker } from '@/components/location-marker';
import type { Location } from '@/types';
import type { MapSettings } from '@/components/MapSettingsCard';
import MapSettingsCard from '@/components/MapSettingsCard';
import { cn } from '@/utils/cn';
import { mapStyleVector, mapStyleRaster } from '@/utils/map';
import { Settings } from 'lucide-react';

interface ExploreMapProps extends React.HTMLAttributes<HTMLDivElement> {
  onLocationClick: (location: Location) => void;
}

export default function ExploreMap({ className, onLocationClick }: ExploreMapProps) {
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    projection: 'mercator',
    style: 'vector',
  });
  const [showSettings, setShowSettings] = useState(false);

  const mapRef = useRef<MapRef>(null);
  const { locations } = useLocations();

  const handleOnLocationClick = useCallback(
    (location: Location) => {
      mapRef.current?.panTo([location.longitude, location.latitude], {
        duration: 1000,
        easing: n => n,
      });

      onLocationClick(location);
    },
    [onLocationClick]
  );

  const flyToLocation = useCallback((location: Location) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
    });
  }, []);

  const getMapStyle = (): string => {
    return mapSettings.style === 'vector' ? mapStyleVector : mapStyleRaster;
  };

  const mapProps = {
    id: 'main',
    initialViewState: {
      longitude: -100,
      latitude: 40,
      zoom: 0.7,
    },
    minZoom: 0.7,
    maxZoom: 15.9,
    style: { width: '100%', height: '100%' },
    cursor: 'grab',
    projection: mapSettings.projection,
    mapStyle: getMapStyle(),
  };

  return (
    <div
      className={cn(className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,53,201,1) 8%, rgba(0,32,103,1) 17%, rgba(8,15,56,1) 30%, rgba(0,7,28,1) 80%)',
      }}
    >
      <Map {...mapProps} ref={mapRef}>
        {locations.map(location => (
          <LocationMarker
            key={location.id}
            location={location}
            onLocationDoubleClick={flyToLocation}
            onLocationClick={handleOnLocationClick}
          />
        ))}
      </Map>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 right-4 z-20 p-2 bg-background rounded-full shadow-lg"
        aria-label="Toggle map settings"
      >
        <Settings className="w-5 h-5 text-primary" />
      </button>
      {showSettings && (
        <MapSettingsCard
          settings={mapSettings}
          onSettingsChange={setMapSettings}
          className="fixed top-16 right-4 z-10 shadow"
        />
      )}
    </div>
  );
}
