import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import type { Location } from '@/types';
import Markdown from 'react-markdown';
import breakPlugin from 'remark-breaks';
import '@fontsource/koh-santepheap/900.css';
import Link from 'next/link';
import { cn } from '@/utils/cn';

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

  return (
    <div
      className={cn(
        'container mx-auto min-h-screen max-w-5xl space-y-4 bg-white font-[family-name:var(--font-geist-sans)]'
      )}
    >
      <div className="relative h-96">
        <Image
          src={location.featured_image || '/placeholder-image.jpg'}
          alt={`Image of ${location.name}`}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center text-background">
          <h1
            className="mb-2 max-w-2xl text-balance text-[3.5rem] leading-[1] antialiased md:text-[4.5rem]"
            style={{ fontFamily: '"Koh Santepheap"', fontWeight: 700 }}
          >
            {location.name}
          </h1>
          <p className="text-xl font-light md:text-2xl">
            {location.city
              ? `${location.city}, ${location.country}`
              : 'Location details unavailable'}
          </p>
        </div> */}
      </div>
      <div className="flex justify-between">
        <div>
          <Link
            href={`/locations/explore?location=${id}`}
            className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
          >
            Show on map
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/locations/${id}/edit`}
            className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
          >
            Edit
          </Link>
          <Link
            href={`/locations/${id}/history`}
            className="text-sm text-primary underline underline-offset-[.22rem] hover:no-underline"
          >
            History
          </Link>
        </div>
      </div>

      <hr className="my-4 border-dashed border-primary" />

      <div className="container relative mx-auto max-w-5xl">
        <div className="flex flex-col gap-4">
          {/* <div className="flex flex-wrap gap-2">
            {location.tags.map(tag => (
              <span
                key={tag.id}
                className="rounded-md bg-primary px-3 py-1 text-sm italic text-white"
              >
                #{tag.name}
              </span>
            ))}
          </div>
          <p className="italic text-gray-700">
            {location.description || 'No description available'}
          </p> */}
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
