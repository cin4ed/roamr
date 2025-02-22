import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Telescope, MapPinPlus, Bell } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

enum Tab {
  Explore,
  Create
}

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const AppSidebar: React.FC<AppSidebarProps> = ({ className, ...props }) => {
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
        <Button variant="outline" size="icon" className={cn("h-10 w-10", activeTab == Tab.Explore && "bg-zinc-900")} onClick={() => setActiveTab(Tab.Explore)}>
          <Telescope className={cn("h-10 w-10")} />
        </Button>
        <Button variant="outline" size="icon" className={cn("h-10 w-10", activeTab == Tab.Create && "bg-zinc-900")} onClick={() => setActiveTab(Tab.Create)}>
          <MapPinPlus className={cn("h-10 w-10")} />
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Button variant="outline" size="icon" className={cn("h-10 w-10")}>
          <Bell className={cn("h-10 w-10")} />
        </Button>
        <div
          className={cn(
            "aspect-square border rounded-full overflow-hidden h-10 w-10"
          )}
        >
          <Image
            className="overflow-hidden"
            alt="sldkfj"
            width={100}
            height={100}
            src="https://xsgames.co/randomusers/avatar.php?g=male"
          />
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
