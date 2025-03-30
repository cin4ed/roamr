'use client';

import { useRef, useCallback } from 'react';
import { useLocations } from '@/hooks/useLocations';
import Map, { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map as MapIcon, Satellite, RotateCcw, Globe, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationMarker } from '@/components/location-marker';
import { cn } from '@/utils/cn';
import type { Location } from '@/types';
import { useGlobeSpinning } from '@/hooks/useGlobeSpinning';
import { useMapStyle } from '@/hooks/useMapStyle';
import { useMapProjection } from '@/hooks/useMapProjection';

export default function ExploreMap({ className }: { className?: string }) {
  const mapRef = useRef<MapRef>(null);
  const { locations } = useLocations();
  const { currentStyle, isVectorStyle, toggleStyle } = useMapStyle();
  const { currentProjection, isMercator, toggleProjection } = useMapProjection();
  const { spinGlobe, userInteracted, handleUserInteraction, resetInteraction } =
    useGlobeSpinning(mapRef);

  const handleOnLocationClick = useCallback((location: Location) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      duration: 1000,
      essential: true,
    });
  }, []);

  const flyToLocation = useCallback((location: Location) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
    });
  }, []);

  const mapProps = {
    id: 'main',
    initialViewState: {
      longitude: -100,
      latitude: 40,
      zoom: 0.7,
    },
    minZoom: 0.7,
    maxZoom: 15.9,
    style: { width: '100%', height: '100%' },
    cursor: 'grab',
    projection: currentProjection,
    mapStyle: currentStyle,
  };

  // Only use spinGlobe animation when in globe projection
  const handleMapLoad = useCallback(() => {
    if (!isMercator) {
      spinGlobe();
    }
  }, [isMercator, spinGlobe]);

  const handleMapMoveEnd = useCallback(() => {
    if (!isMercator) {
      spinGlobe();
    }
  }, [isMercator, spinGlobe]);

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
        onLoad={handleMapLoad}
        onMoveEnd={handleMapMoveEnd}
        onTouchStart={handleUserInteraction}
        onMouseDown={handleUserInteraction}
      >
        {locations.map(location => (
          <LocationMarker
            key={location.id}
            location={location}
            onLocationDoubleClick={flyToLocation}
            onLocationClick={handleOnLocationClick}
          />
        ))}
      </Map>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <MapStyleButton isVectorStyle={isVectorStyle} onToggle={toggleStyle} />
        <ProjectionButton isMercator={isMercator} onToggle={toggleProjection} />
        {!isMercator && userInteracted && (
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
      {isVectorStyle ? <Layers className="w-4 h-4" /> : <Satellite className="w-4 h-4" />}
    </Button>
  );
}

function ProjectionButton({ isMercator, onToggle }: { isMercator: boolean; onToggle: () => void }) {
  return (
    <Button variant="outline" onClick={onToggle}>
      {isMercator ? <Globe className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
    </Button>
  );
}
