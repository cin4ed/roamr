import React, { useState } from 'react';
import { cn } from '@/utils/utils';
import { Telescope, MapPinPlus, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from '@/components/ui/separator';
import { ProfileButtonLink } from '@/components/profile-button-link';
import { Session } from '@supabase/supabase-js';
import Link from 'next/link';

export enum Tab {
  Explore,
  Create,
  UserProfile,
}

type AppSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  session: Session | null;
  onTabChange: (tab: Tab) => void;
};

export function AppSidebar({ session, onTabChange, className, ...props }: AppSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Explore);

  return (
    <div
      className={cn(
        'flex flex-col py-6 justify-between items-center border-r bg-zinc-900',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <HomeLink />
        <Separator />
        <ExploreButton
          active={activeTab == Tab.Explore}
          onClick={() => {
            setActiveTab(Tab.Explore);
            onTabChange(Tab.Explore);
          }}
        />
        <CreateButton
          active={activeTab == Tab.Create}
          onClick={() => {
            setActiveTab(Tab.Create);
            onTabChange(Tab.Create);
          }}
        />
      </div>
      {session && (
        <div className="flex flex-col gap-3">
          <ProfileButtonLink session={session} />
        </div>
      )}
    </div>
  );
}

function HomeLink() {
  return (
    <Link href="/">
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <Home className="h-10 w-10" />
      </Button>
    </Link>
  );
}

function ExploreButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-10 w-10', active && 'bg-zinc-800')}
      onClick={() => onClick()}
    >
      <Telescope className={cn('h-10 w-10')} />
    </Button>
  );
}

function CreateButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-10 w-10', active && 'bg-zinc-800')}
      onClick={() => onClick()}
    >
      <MapPinPlus className={cn('h-10 w-10')} />
    </Button>
  );
}
