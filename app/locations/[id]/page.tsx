export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Location } from '@/types';
import Markdown from 'react-markdown';
import breakPlugin from 'remark-breaks';
import '@fontsource/koh-santepheap/900.css';
import Link from 'next/link';

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
    <>
      <div className="relative h-96">
        <Image
          src={location.featured_image || '/placeholder-image.jpg'}
          alt={`Image of ${location.name}`}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
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
      <div className="markdown">
        <Markdown remarkPlugins={[breakPlugin]}>
          {location.content?.content?.replace(/\\n/g, '\n') || ''}
        </Markdown>
      </div>
    </>
  );
}
