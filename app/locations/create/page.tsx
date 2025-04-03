import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { CreateLocationForm } from '@/components/CreateLocationForm';
import newLocationImage from '@/public/new_location_heading.webp';
import Image from 'next/image';

export default async function CreateLocationPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-zinc-100 p-6 md:p-10">
      {/* Background texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: 0.8,
          backgroundRepeat: 'repeat',
          backgroundSize: '550px',
          backgroundImage: `url("/paper-texture.webp")`,
          mixBlendMode: 'multiply',
        }}
        aria-hidden="true"
      ></div>

      <div className="relative z-10 w-full max-w-sm">
        <Image src={newLocationImage} alt="New Location" width={250} height={250} priority />
        <CreateLocationForm className="mt-5 space-y-5" />
      </div>
    </div>
  );
}
