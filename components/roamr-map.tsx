"use client";

import Map, { Source, Marker, StyleSpecification } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Satellite } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { LocationMarker } from "@/components/location-marker";

type Location = Database["public"]["Tables"]["locations"]["Row"];

type RoamrMapProps = {
  onLocationSelect?: (coordinates: {latitude: number; longitude: number}) => void;
  selectedLocation?: {latitude: number; longitude: number} | null;
  isSelectingLocation?: boolean;
}

export function RoamrMap({ onLocationSelect, selectedLocation, isSelectingLocation }: RoamrMapProps) {
    const [isVectorStyle, setIsVectorStyle] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    async function loadLocations() {
        const supabase = await createClient();
        const { data, error } = await supabase.from('locations').select('*');
        if (error) {
            console.error(error);
        } else {
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
                        // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
                        // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
                        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    ],
                    tileSize: 256,
                    // attribution:
                    //   'Map tiles by <a target="_blank" href="https://stamen.com">Stamen Design</a>; Hosting by <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMapClick = (event: any) => {
        if (onLocationSelect && isSelectingLocation) {
            const { lng, lat } = event.lngLat;
            onLocationSelect({
                longitude: lng,
                latitude: lat
            });
        }
    };

    return (
        <>
            <Button 
                variant="ghost"
                onClick={() => setIsVectorStyle(!isVectorStyle)}
                className="absolute top-4 right-4 z-10 p-2 aspect-square rounded-md shadow-md"
            >
                {isVectorStyle ? <Satellite /> : <MapIcon />}
            </Button>
            
            <Map
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5,
                }}
                maxZoom={15.9}
                style={{ width: "100%", height: "100%" }}
                mapStyle={mapStyle}
                onClick={handleMapClick}
                cursor={isSelectingLocation ? 'crosshair' : 'grab'}
            >
                <Source
                    id="world-imagery"
                    type="raster"
                    tiles={[
                        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
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

                {locations.map((location) => (
                    <LocationMarker key={location.id} location={location} />
                ))}
            </Map>
        </>
    );
}
