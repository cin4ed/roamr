import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/server';
import LocationForm from '@/components/LocationForm';

export default async function CreateLocationPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <LocationForm />
    </div>
  );
}
