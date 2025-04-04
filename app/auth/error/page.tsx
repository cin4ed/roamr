'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription>There was a problem signing you in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{error.error_description}</p>
              {error.error_code && (
                <p className="text-sm text-muted-foreground">Error code: {error.error_code}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Please try again or contact support if the problem persists.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/login" passHref>
                <Button>Try Again</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
