'use client';

import { useRef, useEffect } from 'react';
import Map, { MapRef, GeolocateControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// TODO: import this from an external file.
const roamrMapStyle = 'https://tiles.openfreemap.org/styles/liberty';

type ChooseLocationMapProps = {
  onLocationChange?: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialZoom?: number;
};

export function ChooseLocationMap({
  onLocationChange,
  initialLatitude = 40,
  initialLongitude = -100,
  initialZoom = 3.5,
}: ChooseLocationMapProps) {
  const mapRef = useRef<MapRef>(null);

  // When the component loads, call `onLocationChange` with the center coordinates.
  useEffect(() => {
    if (!mapRef.current || !onLocationChange) return;
    const center = mapRef.current.getCenter();
    onLocationChange(center.lat, center.lng);
  });

  // When the user stops moving the map, call `onLocationChange` with the center coordinates.
  const onMoveEnd = () => {
    if (!mapRef.current || !onLocationChange) return;
    const center = mapRef.current.getCenter();
    onLocationChange(center.lat, center.lng);
  };

  return (
    <div className="relative h-full w-full">
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
        onMoveEnd={onMoveEnd}
      >
        <GeolocateControl />
      </Map>

      {/* Fixed centered marker */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full transform">
        <MarkerIcon />
      </div>
    </div>
  );
}

function MarkerIcon() {
  return (
    <svg
      width="30px"
      height="30px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        fill="#000000"
        fillRule="evenodd"
        d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
