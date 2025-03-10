"use client";

import { useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import type { Database } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

type Location = Database["public"]["Tables"]["locations"]["Row"];

interface LocationMarkerProps {
    location: Location;
    onLocationClick?: (location: Location) => void;
    onLocationDoubleClick?: (location: Location) => void;
}

export function LocationMarker({ location, onLocationClick, onLocationDoubleClick }: LocationMarkerProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useIsMobile();

    const rating = location.rating_stats && location.rating_stats.length > 0 ? location.rating_stats[0].average_rating : 0;

    if (!location.longitude || !location.latitude) return null;

    return (
        <Marker
            longitude={Number(location.longitude)}
            latitude={Number(location.latitude)}
            anchor="bottom"
        >
            <div
                className="relative opacity-80 hover:opacity-100 transition-opacity"
                onMouseEnter={() => !isMobile && setIsHovered(true)}
                onMouseLeave={() => !isMobile && setIsHovered(false)}
            >
                {/* Marker with Preview Image */}
                <div className="relative flex flex-col items-center">
                    <div 
                        className="w-12 h-12 rounded-full border-2 border-black shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-background"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLocationClick?.(location);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            onLocationDoubleClick?.(location);
                        }}
                    >
                        {/* Location preview image */}
                        <div className="relative w-full h-full transition-opacity">
                            {location.location_images && location.location_images.length > 0 ? (
                                <Image
                                    src={location.location_images[0].image_url}
                                    alt={location.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                // Fallback gradient background when no image is available
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
                            )}
                        </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <Star className="w-3 h-3" />
                        <span>{rating}</span>
                    </div>
                </div>

                {/* Preview Card */}
                {isHovered && !isMobile && (
                    <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 bg-background border rounded-lg shadow-lg p-3 z-10">
                        <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted mb-2">
                            {location.location_images && location.location_images.length > 0 ? (
                                <Image
                                    src={location.location_images[0].image_url}
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
                            {location.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="text-sm text-muted-foreground">
                                {location.city}, {location.country}
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {rating}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Marker>
    );
} 