'use client';

import { useState, useEffect, useCallback } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Location } from '@/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      className="object-cover w-full h-full"
    />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
  );

const RatingBadge = ({ rating, size = 'small' }: { rating: number; size?: 'small' | 'normal' }) => (
  <div className="flex items-center gap-1">
    <Star className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4 text-yellow-400 fill-yellow-400'} />
    <span>{rating}</span>
  </div>
);

const LocationDetails = ({ location, media, rating, className = '' }: LocationDetailsProps) => (
  <div className={className}>
    <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted mb-2">
      <LocationMedia media={media} alt={location.name} width={230} height={129} />
    </div>
    <h3 className="font-semibold truncate mb-1">{location.name}</h3>
    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{location.description}</p>
    {location.tags && location.tags.length > 0 && (
      <div className="flex items-center gap-2 flex-wrap">
        {location.tags.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    )}
    <div className="flex items-center justify-between mt-2">
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
            className="w-12 h-12 rounded-full border-2 border-black shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-background"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <div className="relative w-full h-full transition-opacity">
              <LocationMedia media={media} alt={location.name} width={100} height={100} />
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <RatingBadge rating={rating} size="small" />
          </div>
        </div>

        {isHovered && !isMobile && (
          <div
            className="fixed bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 bg-background border rounded-lg shadow-lg p-3"
            style={{ zIndex: 1000 }}
          >
            <LocationDetails location={location} media={media} rating={rating} />
          </div>
        )}

        {isMobile && (
          <Dialog open={isTapped} onOpenChange={setIsTapped}>
            <DialogContent className="p-4 sm:p-6 max-h-[calc(100vh-2rem)] overflow-y-auto max-w-full sm:max-w-lg md:max-w-xl w-[calc(100vw-2rem)] sm:w-auto">
              <DialogHeader className="mb-2">
                <DialogTitle>{location.name}</DialogTitle>
              </DialogHeader>
              <LocationDetails location={location} media={media} rating={rating} className="mb-2" />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Marker>
  );
}
