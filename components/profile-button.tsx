import Link from "next/link";
import Image from "next/image";
import type { DefaultSession } from "next-auth";

type ProfileButtonProps = {
  user: NonNullable<DefaultSession["user"]>;
};

export function ProfileButton({ user }: ProfileButtonProps) {
  return (
    <Link href="/user">
      <div
        className={
          "aspect-square border rounded-full overflow-hidden h-10 w-10 cursor-pointer hover:ring-1 ring-zinc-400"
        }
      >
        <Image
          className="overflow-hidden"
          alt="User Avatar"
          width={40}
          height={40}
          src={user.image || "/avatar.png"}
        />
      </div>
    </Link>
  );
}
