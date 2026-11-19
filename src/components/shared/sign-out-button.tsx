"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  iconOnly?: boolean;
  /** Overrides the default "Sign out" label. */
  label?: string;
  className?: string;
};

export function SignOutButton({ iconOnly = false, label = "Sign out", className }: SignOutButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant={iconOnly ? "ghost" : "outline"}
      size={iconOnly ? "icon" : "sm"}
      aria-label="Sign out"
      title="Sign out"
      className={cn(iconOnly && "text-on-surface-variant transition duration-200 hover:text-error", className)}
      onClick={async () => {
        await authClient.signOut();
        router.push("/sign-in");
        router.refresh();
      }}
    >
      <LogOut className="transition-transform duration-200 group-hover/button:scale-110" />
      {iconOnly ? null : label}
    </Button>
  );
}
