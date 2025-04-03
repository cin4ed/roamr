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
          'aspect-square h-10 w-10 cursor-pointer overflow-hidden rounded-full border ring-zinc-400 hover:ring-1'
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
