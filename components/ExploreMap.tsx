'use client';

import { useState } from 'react';
import Map, { ProjectionSpecification, Source } from 'react-map-gl/maplibre';
import { mapStyleVector, mapStyleRaster } from '@/utils/map';
import { Map as MapIcon, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocations } from '@/hooks/useLocations';
import { LocationMarker } from '@/components/location-marker';
import { cn } from '@/utils/cn';

export default function ExploreMap({ className }: { className?: string }) {
  const [isVectorStyle, setIsVectorStyle] = useState(true);
  const { locations } = useLocations();

  console.log(locations);

  const mapProps = {
    id: 'main',
    initialViewState: {
      longitude: -100,
      latitude: 40,
      zoom: 3.5,
    },
    maxZoom: 15.9,
    style: { width: '500px', height: '500px' },
    cursor: 'grab',
    projection: 'globe' as ProjectionSpecification,
    mapStyle: isVectorStyle ? mapStyleVector : mapStyleRaster,
  };

  return (
    <div className={cn('', className)}>
      <Map {...mapProps}>
        <Source
          id="world-imagery"
          type="raster"
          tiles={[
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ]}
          tileSize={256}
        />
        {locations.map(location => (
          <LocationMarker key={location.id} location={location} />
        ))}
      </Map>
      {/* <div className="absolute top-4 right-4 flex flex-col gap-2">
        <MapStyleButton onToggle={setIsVectorStyle} />
      </div> */}
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
