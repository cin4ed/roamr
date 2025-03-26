import { Compass /*Star */ } from 'lucide-react';
// import Image from 'next/image';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { formatDistanceToNow } from 'date-fns';
import type { Location } from '@/types';

export default function ExploreDrawer({ location }: { location: Location }) {
  return (
    <>
      {/* Mobile Drawer */}
      <div className="fixed top-0 left-0 right-0 bg-background border-t  justify-around items-center h-[calc(100vh-9rem)] px-4 z-[102] md:hidden">
        <div className="space-y-4">
          {/* Title and Rating */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{location.name}</h2>
            <div className="flex items-center gap-1">
              {/* {location.rating_stats &&
              Array.isArray(location.rating_stats) &&
              location.rating_stats.length > 0 ? (
                <>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{location.rating_stats[0].average_rating}</span>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">No ratings yet</span>
              )} */}
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted mb-4">
            {/* {location.location_images && location.location_images.length > 0 ? (
              <Image
                src={location.location_images[0].image_url}
                alt={location.name}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            ) : (
              <div className=" inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
            )} */}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{location.city}</span>
            {location.city && location.country && <span>•</span>}
            <span>{location.country}</span>
          </div>

          {/* <div className="space-y-2">
            <h3 className="font-semibold">Reviews</h3>
            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {location.location_ratings.map(review => (
                    <div key={review.id} className="flex flex-col gap-2 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={review.user?.image} alt={review.user?.name || ''} />
                          <AvatarFallback>{review.user?.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{review.user?.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs">{review.rating}</span>
                          </div>
                        </div>
                        <time className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </time>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </ScrollArea>
          </div> */}
        </div>
      </div>

      {/* Desktop Drawer */}
      <div className="fixed bottom-24 left-0 right-0 bg-background border-t justify-around items-center h-24 px-4 z-[102] hidden md:flex">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Compass className="w-6 h-6" />
          <span className="text-xs">Explore</span>
        </button>
      </div>
    </>
  );
}
