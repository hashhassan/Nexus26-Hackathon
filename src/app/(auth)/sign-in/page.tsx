"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schemas";
import { AuthField } from "@/components/shared";

export default function SignInPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await authClient.signIn.email({
      ...parsed.data,
      rememberMe: formData.has("rememberMe"),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Could not sign in");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Welcome back</h2>
        <p className="mt-1 font-body-md text-body-md text-secondary">Sign in with your university credentials</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <AuthField
          label="University Email"
          name="email"
          type="email"
          placeholder="student@university.edu"
          autoComplete="email"
          error={errors.email}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
        />
        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer select-none items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              defaultChecked
              className="h-4 w-4 cursor-pointer rounded bg-surface-container accent-primary-container"
            />
            <span className="font-body-md text-body-md text-secondary">Remember me</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3 font-title-md text-body-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover disabled:pointer-events-none disabled:opacity-50"
        >
          <span>{loading ? "Signing in..." : "Sign in to CampusConnect"}</span>
          {loading ? null : <ArrowRight className="size-[18px]" />}
        </button>
      </form>
    </div>
  );
}
