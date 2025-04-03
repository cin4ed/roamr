import { useState } from 'react';
import type { ProjectionSpecification } from 'react-map-gl/maplibre';

type MapProjection = ProjectionSpecification | 'globe' | null;

export const useMapProjection = () => {
  const [projection, setProjection] = useState<MapProjection>(null);

  return {
    projection,
    setProjection,
  };
};
