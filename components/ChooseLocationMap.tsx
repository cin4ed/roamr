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
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: initialLongitude,
        latitude: initialLatitude,
        zoom: initialZoom,
      }}
      maxZoom={15.9}
      style={{ width: '100%', height: '100%' }}
      mapStyle={roamrMapStyle}
      onMoveEnd={handleMapMove}
      onDrag={handleMapMove}
    >
      {/* Center Marker */}
      <Marker
        latitude={centerCoordinates.latitude}
        longitude={centerCoordinates.longitude}
        anchor="bottom"
      >
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white" />
      </Marker>
    </Map>
  );
}
