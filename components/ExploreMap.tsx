'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocations } from '@/hooks/useLocations';
import Map, { ProjectionSpecification, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyleVector, mapStyleRaster } from '@/utils/map';
import { Map as MapIcon, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationMarker } from '@/components/location-marker';
import { cn } from '@/utils/cn';

export default function ExploreMap({ className }: { className?: string }) {
  const [isVectorStyle, setIsVectorStyle] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const { locations } = useLocations();
  const mapRef = useRef<MapRef>(null);

  const mapProps = {
    id: 'main',
    initialViewState: {
      longitude: -100,
      latitude: 40,
      zoom: 2,
    },
    minZoom: 2,
    maxZoom: 15.9,
    style: { width: '100%', height: '100%' },
    cursor: 'grab',
    projection: 'globe' as ProjectionSpecification,
    mapStyle: isVectorStyle ? mapStyleVector : mapStyleRaster,
  };

  const spinGlobe = useCallback(() => {
    if (!mapRef.current || userInteracted) return;
    console.log('LOG: spinGlobe');
    const secondsPerRevolution = 80;
    const distancePerSecond = 360 / secondsPerRevolution;
    const center = mapRef.current.getCenter();
    center.lng -= distancePerSecond;
    mapRef.current.easeTo({ center, duration: 1000, easing: n => n });
  }, [mapRef, userInteracted]);

  return (
    <div
      className={cn(className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,53,201,1) 8%, rgba(0,32,103,1) 17%, rgba(8,15,56,1) 30%, rgba(0,7,28,1) 80%)',
      }}
    >
      <Map
        {...mapProps}
        ref={mapRef}
        onLoad={spinGlobe}
        onMoveEnd={spinGlobe}
        onMouseDown={() => {
          console.log('LOG: onMouseDown');
          setUserInteracted(true);
        }}
      >
        {locations.map(location => (
          <LocationMarker key={location.id} location={location} />
        ))}
      </Map>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <MapStyleButton onToggle={setIsVectorStyle} />
      </div>
    </div>
  );
}

function MapStyleButton({ onToggle }: { onToggle: (isVectorStyle: boolean) => void }) {
  const [isVectorStyle, setIsVectorStyle] = useState(true);

  const handleToggle = () => {
    setIsVectorStyle(!isVectorStyle);
    onToggle(isVectorStyle);
  };

  return (
    <Button variant="outline" onClick={handleToggle}>
      {isVectorStyle ? <Satellite /> : <MapIcon />}
    </Button>
  );
}
