import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { PasswordInput } from "./password-input";

type AuthFieldProps = {
  label: string;
  name: string;
  error?: string;
  /** Tighter spacing, used on the register form. */
  compact?: boolean;
} & Omit<ComponentProps<"input">, "name" | "className">;

export function AuthField({ label, name, error, compact, type, ...props }: AuthFieldProps) {
  const inputProps = {
    id: name,
    name,
    "aria-invalid": !!error,
    className: cn(
      "w-full rounded-lg bg-surface-container-low px-3.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary-container)] aria-invalid:shadow-[0_0_0_2px_var(--color-error)]",
      compact ? "py-2" : "py-2.5",
    ),
    ...props,
  };

  return (
    <div>
      <label
        htmlFor={name}
        className={cn(
          "block font-label-md text-label-md text-on-surface-variant",
          compact ? "mb-1" : "mb-1.5",
        )}
      >
        {label}
      </label>
      {type === "password" ? <PasswordInput {...inputProps} /> : <input type={type} {...inputProps} />}
      {error ? <p className="mt-1 font-label-md text-label-md text-error">{error}</p> : null}
    </div>
  );
}
