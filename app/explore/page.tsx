"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        {!session && (
          <div className="space-y-10 mt-5 border p-4 rounded-md bg-zinc-900">
            <div>
              <div>
                <h2 className="text-xl font-bold">
                  Create an Account to Explore & Contribute!
                </h2>
                <p className="text-sm text-zinc-400">
                  Join the Roamr urbex community and unlock exclusive
                  features.{" "}
                </p>
                <Separator className="mt-2" />
              </div>
              <div className="mt-2 space-y-4">
                <p>With an account, you can:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>📍 Contribute to the map by adding new locations.</li>
                  <li>⭐️ Rate, review, and leave comments on urbex spots.</li>
                  <li>
                    👥 Connect with fellow explorers and plan trips together.
                  </li>
                  {/* <li>
                    💬 Join our exclusive Discord to share experiences, get
                    tips, and stay updated on new features!
                  </li> */}
                </ul>
                <Button type="button">
                  <Link href="/login">Create an Account</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </ResizablePanel>
  );
}

function RightPanel() {
  return <ResizablePanel defaultSize={60} />;
}
