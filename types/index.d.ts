import type { Database } from '@/types/database.types';

export type Location = Database['public']['Tables']['locations']['Row'] & {
  location_media: Database['public']['Tables']['location_media']['Row'][];
  tags: Database['public']['Tables']['tags']['Row'][];
  content: Database['public']['Tables']['location_content']['Row'];
  creator?: {
    username: string;
    avatar_url: string | null;
  };
};
