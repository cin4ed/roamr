import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Telescope, MapPinPlus, Bell } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("h-10 w-10")}
                    disabled
                  >
                    <Bell className={cn("h-10 w-10")} />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon ⏰</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link href="/user">
            <div
              className={cn(
                "aspect-square border rounded-full overflow-hidden h-10 w-10 cursor-pointer hover:ring-1 ring-zinc-400"
              )}
            >
              <Image
                className="overflow-hidden"
                alt="User Avatar"
                width={100}
                height={100}
                src={session.user!.image || ""}
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
