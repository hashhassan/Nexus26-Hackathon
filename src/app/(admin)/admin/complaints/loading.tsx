import { LoadingState } from "@/components/shared";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-space-lg pt-2">
      <LoadingState variant="table" count={8} className="" />
    </div>
  );
}
