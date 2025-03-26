import { useState, useCallback, useEffect } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

export const useGlobeSpinning = (mapRef: React.RefObject<MapRef | null>) => {
  const [userInteracted, setUserInteracted] = useState(false);

  const spinGlobe = useCallback(() => {
    if (!mapRef.current || userInteracted) return;

    const secondsPerRevolution = 80;
    const distancePerSecond = 360 / secondsPerRevolution;
    const center = mapRef.current.getCenter();
    center.lng -= distancePerSecond;

    mapRef.current.easeTo({ center, duration: 1000, easing: n => n });
  }, [mapRef, userInteracted]);

  const resetInteraction = useCallback(() => {
    setUserInteracted(false);
  }, []);

  const handleUserInteraction = useCallback(() => {
    setUserInteracted(true);
  }, []);

  useEffect(() => {
    if (!userInteracted) {
      spinGlobe();
    }
  }, [userInteracted, spinGlobe]);

  return {
    spinGlobe,
    userInteracted,
    handleUserInteraction,
    resetInteraction,
  };
};
