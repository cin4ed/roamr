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

export default function AuthCodeError() {
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
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription>There was a problem signing you in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We encountered an issue with your authentication code. This could be due to:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>The authentication code has expired</li>
                <li>The code was already used</li>
                <li>There was a network issue</li>
                <li>Our authentication service is experiencing problems</li>
              </ul>
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
