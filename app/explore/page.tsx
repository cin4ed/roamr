"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { UrbexCommunityInviteCard } from "@/components/urbex-community-invite-card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";

export default function Explore() {
  const { session } = useAuth();

  useEffect(() => {
    console.log("Session in Explore:", session);
  }, [session]);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex">
      <AppSidebar className="w-16" session={session} />
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <LeftPanel session={session} />
          <ResizableHandle withHandle />
          <RightPanel />
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function LeftPanel({ session }: { session: Session | null }) {
  return (
    <ResizablePanel defaultSize={40} className="min-w-[550px]">
      <ScrollArea className="h-screen p-6">
        {!session && <UrbexCommunityInviteCard />}
      </ScrollArea>
    </ResizablePanel>
  );
}

function RightPanel() {
  return <ResizablePanel defaultSize={60} />;
}
