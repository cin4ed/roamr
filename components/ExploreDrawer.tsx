import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { formatDistanceToNow } from 'date-fns';
import type { Location } from '@/types';

interface ExploreDrawerProps {
  location: Location;
  onClose: () => void;
}

export default function ExploreDrawer({ location, onClose }: ExploreDrawerProps) {
  return (
    <div className="fixed bottom-0 left-0 top-0 z-[102] w-[75%] max-w-sm overflow-y-auto bg-white shadow-lg md:hidden">
      <div className="space-y-4 p-4">
        {/* Close button */}
        <div className="flex justify-end">
          <button className="rounded-full p-2 hover:bg-gray-100" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={location.featured_image || '/placeholder-image.jpg'}
            alt={location.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Title and Location */}
        <div>
          <h2 className="mb-1 text-2xl font-bold">{location.name}</h2>
          <p className="text-gray-600">
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : 'Location details unavailable'}
          </p>
        </div>

        {/* Description */}
        <p className="italic text-gray-700">{location.description || 'No description available'}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {location.tags?.map(tag => (
            <span key={tag} className="rounded-md bg-primary px-3 py-1 text-sm italic text-white">
              #{tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/locations/${location.id}/edit`}
            className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
          >
            Edit
          </Link>
          <Link
            href={`/locations/${location.id}`}
            className="rounded bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
          >
            View Full Page
          </Link>
        </div>
      </div>
    </div>
  );
}
