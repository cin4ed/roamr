import { getUser } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect('/explore');
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
