import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function CreateLocationPage() {
  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login page
  if (authError || !user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Location</h1>
      <div className="bg-card p-6 rounded-lg shadow">
        <p>Location creation form will be added here.</p>
      </div>
    </div>
  );
}
