import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { Location } from '@/types';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);

  async function fetchLocations() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*, location_media (location_id, media_url)');
    if (error) {
      console.error(error);
    } else {
      setLocations(data);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  return { locations };
}
