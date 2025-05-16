import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import { Pencil, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';

// Function to get high resolution Google profile picture
function getHighResProfilePicture(url: string, useOriginal: boolean = false): string {
  if (url.includes('googleusercontent.com') && url.includes('=s96-c')) {
    // Either use a specific size or remove the size parameter for original quality
    return useOriginal ? url.replace('=s96-c', '') : url.replace('=s96-c', '=s128-c');
  }
  return url;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  const user = session.user;
  console.log(user);

  // Fetch profile data for the current user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Using 512px version for better performance while maintaining good quality
  const profilePicture = getHighResProfilePicture(user.user_metadata.picture);

  // If you want the original quality, you can use:
  // const profilePicture = getHighResProfilePicture(user.user_metadata.picture, true);

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <div className="navbar bg-base-100 rounded-box mb-8 shadow">
          <div className="flex-1">
            <Link href="/explore" className="btn btn-ghost text-xl normal-case">
              <MapPin className="mr-2 h-5 w-5" />
              Map
            </Link>
          </div>
          <div className="flex-none">
            <button className="btn btn-ghost" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              {/* Profile Picture */}
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-32 overflow-hidden rounded-full ring ring-offset-2">
                  <Image
                    src={profilePicture}
                    alt="User picture"
                    width={512}
                    height={512}
                    className="rounded-full object-cover"
                    priority
                    quality={100}
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="card-title mb-2 text-3xl">
                  {profile?.username || session.user.user_metadata.full_name}
                  <button className="btn btn-circle btn-sm btn-outline ml-2" disabled>
                    <Pencil className="h-4 w-4" />
                  </button>
                </h2>
                <p className="text-base-content/60 mb-4 text-lg">
                  @{profile?.username || session.user.user_metadata.full_name}
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-base-content/60 h-5 w-5" />
                    <span className="text-base-content/60">Joined 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="divider"></div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Places Visited</div>
                <div className="stat-value">0</div>
                <div className="stat-desc">Start exploring!</div>
              </div>
              <div className="stat">
                <div className="stat-title">Reviews</div>
                <div className="stat-value">0</div>
                <div className="stat-desc">Share your experiences</div>
              </div>
              <div className="stat">
                <div className="stat-title">Lists</div>
                <div className="stat-value">0</div>
                <div className="stat-desc">Create your first list</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
