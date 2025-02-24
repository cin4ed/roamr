import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Telescope, MapPinPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { NotificationButton } from "@/components/notification-button";
import { ProfileButtonLink } from "@/components/profile-button-link";

enum Tab {
  Explore,
  Create,
  UserProfile,
}

type AppSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  onTabChange?: (tab: Tab) => void;
};

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Explore);

  return (
    <div
      className={cn(
        "flex flex-col py-6 justify-between items-center border-r",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <div className="text-center font-black text-xl font-serif">R</div>
        <Separator />
        <Button
          variant="outline"
          size="icon"
          className={cn("h-10 w-10", activeTab == Tab.Explore && "bg-zinc-900")}
          onClick={() => setActiveTab(Tab.Explore)}
        >
          <Telescope className={cn("h-10 w-10")} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn("h-10 w-10", activeTab == Tab.Create && "bg-zinc-900")}
          onClick={() => setActiveTab(Tab.Create)}
        >
          <MapPinPlus className={cn("h-10 w-10")} />
        </Button>
      </div>
      {session && (
        <div className="flex flex-col gap-3">
          <NotificationButton />
          <ProfileButtonLink user={session.user!} />
        </div>
      )}
    </div>
  );
}
