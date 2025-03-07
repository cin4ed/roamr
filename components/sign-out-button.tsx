import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button type="button" onClick={() => signOut()}>
      <LogOut className="w-10 h-10" />
      Log Out
    </Button>
  );
}
