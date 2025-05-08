'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LocationCard from '@/components/LocationCard';
import { useLocations } from '@/hooks/useLocations';
import { useClickOutside } from '@/hooks/useClickOutside';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocationMarker } from '@/components/location-marker';
import { mapStyleVector, mapStyleRaster } from '@/lib/map';
import SearchBar from '@/components/SearchBar';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Drawer } from 'vaul';

import type { User } from '@supabase/supabase-js';
import type { Location } from '@/types';
import type { MapSettings } from '@/components/MapSettingsCard';
import { MenuIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

async function fetchLocationDetails(id: string): Promise<Location | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('locations')
    .select(
      `
      *,
      location_media(*),
      location_revisions!fk_latest_revision(*),
      tags(*),
      creator:profiles(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching location details:', error);
    return null;
  }

  const { data: content, error: contentError } = await supabase
    .from('location_content')
    .select('*')
    .eq('id', data!.location_revisions!.location_content_id)
    .single();

  if (contentError) {
    console.error('Error fetching location content:', contentError);
    return null;
  }

  return {
    ...data,
    content: content,
  };
}

export default function Explore() {
  const [user, setUser] = useState<User | null>(null);

  // State from original Explore component
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // State from ExploreMap component
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    projection: 'mercator',
    style: 'vector',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [mapLongitude, setMapLongitude] = useState(16.0589);
  const [mapLatitude, setMapLatitude] = useState(34.42);
  const [mapZoom, setMapZoom] = useState(1.68);
  const mapRef = useRef<MapRef>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const { locations } = useLocations();
  const settingsRef = useClickOutside<HTMLDivElement>(() => setShowSettings(false));

  const handleLocationClick = useCallback(async (location: Location) => {
    mapRef.current?.panTo([location.longitude, location.latitude], {
      duration: 1000,
      easing: n => n,
    });

    // Fetch detailed location data
    const detailedLocation = await fetchLocationDetails(location.id);
    setSelectedLocation(detailedLocation);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedLocation(null);
  }, []);

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

  // Get user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    getUser();
  }, []);

  return (
    <div className="h-screen w-screen">
      {selectedLocation && (
        <div className="fixed top-0 bottom-0 left-0 z-10 hidden w-1/3 p-4">
          <LocationCard
            location={selectedLocation}
            className="h-full w-full"
            onClose={handleCloseDrawer}
          />
        </div>
      )}
      <div className={cn('fixed top-4 left-4 z-20', selectedLocation && 'left-1/3')}>
        <SearchBar
          className="w-80"
          locations={locations}
          onSearchResultClick={handleLocationClick}
        />
      </div>
      <div className="relative h-full">
        <Map {...mapProps} ref={mapRef}>
          {locations.map(location => (
            <LocationMarker
              key={location.id}
              location={location}
              onLocationDoubleClick={flyToLocation}
              onLocationClick={handleLocationClick}
            />
          ))}
        </Map>
      </div>
    </div>
  );
}

