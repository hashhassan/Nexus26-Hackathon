"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/schemas";
import { AuthField } from "@/components/shared";

export default function SignUpPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
    const fieldErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    }
    if (!formData.has("terms")) fieldErrors.terms = "You must accept the policies to continue";
    if (!parsed.success || fieldErrors.terms) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await authClient.signUp.email(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Could not create account");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Create student account</h2>
        <p className="mt-1 font-body-md text-body-md text-secondary">Join the verified campus feedback portal</p>
      </div>
      <form className="flex flex-col gap-3.5" onSubmit={onSubmit} noValidate>
        <AuthField compact label="Full Name" name="name" placeholder="Jane Doe" autoComplete="name" error={errors.name} />
        <AuthField
          compact
          label="University Email"
          name="email"
          type="email"
          placeholder="j.doe@university.edu"
          autoComplete="email"
          error={errors.email}
        />
        <AuthField
          compact
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
        />
        <div>
          <div className="flex items-center gap-2 pt-1">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded bg-surface-container accent-primary-container"
            />
            <label htmlFor="terms" className="select-none font-label-md text-label-md text-secondary">
              I accept campus honor code &amp; submission policies
            </label>
          </div>
          {errors.terms ? <p className="mt-1 font-label-md text-label-md text-error">{errors.terms}</p> : null}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3 font-title-md text-body-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover disabled:pointer-events-none disabled:opacity-50"
        >
          <span>{loading ? "Creating account..." : "Create Account"}</span>
          {loading ? null : <Check className="size-[18px]" />}
        </button>
      </form>
    </div>
  );
}
