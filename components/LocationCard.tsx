import type { Location } from '@/types';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import '@fontsource/koh-santepheap/700.css';
import '@fontsource/koh-santepheap/900.css';

export default function LocationCard({
  location,
  className,
  onClose,
}: {
  location: Location;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div className={cn('relative h-full', className)}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-circle btn-ghost btn-sm absolute top-2 right-2 z-50"
          aria-label="Close location card"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="card bg-base-100 flex h-full flex-col">
        {/* Image Container */}
        <figure>
          <Image
            src={location.featured_image || '/placeholder-image.jpg'}
            alt={location.name}
            width={500}
            height={500}
            className="h-72 w-full object-cover"
          />
        </figure>
        <div className="flex flex-1 flex-col p-4">
          {/* Quick Actions */}
          <div className="card-actions justify-between">
            <Link href={`/locations/${location.id}/edit`} className="link link-primary text-sm">
              Suggest Edit
            </Link>
          </div>
          <div className="divider my-1"></div>

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
          <p className="text-base-content/80 mt-4 flex-1 italic">
            {location.description || 'No description available'}
          </p>

          {/* View Full Page Button */}
          <div className="card-actions mt-4 justify-end">
            <Link href={`/locations/${location.id}`} className="btn btn-primary">
              View Full Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
