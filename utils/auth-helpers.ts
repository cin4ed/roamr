import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function authenticateUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
    };
  }

  return { user, error: null };
}
