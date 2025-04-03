import { createClient } from '@/utils/supabase/server';

export default async function LocationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: location, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching location:', error);
    return <div className="container mx-auto p-6 text-center">Location not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold">{location.name}</h1>
    </div>
  );
}
