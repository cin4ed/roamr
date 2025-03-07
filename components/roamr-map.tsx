"use client";

import Map, { Source, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

type RoamrMapProps = {
  onLocationSelect?: (coordinates: {latitude: number; longitude: number}) => void;
  selectedLocation?: {latitude: number; longitude: number} | null;
}

export function RoamrMap({ onLocationSelect, selectedLocation }: RoamrMapProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMapClick = (event: any) => {
        if (onLocationSelect) {
            const { lng, lat } = event.lngLat;
            onLocationSelect({
                longitude: lng,
                latitude: lat
            });
        }
    };

    return (
        <Map
            initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5,
            }}
            maxZoom={15.9}
            style={{ width: "100%", height: "100%" }}
            mapStyle={{
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
            }}
            onClick={handleMapClick}
            cursor={onLocationSelect ? 'crosshair' : 'grab'}
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
        </Map>
    );
}
