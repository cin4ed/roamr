import type { Location } from '@/types';
import { cn } from '@/lib/cn';
import Link from 'next/link';

import '@fontsource/koh-santepheap/700.css';
import '@fontsource/koh-santepheap/900.css';

export default function LocationCard({
  location,
  className,
}: {
  location: Location;
  className?: string;
}) {
  return (
    <div className={cn('card bg-base-100 shadow-xl', className)}>
      {/* Image Container */}
      <figure className="relative">
        <img
          src={location.featured_image || '/placeholder-image.jpg'}
          alt={location.name}
          className="h-72 w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="badge badge-neutral">#{location.id.slice(0, 8)}</div>
        </div>
      </figure>

      <div className="card-body p-4">
        {/* Quick Actions */}
        <div className="card-actions justify-between">
          <Link href={`/locations/${location.id}/edit`} className="link link-primary text-sm">
            Edit
          </Link>
          <Link href={`/locations/${location.id}`} className="link link-primary text-sm">
            See More
          </Link>
        </div>

        <div className="divider divider-primary"></div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {location.tags?.map(tag => (
            <span key={tag.id} className="badge badge-primary">
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Location Name */}
        <h2
          className="card-title text-primary text-4xl font-bold"
          style={{ fontFamily: '"Koh Santepheap"', fontWeight: 700 }}
        >
          {location.name}
        </h2>

        {/* Location Subtitle */}
        <p className="text-base-content/70">
          {location.city && location.country
            ? `${location.city}, ${location.country}`
            : 'Location details unavailable'}
        </p>

        {/* Description */}
        <p className="text-base-content/80 italic">
          {location.description || 'No description available'}
        </p>

        {/* View Full Page Button */}
        <div className="card-actions justify-end">
          <Link href={`/locations/${location.id}`} className="btn btn-primary">
            View Full Page
          </Link>
        </div>
      </div>
    </div>
  );
}
