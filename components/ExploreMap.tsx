'use client';

import { useRef, useCallback, useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { useClickOutside } from '@/hooks/useClickOutside';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocationMarker } from '@/components/location-marker';
import type { Location } from '@/types';
import type { MapSettings } from '@/components/MapSettingsCard';
import MapSettingsCard from '@/components/MapSettingsCard';
import { cn } from '@/utils/cn';
import { mapStyleVector, mapStyleRaster } from '@/utils/map';
import { Settings, MapPinPlusInsideIcon } from 'lucide-react';
import Link from 'next/link';

interface ExploreMapProps extends React.HTMLAttributes<HTMLDivElement> {
  onLocationClick: (location: Location) => void;
}

export default function ExploreMap({ className, onLocationClick }: ExploreMapProps) {
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    projection: 'mercator',
    style: 'vector',
  });

  const [showSettings, setShowSettings] = useState(false);
  const [mapLongitude, setMapLongitude] = useState(16.0589);
  const [mapLatitude, setMapLatitude] = useState(34.42);
  const [mapZoom, setMapZoom] = useState(1.68);
  const mapRef = useRef<MapRef>(null);
  const { locations } = useLocations();
  const settingsRef = useClickOutside<HTMLDivElement>(() => setShowSettings(false));

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
      longitude: mapLongitude,
      latitude: mapLatitude,
      zoom: mapZoom,
    },
    minZoom: 0.7,
    maxZoom: 15.9,
    style: { width: '100%', height: '100%' },
    cursor: 'grab',
    projection: mapSettings.projection,
    mapStyle: getMapStyle(),
    onMove: (evt: { viewState: { longitude: number; latitude: number } }) => {
      setMapLongitude(evt.viewState.longitude);
      setMapLatitude(evt.viewState.latitude);
    },
    onZoom: (evt: { viewState: { zoom: number } }) => {
      setMapZoom(evt.viewState.zoom);
    },
  };

  return (
    <div
      className={cn(className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,53,201,1) 8%, rgba(0,32,103,1) 17%, rgba(8,15,56,1) 30%, rgba(0,7,28,1) 80%)',
      }}
    >
      {/* Map */}
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
      {/* Map Overlay */}
      <div className="fixed right-4 top-4 z-20 flex flex-col gap-2">
        <button
          onMouseDown={e => {
            e.stopPropagation();
            setShowSettings(!showSettings);
          }}
          className="rounded-full bg-primary p-2 shadow-lg"
          aria-label="Toggle map settings"
        >
          <Settings className="h-5 w-5 text-primary-foreground" />
        </button>
        <Link href="/locations/create" className="rounded-full bg-primary p-2 shadow-lg">
          <MapPinPlusInsideIcon className="h-5 w-5 text-primary-foreground" />
        </Link>
      </div>
      {showSettings && (
        <MapSettingsCard
          ref={settingsRef}
          settings={mapSettings}
          onSettingsChange={setMapSettings}
          className="fixed right-4 top-16 z-20 shadow"
        />
      )}
    </div>
  );
}
