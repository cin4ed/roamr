import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import type { Location } from '@/types';

async function fetchLocationById(id: string): Promise<Location | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('locations')
    .select('*, location_media(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }

  return data;
}

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const location = await fetchLocationById(id);

  if (!location) {
    return <div className="container mx-auto p-6 text-center">Location not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto h-96 max-w-5xl">
        <Image
          src={location.featured_image || '/placeholder-image.jpg'}
          alt={`Image of ${location.name}`}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center text-background">
          <h1
            className="mb-2 text-balance text-6xl uppercase md:text-7xl"
            style={{ fontFamily: '"Koh Santepheap", sans-serif', fontWeight: 900 }}
          >
            {location.name}
          </h1>
          <p className="text-xl font-light md:text-2xl">
            {location.city
              ? `${location.city}, ${location.country}`
              : 'Location details unavailable'}
          </p>
        </div>
      </div>

      <div className="container relative mx-auto max-w-5xl p-6">
        {/* Description */}
        <p className="mb-8 border-l-4 border-gray-300 pl-4 italic text-gray-700">
          {location.description || 'No description available'}
        </p>
      </div>
    </div>
  );
}
