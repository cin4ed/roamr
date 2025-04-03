import React from 'react';
import Link from 'next/link';

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between bg-primary px-4 py-2 pb-3 text-white">
        <div className="bg-white px-3 text-primary">
          <Link href="/" className="text-sm font-bold">
            Roamr
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-sm underline underline-offset-[.22rem]">
            Home
          </Link>
          <Link href="/explore" className="text-sm underline underline-offset-[.22rem]">
            Map
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
