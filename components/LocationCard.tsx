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
          className="w-full h-72 object-cover rounded-md"
        />
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 rounded px-2 py-1 text-sm">#{location.id.slice(0, 8)}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href={`/locations/${location.id}/edit`}
          className="text-primary underline text-sm underline-offset-[.22rem] hover:no-underline"
        >
          Edit
        </Link>
        <Link
          href={`/locations/${location.id}`}
          className="text-primary underline text-sm underline-offset-[.22rem] hover:no-underline"
        >
          See More
        </Link>
      </div>

      <hr className="my-4 border-primary border-dashed" />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {location.tags?.map(tag => (
          <span key={tag} className="bg-primary text-white px-3 py-1 rounded-md text-sm italic">
            #{tag}
          </span>
        ))}
      </div>

      {/* Location Name */}
      <h2
        className="font-900 text-balance text-[3.5rem] leading-[1] mb-2 text-primary antialiased"
        style={{ fontFamily: '"Koh Santepheap"', fontWeight: 700 }}
      >
        {location.name}
      </h2>

      {/* Location Subtitle */}
      <p className="text-gray-600 font- mb-4">
        {location.city && location.country
          ? `${location.city}, ${location.country}`
          : 'Location details unavailable'}
      </p>

      {/* Description */}
      <p className="text-gray-700 mb-6 italic">
        {location.description || 'No description available'}
      </p>

      {/* View Full Page Button */}
      <Link
        href={`/locations/${location.id}`}
        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
      >
        View Full Page
      </Link>
    </div>
  );
}
