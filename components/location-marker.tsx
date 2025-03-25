'use client';

import { useState, useEffect, useCallback } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { createClient } from '@/utils/supabase/client';
import type { Location } from '@/types';
import Image from 'next/image';

interface LocationMarkerProps {
  location: Location;
  onLocationClick?: (location: Location) => void;
  onLocationDoubleClick?: (location: Location) => void;
}

export function LocationMarker({
  location,
  onLocationClick,
  onLocationDoubleClick,
}: LocationMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const [media, setMedia] = useState<string | null>(null);
  // const rating =
  //   location.rating_stats && location.rating_stats.length > 0
  //     ? location.rating_stats[0].average_rating
  //     : 0;
  const rating = 4.5;

  const getFeaturedMedia = useCallback(async () => {
    const featuredMedia =
      location.location_media && location.location_media.length > 0
        ? location.location_media[0].media_url
        : null;

    if (!featuredMedia) return;

    const supabase = await createClient();
    const { data } = await supabase.storage.from('media').getPublicUrl(featuredMedia);

    console.log(data);

    setMedia(data.publicUrl);
  }, [location]);

  useEffect(() => {
    getFeaturedMedia();
  }, [getFeaturedMedia]);

  return (
    <Marker
      longitude={Number(location.longitude)}
      latitude={Number(location.latitude)}
      anchor="bottom"
      // style={{ zIndex: isHovered ? 999 : 100 }}
    >
      <div className="relative w-12 h-12 bg-red-500"></div>
      {/* <div
        className="relative"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        style={{ zIndex: isHovered ? 999 : 1 }}
      >
        <div className="relative flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-full border-2 border-black shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-background"
            onClick={e => {
              e.stopPropagation();
              onLocationClick?.(location);
            }}
            onDoubleClick={e => {
              e.stopPropagation();
              onLocationDoubleClick?.(location);
            }}
          >
            <div className="relative w-full h-full transition-opacity">
              {media ? (
                <Image
                  src={media}
                  alt={location.name}
                  loading="eager"
                  priority
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
              )}
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <Star className="w-3 h-3" />
            <span>{rating}</span>
          </div>
        </div>

        {isHovered && !isMobile && (
          <div
            className="fixed bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 bg-background border rounded-lg shadow-lg p-3"
            style={{ zIndex: 1000 }}
          >
            <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted mb-2">
              {media ? (
                <Image
                  src={media}
                  alt={location.name}
                  className="object-cover w-full h-full"
                  width={230}
                  height={129}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
              )}
            </div>
            <h3 className="font-semibold truncate mb-1">{location.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {location.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {location.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
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
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {rating}
              </div>
            </div>
          </div>
        )}
      </div> */}
    </Marker>
  );
}
