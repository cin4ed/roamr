import { getUser } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import SignupForm from '@/components/SignupForm';

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect('/explore');
  }

  return <SignupForm />;
}
