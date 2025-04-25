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
    <div className="drawer-side z-[102] md:hidden">
      <label htmlFor="explore-drawer" className="drawer-overlay"></label>
      <div className="menu bg-base-100 h-full w-[75%] max-w-sm p-4">
        {/* Close button */}
        <div className="flex justify-end">
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image */}
        <div className="card image-full mb-4">
          <figure className="aspect-video">
            <Image
              src={location.featured_image || '/placeholder-image.jpg'}
              alt={location.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </figure>
        </div>

        {/* Title and Location */}
        <div className="card-body p-0">
          <h2 className="card-title text-2xl">{location.name}</h2>
          <p className="text-base-content/70">
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : 'Location details unavailable'}
          </p>
        </div>

        {/* Description */}
        <p className="text-base-content/80 italic">
          {location.description || 'No description available'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {location.tags?.map(tag => (
            <span key={tag} className="badge badge-primary">
              #{tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="card-actions mt-4 justify-between">
          <Link href={`/locations/${location.id}/edit`} className="link link-primary text-sm">
            Edit
          </Link>
          <Link href={`/locations/${location.id}`} className="btn btn-primary">
            View Full Page
          </Link>
        </div>
      </div>
    </div>
  );
}
