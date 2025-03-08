"use client";

import Map, { Source, StyleSpecification, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Satellite, MapPinPlus, Maximize2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { LocationMarker } from "@/components/location-marker";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Location = Database["public"]["Tables"]["locations"]["Row"];

function MapContent({ locations }: {
  locations: Location[];
}) {
  const { current: map } = useMap();

  const handleLocationClick = (location: Location) => {
    if (!map) return;
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

export default function Explore() {
  const router = useRouter();
  const [isVectorStyle, setIsVectorStyle] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const { session } = useAuth();

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

  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)] flex">
      <div className="w-full h-full relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
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
          />
        </Map>

        <Button
          className="fixed h-[80px] text-md left-1/2 -translate-x-1/2 z-10 shadow-lg flex gap-2 w-[calc(100%-32px)] max-w-xl mx-auto"
          variant="outline"
          style={{ bottom: `max(20px, env(safe-area-inset-bottom, 24px))` }}
          onClick={() => session ? router.push('/create') : router.push('/login')}
        >
          <MapPinPlus className="w-5 h-5" />
          {session ? 'Add a new location' : 'Sign in to add location'}
        </Button>
      </div>
    </div>
  );
}
