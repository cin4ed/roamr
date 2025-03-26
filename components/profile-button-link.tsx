import Link from 'next/link';
import Image from 'next/image';
import { Session } from '@supabase/supabase-js';

type ProfileButtonLinkProps = {
  session: Session;
};

export function ProfileButtonLink({ session }: ProfileButtonLinkProps) {
  return (
    <Link href="/profile">
      <div
        className={
          'aspect-square border rounded-full overflow-hidden h-10 w-10 cursor-pointer hover:ring-1 ring-zinc-400'
        }
      >
        <Image
          className="overflow-hidden"
          alt="User Avatar"
          width={40}
          height={40}
          src={session.user.user_metadata.picture || '/avatar.png'}
        />
      </div>
    </Link>
  );
}
