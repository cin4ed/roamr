import { useState } from 'react';
import { mapStyleVector, mapStyleRaster } from '@/utils/map';

export const useMapStyle = () => {
  const [isVectorStyle, setIsVectorStyle] = useState(true);

  return {
    currentStyle: isVectorStyle ? mapStyleVector : mapStyleRaster,
    isVectorStyle,
    toggleStyle: () => setIsVectorStyle(prev => !prev),
  };
};
