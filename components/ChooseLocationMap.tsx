'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// This can be defined in other file and imported here
const roamrMapStyle = 'https://tiles.openfreemap.org/styles/liberty';

type ChooseLocationMapProps = {
  onLocationSelected?: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialZoom?: number;
};

export function ChooseLocationMap({
  onLocationSelected,
  initialLatitude = 40,
  initialLongitude = -100,
  initialZoom = 3.5,
}: ChooseLocationMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [centerCoordinates, setCenterCoordinates] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  // When the map moves, update the marker position
  const handleMapMove = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        setCenterCoordinates({
          latitude: center.lat,
          longitude: center.lng,
        });

        // Notify parent component about selected location
        if (onLocationSelected) {
          onLocationSelected(center.lat, center.lng);
        }
      }
    }
  };

  // Set up event listeners
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Set initial coordinates if the map is available
    const initialCenter = map.getCenter();
    if (initialCenter) {
      setCenterCoordinates({
        latitude: initialCenter.lat,
        longitude: initialCenter.lng,
      });

      if (onLocationSelected) {
        onLocationSelected(initialCenter.lat, initialCenter.lng);
      }
    }
  }, [onLocationSelected]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: initialLongitude,
          latitude: initialLatitude,
          zoom: initialZoom,
        }}
        attributionControl={{ compact: true }}
        maxZoom={15.9}
        style={{ width: '100%', height: '100%' }}
        mapStyle={roamrMapStyle}
        onMoveEnd={handleMapMove}
        onDrag={handleMapMove}
      />
      {/* Fixed centered marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none">
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            fill="#000000"
            fill-rule="evenodd"
            d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
