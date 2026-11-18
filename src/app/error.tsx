"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <ErrorState message="An unexpected error occurred. Please try again." onRetry={reset} />
    </div>
  );
}
