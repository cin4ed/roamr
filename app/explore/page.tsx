"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { UrbexCommunityInviteCard } from "@/components/urbex-community-invite-card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Tab } from "@/components/app-sidebar";
import { RoamrMap } from "@/components/roamr-map";
import { toast } from "sonner";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";
import { CreateLocationForm } from "@/components/create-location-form";

export default function Explore() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState(Tab.Explore);
  const [selectedLocation, setSelectedLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
    console.log("Session in Explore:", session);
  }, [session]);

  const handleLocationSelect = (coordinates: {latitude: number; longitude: number}) => {
    setSelectedLocation(coordinates);
    if (isSelectingLocation) {
      setIsSelectingLocation(false);
      toast(`Latitude: ${coordinates.latitude.toFixed(6)}, Longitude: ${coordinates.longitude.toFixed(6)}`, {
        description: "Location selected successfully",
      });
    }
  };

  const handleRequestLocationSelect = () => {
    setIsSelectingLocation(true);
    toast("Click anywhere on the map to select coordinates", {
      description: "Selection mode enabled",
    });
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex">
      <AppSidebar className="w-16" session={session} onTabChange={(tab) => setActiveTab(tab)} />
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={40} className="min-w-[550px]">
            <ScrollArea className="h-screen p-6">
              {activeTab === Tab.Explore && (
                <>
                  {!session && <UrbexCommunityInviteCard />}
                </>
              )}
              {activeTab === Tab.Create && (
                <CreateLocationForm 
                  selectedLocation={selectedLocation} 
                  onRequestLocationSelect={handleRequestLocationSelect}
                />
              )}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <div className={`h-full relative ${isSelectingLocation ? 'ring-2 ring-blue-500' : ''}`}>
              <RoamrMap onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
              {isSelectingLocation && (
                <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-black/70 text-white px-4 py-2 rounded-md">
                  Click anywhere on the map to select a location
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
