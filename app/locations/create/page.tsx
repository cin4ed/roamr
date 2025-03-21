import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { CreateLocationForm } from '@/components/CreateLocationForm';
import Image from 'next/image';
import newLocationImage from '@/public/new_location_heading.webp';

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
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-100 overflow-hidden">
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0.8,
          backgroundRepeat: 'repeat',
          backgroundSize: '550px',
          backgroundImage: `url("/paper-texture.webp")`,
          mixBlendMode: 'multiply',
        }}
        aria-hidden="true"
      ></div>

      <div className="w-full max-w-sm relative z-10">
        <Image src={newLocationImage} alt="New Location" width={250} height={250} priority />
        <CreateLocationForm className="space-y-5 mt-5" />
      </div>
    </div>
  );
}
