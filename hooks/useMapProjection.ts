import { useState } from 'react';
import { ProjectionSpecification } from 'react-map-gl/maplibre';

export const useMapProjection = () => {
  const [isMercator, setIsMercator] = useState(true);

  return {
    currentProjection: (isMercator ? 'mercator' : 'globe') as 'mercator' | 'globe',
    isMercator,
    toggleProjection: () => setIsMercator(prev => !prev),
  };
};
