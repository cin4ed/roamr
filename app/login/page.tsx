import { LoginForm } from '@/components/login-form';
import roamrLogo from '@/public/roamr-logo.png';
import Image from 'next/image';

export default function Page() {
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
        <div className="flex flex-col items-center gap-7">
          <Image src={roamrLogo} alt="Roamr Logo" width={175} />
          <LoginForm className="w-full" />
        </div>
      </div>
    </div>
  );
}
