'use client';

import { useRef, useCallback, useState, memo } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { useClickOutside } from '@/hooks/useClickOutside';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocationMarker } from '@/components/location-marker';
import type { Location } from '@/types';
import type { MapSettings } from '@/components/MapSettingsCard';
import MapSettingsCard from '@/components/MapSettingsCard';
import { cn } from '@/lib/cn';
import { mapStyleVector, mapStyleRaster } from '@/lib/map';
import { Settings, MapPinPlusInsideIcon } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from '@/components/SearchBar';

interface ExploreMapProps extends React.HTMLAttributes<HTMLDivElement> {
  onLocationClick: (location: Location) => void;
  selectedLocation?: Location | null;
}

const ExploreMap = memo(function ExploreMap({
  className,
  onLocationClick,
  selectedLocation,
}: ExploreMapProps) {
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    projection: 'mercator',
    style: 'vector',
  });
  const { session } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [mapLongitude, setMapLongitude] = useState(16.0589);
  const [mapLatitude, setMapLatitude] = useState(34.42);
  const [mapZoom, setMapZoom] = useState(1.68);
  const mapRef = useRef<MapRef>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
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
      className={cn('relative', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,53,201,1) 8%, rgba(0,32,103,1) 17%, rgba(8,15,56,1) 30%, rgba(0,7,28,1) 80%)',
      }}
    >
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-20">
        <SearchBar locations={locations} onSearchResultClick={handleOnLocationClick} />
      </div>

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
      <div className="fixed top-4 right-4 z-20 flex flex-col gap-2">
        {session && (
          <Link href="/profile" className="h-12 w-12">
            <div className="border-primary-content h-full w-full overflow-hidden rounded-full border">
              <img
                src={session.user.user_metadata.avatar_url}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        )}
        <button
          ref={settingsButtonRef}
          onMouseDown={e => {
            e.stopPropagation();
            setShowSettings(!showSettings);
          }}
          className="btn rounded-full"
          aria-label="Toggle map settings"
        >
          <Settings className="text-primary-foreground h-6 w-6" />
        </button>
        <Link href="/locations/create" className="btn rounded-full">
          <MapPinPlusInsideIcon className="text-primary-foreground h-6 w-6" />
        </Link>
      </div>
      <AnimatePresence>
        {showSettings && (
          <MapSettingsCard
            ref={settingsRef}
            settings={mapSettings}
            onSettingsChange={setMapSettings}
            className="fixed top-16 right-4 z-20 shadow"
            buttonRef={settingsButtonRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

export default ExploreMap;
