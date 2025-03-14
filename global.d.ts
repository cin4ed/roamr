import type { Database as DB } from '@/types/database.types';

declare global {
  type Database = DB;
  type Location = DB['public']['Tables']['locations']['Row'];
}
