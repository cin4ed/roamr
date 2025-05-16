'use client';

import Link from 'next/link';
import roamrLogo from '@/public/roamr-logo.png';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { AuthError } from '@/app/auth/callback/route';
import { Suspense } from 'react';

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}

function AuthErrorContent() {
  const searchParams = useSearchParams();

  const error: AuthError = {
    error_code: searchParams.get('error_code') || 'An unknown error occurred during authentication',
    error_description: searchParams.get('error_description') || 'unknown_error',
  };

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
          <Image src={roamrLogo} alt="Roamr Logo" width={175} />
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-semibold">Authentication Error</h2>
              <p className="text-gray-500">There was a problem signing you in</p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">{error.error_description}</p>
              {error.error_code && (
                <p className="text-muted-foreground text-sm">Error code: {error.error_code}</p>
              )}
              <p className="text-muted-foreground text-sm">
                Please try again or contact support if the problem persists.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Link href="/login" passHref legacyBehavior>
                <a className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  Try Again
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
