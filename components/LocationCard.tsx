import type { Location } from '@/types';
import { cn } from '@/utils/cn';
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
    <div className={cn('bg-white font-[family-name:var(--font-geist-sans)]', className)}>
      {/* Image Container */}
      <div className="relative mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={location.featured_image || '/placeholder-image.jpg'}
          alt={location.name}
          className="h-72 w-full rounded-md object-cover"
        />
        <div className="absolute right-2 top-2">
          <div className="rounded bg-white/90 px-2 py-1 text-sm">#{location.id.slice(0, 8)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/locations/${location.id}/edit`}
          className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
        >
          Edit
        </Link>
        <Link
          href={`/locations/${location.id}`}
          className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
        >
          See More
        </Link>
      </div>

      <hr className="my-4 border-dashed border-primary" />

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {location.tags?.map(tag => (
          <span key={tag.id} className="rounded-md bg-primary px-3 py-1 text-sm italic text-white">
            #{tag.name}
          </span>
        ))}
      </div>

      {/* Location Name */}
      <h2
        className="font-900 mb-2 text-balance text-[3.5rem] leading-[1] text-primary antialiased"
        style={{ fontFamily: '"Koh Santepheap"', fontWeight: 700 }}
      >
        {location.name}
      </h2>

      {/* Location Subtitle */}
      <p className="font- mb-4 text-gray-600">
        {location.city && location.country
          ? `${location.city}, ${location.country}`
          : 'Location details unavailable'}
      </p>

      {/* Description */}
      <p className="mb-6 italic text-gray-700">
        {location.description || 'No description available'}
      </p>

      {/* View Full Page Button */}
      <Link
        href={`/locations/${location.id}`}
        className="rounded bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
      >
        View Full Page
      </Link>
    </div>
  );
}
