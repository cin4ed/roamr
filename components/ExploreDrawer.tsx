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
    <div className="fixed top-0 left-0 bottom-0 w-[75%] max-w-sm bg-white shadow-lg z-[102] md:hidden overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Close button */}
        <div className="flex justify-end">
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
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
          <h2 className="text-2xl font-bold mb-1">{location.name}</h2>
          <p className="text-gray-600">
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : 'Location details unavailable'}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 italic">{location.description || 'No description available'}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {location.tags?.map(tag => (
            <span key={tag} className="bg-primary text-white px-3 py-1 rounded-md text-sm italic">
              #{tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex justify-between items-center pt-2">
          <Link
            href={`/locations/${location.id}/edit`}
            className="text-primary underline text-sm underline-offset-[.22rem] hover:no-underline"
          >
            Edit
          </Link>
          <Link
            href={`/locations/${location.id}`}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            View Full Page
          </Link>
        </div>
      </div>
    </div>
  );
}
