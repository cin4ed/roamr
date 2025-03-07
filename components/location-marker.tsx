"use client";

import { useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import type { Database } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

type Location = Database["public"]["Tables"]["locations"]["Row"];

interface LocationMarkerProps {
    location: Location;
}

export function LocationMarker({ location }: LocationMarkerProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Temporary rating for demo - we'll add this to the database later
    const rating = 4.5;

    if (!location.longitude || !location.latitude) return null;

    return (
        <Marker
            longitude={Number(location.longitude)}
            latitude={Number(location.latitude)}
            anchor="bottom"
        >
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Marker with Preview Image */}
                <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-background shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-background">
                        {/* Placeholder gradient background when no image is available */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full" />

                        {/* Location preview image - we'll replace the src when we add images */}
                        <div className="relative w-full h-full opacity-80 hover:opacity-100 transition-opacity">
                            <Image
                                src="/placeholder-location.jpg"
                                alt={location.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute -bottom-6 right-0.5 bg-background text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <Star className="w-3 h-3" />
                        <span>{rating}</span>
                    </div>

                    {/* Triangle pointer
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-black -mt-0.5" /> */}
                </div>

                {/* Preview Card */}
                {isHovered && (
                    <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 bg-background border rounded-lg shadow-lg p-3 z-10">
                        <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted mb-2">
                            {/* We'll use the same placeholder for now */}
                            <Image
                                src="/placeholder-location.jpg"
                                alt={location.name}
                                fill
                                className="object-cover"
                            />
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