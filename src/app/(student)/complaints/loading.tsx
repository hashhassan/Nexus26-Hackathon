import { LoadingState } from "@/components/shared";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-space-lg pt-2">
      <LoadingState variant="cards" count={4} className="sm:grid-cols-2 lg:grid-cols-4" />
    </div>
  );
}
