import { LoginForm } from '@/components/login-form';
import roamrLogo from '@/public/roamr-logo.png';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-7">
          <Image src={roamrLogo} alt="Roamr Logo" width={175} />
          <LoginForm className="w-full" />
        </div>
      </div>
    </div>
  );
}
