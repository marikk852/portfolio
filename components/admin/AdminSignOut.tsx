"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";

export function AdminSignOut() {
  return (
    <LiquidGlassButton
      type="button"
      variant="magenta"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </LiquidGlassButton>
  );
}
