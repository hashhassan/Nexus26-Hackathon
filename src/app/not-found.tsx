import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { ErrorState } from "@/components/shared";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <ErrorState
        icon={FileQuestion}
        title="Page not found"
        message="The page you are looking for does not exist."
        action={
          <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
            Go home
          </Button>
        }
      />
    </div>
  );
}
