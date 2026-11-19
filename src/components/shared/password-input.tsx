"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

/** Password input with a show/hide toggle. Pass the same classes you would give a plain input. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={cn(className, "pr-11")} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="group absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-lg text-outline transition duration-200 hover:text-on-surface focus-visible:outline-none focus-visible:text-primary"
      >
        <Icon className="size-[18px] transition-transform duration-200 group-hover:scale-110" />
      </button>
    </div>
  );
}
