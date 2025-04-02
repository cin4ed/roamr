'use client';

import { useRef, useCallback } from 'react';
import { useLocations } from '@/hooks/useLocations';
import Map, { ProjectionSpecification, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map as MapIcon, Satellite, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationMarker } from '@/components/location-marker';
import { cn } from '@/utils/cn';
import type { Location } from '@/types';
import { useGlobeSpinning } from '@/hooks/useGlobeSpinning';
import { useMapStyle } from '@/hooks/useMapStyle';
import { useMapProjection } from '@/hooks/useMapProjection';

interface ExploreMapProps extends React.HTMLAttributes<HTMLDivElement> {
  onLocationClick: (location: Location) => void;
}

export default function ExploreMap({ className, onLocationClick }: ExploreMapProps) {
  const mapRef = useRef<MapRef>(null);
  const { locations } = useLocations();
  const { currentStyle, isVectorStyle, toggleStyle } = useMapStyle();
  const { spinGlobe, userInteracted, handleUserInteraction, resetInteraction } =
    useGlobeSpinning(mapRef);

  const handleOnLocationClick = useCallback(
    (location: Location) => {
      mapRef.current?.flyTo({
        center: [location.longitude, location.latitude],
        duration: 1000,
        essential: true,
      });

      onLocationClick(location);
    },
    [onLocationClick]
  );

  const flyToLocation = useCallback((location: Location) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
    });
  }, []);

  const panToLocation = useCallback((location: Location) => {
    mapRef.current?.panTo([location.longitude, location.latitude], {
      duration: 1000,
      easing: n => n,
    });
  }, []);

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
    mapStyle: currentStyle,
  };

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
        onMouseDown={handleUserInteraction}
      >
        {locations.map(location => (
          <LocationMarker
            key={location.id}
            location={location}
            onLocationDoubleClick={flyToLocation}
            onLocationClick={panToLocation}
          />
        ))}
      </Map>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <MapStyleButton isVectorStyle={isVectorStyle} onToggle={toggleStyle} />
        {userInteracted && (
          <Button variant="outline" onClick={resetInteraction}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function MapStyleButton({
  isVectorStyle,
  onToggle,
}: {
  isVectorStyle: boolean;
  onToggle: () => void;
}) {
  return (
    <Button variant="outline" onClick={onToggle}>
      {isVectorStyle ? <MapIcon /> : <Satellite />}
    </Button>
  );
}
