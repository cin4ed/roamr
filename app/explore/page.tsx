"use client";

import Map, { Source, StyleSpecification, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Satellite, Maximize2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { LocationMarker } from "@/components/location-marker";
import { Drawer } from "vaul";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type Location = Database["public"]["Tables"]["locations"]["Row"];
const snapPoints = [0.2,0.5,1];

export default function Explore() {
  const [isVectorStyle, setIsVectorStyle] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[1]);

  async function loadLocations() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('locations').select('*, location_images(*)');
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
    ? "https://tiles.openfreemap.org/styles/liberty"
    : {
      version: 8,
      sources: {
        "raster-tiles": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "simple-tiles",
          type: "raster",
          source: "raster-tiles",
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    };

  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      void el.requestFullscreen();
    } else if ('webkitRequestFullscreen' in el) { // Safari
      void (el as { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen();
    } else if ('msRequestFullscreen' in el) { // IE11
      void (el as { msRequestFullscreen(): Promise<void> }).msRequestFullscreen();
    }
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSnap(snapPoints[1]);
  };

  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)] flex">
      <div className="w-full h-full relative">
        {/* <div className="absolute top-4 right-4 z-[60] flex gap-2">
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
        </div> */}

        {/* <div className="absolute inset-0"> */}
        <Map
          id="main"
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5,
          }}
          maxZoom={15.9}
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapStyle}
          cursor="grab"
        >
          <MapContent
            locations={locations}
            onLocationSelect={handleLocationSelect}
          />
        </Map>
        {/* </div> */}

        {/* <Button
          className="fixed h-[80px] text-md left-1/2 -translate-x-1/2 z-[60] shadow-lg flex gap-2 w-[calc(100%-32px)] max-w-xl mx-auto"
          variant="outline"
          style={{ bottom: `max(20px, env(safe-area-inset-bottom, 24px))` }}
          onClick={() => session ? router.push('/create') : router.push('/login')}
        >
          <MapPinPlus className="w-5 h-5" />
          {session ? 'Add a new location' : 'Sign in to add location'}
        </Button> */}

        <Drawer.Root
          open={!!selectedLocation}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedLocation(null);
              // setSnap(null);
            }
          }}
          snapPoints={snapPoints}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          modal={false}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="bg-black/10 pointer-events-none" />
            <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 z-50">
              <div className="max-w-md mx-auto p-4" data-scrollable="true">
                <Drawer.Handle />
                <Drawer.Title>
                  {selectedLocation?.name}
                </Drawer.Title>
                <Drawer.Description>
                  Location details for {selectedLocation?.name} in {selectedLocation?.city}, {selectedLocation?.country}
                </Drawer.Description>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}

function MapContent({ locations, onLocationSelect }: {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}) {
  const { current: map } = useMap();

  const handleLocationClick = (location: Location) => {
    if (!map) return;
    onLocationSelect(location);
    map.panTo([Number(location.longitude), Number(location.latitude)], {
      duration: 1000,
      essential: true
    });
  };

  const handleLocationDoubleClick = (location: Location) => {
    if (!map) return;
    map.flyTo({
      center: [Number(location.longitude), Number(location.latitude)],
      zoom: 14,
      duration: 1500,
      essential: true
    });
  };

  return (
    <>
      <Source
        id="world-imagery"
        type="raster"
        tiles={[
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ]}
        tileSize={256}
      />

      {locations.map((location) => (
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