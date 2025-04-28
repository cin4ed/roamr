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
      <Drawer.Root open={selectedLocation !== null}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content className="bg-base-100 fixed inset-0 bottom-0 z-50 p-5">
            <Drawer.Handle />
            <div className="mt-5">
              <Drawer.Title className="text-3xl font-bold">{selectedLocation?.name}</Drawer.Title>
              <p className="text-sm text-gray-500">Country, City</p>
              <Image
                src={selectedLocation?.location_media?.[0].media_url ?? ''}
                alt={selectedLocation?.name ?? 'Location image'}
                width={500}
                height={500}
                className="mt-3 w-full rounded-lg"
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Submitted by</p>
                  {selectedLocation?.creator?.avatar_url ? (
                    <Image
                      src={selectedLocation.creator.avatar_url}
                      alt="User avatar"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                  )}
                  <span className="text-sm text-gray-500">
                    {selectedLocation?.creator?.username || 'Anonymous'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedLocation?.location_media?.length} photos
                </p>
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-bold">About</h2>
                <p className="text-balance">{selectedLocation?.description}</p>
              </div>
              {selectedLocation?.tags && selectedLocation.tags.length > 0 && (
                <div className="mt-3">
                  <h2 className="text-lg font-bold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.tags.map(tag => (
                      <span key={tag.id} className="badge badge-outline">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedLocation?.content?.content && (
                <div className="mt-3">
                  <h2 className="text-lg font-bold">Details</h2>
                  <p className="text-balance whitespace-pre-line">
                    {selectedLocation.content.content}
                  </p>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
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
