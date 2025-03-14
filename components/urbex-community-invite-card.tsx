import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function UrbexCommunityInviteCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'space-y-10 border p-4 rounded-md bg-zinc-900 xl:text-sm 2xl:text-base',
        className
      )}
      {...props}
    >
      <div>
        <div>
          <h2 className="text-xl font-bold">Create an Account to Explore & Contribute!</h2>
          <p className="text-sm text-zinc-400">
            Join the Roamr urbex community and unlock exclusive features.{' '}
          </p>
          <Separator className="mt-2" />
        </div>
        <div className="mt-2">
          <p>With an account, you can:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>📍 Contribute to the map by adding new locations.</li>
            <li>⭐️ Rate, review, and leave comments on urbex spots.</li>
            <li>👥 Connect with fellow explorers and plan trips together.</li>
          </ul>
          <div className="flex justify-end   mt-5">
            <Button type="button">
              <Link href="/login">👉 Sign In | Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
