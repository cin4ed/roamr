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

const LocationMedia = ({
  media,
  alt,
  width,
  height,
}: {
  media: string | null;
  alt: string;
  width: number;
  height: number;
}) =>
  media ? (
    <Image
      src={media}
      alt={alt}
      loading="eager"
      priority
      width={width}
      height={height}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
  );

const RatingBadge = ({ rating, size = 'small' }: { rating: number; size?: 'small' | 'normal' }) => (
  <div className="flex items-center gap-1">
    <Star className={size === 'small' ? 'h-3 w-3' : 'h-4 w-4 fill-yellow-400 text-yellow-400'} />
    <span>{rating}</span>
  </div>
);

const LocationDetails = ({ location, media, rating, className = '' }: LocationDetailsProps) => (
  <div className={className}>
    <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-md bg-muted">
      <LocationMedia media={media} alt={location.name} width={230} height={129} />
    </div>
    <h3 className="mb-1 truncate font-semibold">{location.name}</h3>
    <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{location.description}</p>
    {location.tags && location.tags.length > 0 && (
      <div className="flex flex-wrap items-center gap-2">
        {location.tags.map((tag: string) => (
          <div key={tag} className="text-xs">
            {tag}
          </div>
        ))}
      </div>
    )}
    <div className="mt-2 flex items-center justify-between">
      {location.city && location.country ? (
        <div className="text-sm text-muted-foreground">
          {location.city}, {location.country}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p>No location details</p>
        </div>
      )}
      <div className="flex items-center gap-1 text-sm font-medium">
        <RatingBadge rating={rating} size="normal" />
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
  const rating = 4.5; // This would come from location.rating_stats in production

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
            className="h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 border-black bg-background shadow-lg transition-transform hover:scale-110"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <div className="relative h-full w-full transition-opacity">
              <LocationMedia media={media} alt={location.name} width={100} height={100} />
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-background px-1.5 py-0.5 text-xs font-medium shadow-sm">
            <RatingBadge rating={rating} size="small" />
          </div>
        </div>

        {isHovered && !isMobile && (
          <div
            className="fixed bottom-[calc(100%+12px)] left-1/2 w-64 -translate-x-1/2 rounded-lg border bg-background p-3 shadow-lg"
            style={{ zIndex: 1000 }}
          >
            <LocationDetails location={location} media={media} rating={rating} />
          </div>
        )}

        {isMobile && isTapped && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-full overflow-y-auto rounded-lg border bg-background p-4 sm:w-auto sm:max-w-lg sm:p-6 md:max-w-xl">
              <div className="mb-2">
                <h2 className="text-lg font-semibold">{location.name}</h2>
              </div>
              <LocationDetails location={location} media={media} rating={rating} className="mb-2" />
              <button
                onClick={() => setIsTapped(false)}
                className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </Marker>
  );
}
