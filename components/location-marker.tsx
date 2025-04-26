'use client';

import { useState, useEffect, useCallback } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Location } from '@/types';
import Image from 'next/image';

interface LocationMarkerProps {
  location: Location;
  onLocationClick?: (location: Location) => void;
  onLocationDoubleClick?: (location: Location) => void;
}

interface LocationDetailsProps {
  location: Location;
  media: string | null;
  rating: number;
  className?: string;
}

const RatingBadge = ({ rating, size = 'small' }: { rating: number; size?: 'small' | 'normal' }) => (
  <div className="badge badge-primary gap-1">
    <Star className={size === 'small' ? 'h-3 w-3' : 'h-4 w-4'} />
    <span>{rating}</span>
  </div>
);

const LocationDetails = ({ location, media, rating, className = '' }: LocationDetailsProps) => (
  <div className={`card ${className}`}>
    <div className="card-body p-0">
      <div className="rounded-box relative aspect-video w-full overflow-hidden">
        <LocationMedia media={media} alt={location.name} width={230} height={129} />
      </div>
      <div className="p-3">
        <h3 className="card-title mb-1 text-base">{location.name}</h3>
        <p className="text-base-content/70 mb-2 line-clamp-2 text-sm">{location.description}</p>
        {location.tags && location.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {location.tags.map((tag: { name: string }) => (
              <div key={tag.name} className="badge badge-outline badge-sm">
                {tag.name}
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          {location.city && location.country ? (
            <div className="text-base-content/70 text-sm">
              {location.city}, {location.country}
            </div>
          ) : (
            <div className="text-base-content/70 text-sm">
              <p>No location details</p>
            </div>
          )}
          <RatingBadge rating={rating} size="normal" />
        </div>
      </div>
    </div>
  </div>
);

export function LocationMarker({
  location,
  onLocationClick,
  onLocationDoubleClick,
}: LocationMarkerProps) {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [media, setMedia] = useState<string | null>(null);

  const getFeaturedMedia = useCallback(() => {
    const featuredMedia =
      location.location_media && location.location_media.length > 0
        ? location.location_media[0].media_url
        : null;

    setMedia(featuredMedia);
  }, [location]);

  useEffect(() => {
    getFeaturedMedia();
  }, [getFeaturedMedia]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setIsTapped(!isTapped);
    }
    onLocationClick?.(location);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLocationDoubleClick?.(location);
  };

  return (
    <Marker
      longitude={Number(location.longitude)}
      latitude={Number(location.latitude)}
      anchor="bottom"
      style={{ zIndex: isHovered || isTapped ? 100 : 1 }}
    >
      <div
        className="relative"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        style={{ zIndex: isHovered || isTapped ? 999 : 1 }}
      >
        <div className="relative flex flex-col items-center">
          <div
            className="avatar cursor-pointer transition-transform hover:scale-110"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <div className="w-8 rounded ring">
              {media ? (
                <Image
                  src={media}
                  alt={location.name}
                  width={18}
                  height={18}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="from-primary/20 to-primary/40 absolute inset-0 bg-gradient-to-br" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Marker>
  );
}
