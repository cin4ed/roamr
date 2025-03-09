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
const snapPoints = [0.2, 0.5, 1];

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
        <div className="absolute top-4 right-4 z-[60] flex flex-col gap-2">
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
            onLocationSelect={handleLocationSelect}
          />
        </Map>
      </div>
      {/* Drawer */}
      <Drawer.Root
        open={!!selectedLocation}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLocation(null);
          }
        }}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        modal={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="bg-black/10" />
          <Drawer.Content className="fixed flex flex-col bg-background border rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
            <div>
            <div className="max-w-md mx-auto p-4" data-scrollable="true">
              {selectedLocation && (
                <>
                  <Drawer.Handle />
                  <div className="space-y-4">
                    {/* Title and Rating */}
                    <div className="flex justify-between mt-2">
                      <Drawer.Title className="text-2xl font-bold">{selectedLocation.name}</Drawer.Title>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">4.5</span>
                      </div>
                    </div>
                    {/* Image */}
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted mb-4">
                      {selectedLocation.location_images && selectedLocation.location_images.length > 0 ? (
                        <Image
                          src={selectedLocation.location_images[0].image_url}
                          alt={selectedLocation.name}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                        />
                      ) : (
                        <div className=" inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />

                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{selectedLocation.city}</span>
                      {selectedLocation.city && selectedLocation.country && <span>•</span>}
                      <span>{selectedLocation.country}</span>
                    </div>

                    {/* Description */}
                    <Drawer.Description className="text-muted-foreground">
                      {selectedLocation.description}
                    </Drawer.Description>

                    {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedLocation.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {selectedLocation.safety_info && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Safety Information</h3>
                        <p className="text-muted-foreground">{selectedLocation.safety_info}</p>
                      </div>
                    )}

                    {selectedLocation.accessibility && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Accessibility</h3>
                        <p className="text-muted-foreground">{selectedLocation.accessibility}</p>
                      </div>
                    )}

                    {selectedLocation.address && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-muted-foreground">{selectedLocation.address}</p>
                      </div>
                    )}
                  </div>
                </>
                )}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
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