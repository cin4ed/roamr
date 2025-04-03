import { LoginForm } from '@/components/login-form';
import roamrLogo from '@/public/roamr-logo.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
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
        <div className="flex flex-col items-center gap-7">
          <Link href="/explore">
            <Image src={roamrLogo} alt="Roamr Logo" width={175} />
          </Link>
          <LoginForm className="w-full" />
        </div>
      </div>
    </div>
  );
}
