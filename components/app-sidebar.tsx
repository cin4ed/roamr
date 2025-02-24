import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Telescope, MapPinPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { NotificationButton } from "@/components/notification-button";
import { ProfileButton } from "@/components/profile-button";

enum Tab {
  Explore,
  Create,
}

// interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const AppSidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
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
          <ProfileButton user={session.user!} />
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
