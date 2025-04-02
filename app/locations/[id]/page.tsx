import { MapPin } from 'lucide-react'; // Example icon import
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import type { Location } from '@/types';

async function fetchLocationById(id: string): Promise<Location | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }

  return data;
}

// Helper component for rating bars
const RatingBar = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-gray-600 mb-1">
      <span>{label}</span>
      {/* Optional: display value */}
      {/* <span>{value}%</span> */}
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default async function LocationDetailPage({ params }: { params: { id: string } }) {
  const location = await fetchLocationById(params.id);

  if (!location) {
    return <div className="container mx-auto p-6 text-center">Location not found.</div>;
  }

  return (
    <div className="bg-[#F5EFE5] min-h-screen">
      <div className="relative h-96 max-w-5xl mx-auto">
        <Image
          src={location.featured_image || '/placeholder-image.jpg'}
          alt={`Image of ${location.name}`}
          layout="fill"
          objectFit="cover"
          className="brightness-75" // Apply a slight dimming like the image
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-[#F5EFE5] p-4 bg-black/30">
          <h1
            className="text-6xl md:text-8xl  mb-2 uppercase"
            style={{ fontFamily: '"Koh Santepheap", sans-serif', fontWeight: 900 }}
          >
            {location.name}
          </h1>
          <p className="text-xl md:text-2xl font-light">
            {location.city
              ? `${location.city}, ${location.country}`
              : 'Location details unavailable'}
          </p>
        </div>
      </div>

      <div className=" container mx-auto max-w-5xl relative p-6">
        {/* Description */}
        <p className="text-gray-700 mb-8 italic border-l-4 border-gray-300 pl-4">
          {location.description || 'No description available'}
        </p>
      </div>
    </div>
  );
}
