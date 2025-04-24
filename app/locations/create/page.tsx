import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/server';
import { CreateLocationForm } from '@/components/CreateLocationForm';
import newLocationImage from '@/public/new_location_heading.webp';
import Image from 'next/image';

export default async function CreateLocationPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-zinc-100 p-6 md:p-10">
      <div className="relative z-10 w-full max-w-sm">
        <Image src={newLocationImage} alt="New Location" width={250} height={250} priority />
        <CreateLocationForm className="mt-5 space-y-5" />
      </div>
    </div>
  );
}
