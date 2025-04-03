import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import type { Location } from '@/types';
import Markdown from 'react-markdown';
import breakPlugin from 'remark-breaks';
import '@fontsource/koh-santepheap/900.css';

async function fetchLocationById(id: string): Promise<Location | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('locations')
    .select('*, location_media(*), location_revisions!fk_latest_revision(*), tags(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }

  const { data: content, error: contentError } = await supabase
    .from('location_content')
    .select('*')
    .eq('id', data!.location_revisions!.location_content_id)
    .single();

  if (contentError) {
    console.error('Error fetching location content:', contentError);
    return null;
  }

  return {
    ...data,
    content: content,
  };
}

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const location = await fetchLocationById(id);

  if (!location) {
    return <div className="container mx-auto p-6 text-center">Location not found.</div>;
  }

  console.log(location);

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
            className="mb-2 max-w-2xl text-balance text-6xl uppercase md:text-7xl"
            style={{ fontFamily: '"Koh Santepheap"', fontWeight: 900 }}
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {location.tags.map(tag => (
              <span
                key={tag.id}
                className="rounded-md bg-primary px-3 py-1 text-sm italic text-white"
              >
                #{tag.name}
              </span>
            ))}
          </div>
          <p>{location.description || 'No description available'}</p>
          <div className="markdown">
            <Markdown remarkPlugins={[breakPlugin]}>
              {location.content?.content?.replace(/\\n/g, '\n') || ''}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
