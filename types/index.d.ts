import type { Database } from '@/types/database.types';

export type Location = Database['public']['Tables']['locations']['Row'] & {
  location_media: Database['public']['Tables']['location_media']['Row'][];
};
