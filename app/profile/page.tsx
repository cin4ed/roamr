'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { signOut } from '@/lib/auth';

export default function ProfilePage() {
  const { session, loading } = useAuth();

  return (
    <div className="flex h-screen w-full justify-center">
      <div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <Link href="/" className="btn btn-link">
              Home
            </Link>
            <Link href="/explore" className="btn btn-link">
              Explore
            </Link>
          </div>
          <button className="btn btn-outline" onClick={signOut}>
            Sign Out
          </button>
        </div>
        <div className="divider"></div>
        {loading && <span>Loading...</span>}
        {session && (
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-20 rounded-full">
                    <img src={session.user.user_metadata.picture} alt="User picture" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold">Kenneth Quintero</p>
                  <p className="text-base-content/60 text-sm">
                    @{session.user.user_metadata.full_name}
                  </p>
                </div>
              </div>
              <button className="btn btn-outline" disabled>
                <Pencil className="scale-90" />
                <span>Edit</span>
              </button>
            </div>
            <div className="divider"></div>
            <div>
              <h2 className="text-base-content/60">📊 Statistics</h2>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-base font-normal">📍 Locations Visited</h3>
                    <p className="text-2xl font-bold">13</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-base font-normal">🗺️ Locations Contributed</h3>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-base font-normal">💬 Locations Reviewed</h3>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
