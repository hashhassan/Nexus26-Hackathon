import { notFound, redirect } from "next/navigation";
import { NewComplaintForm } from "@/components/shared";
import { requireRole } from "@/server/auth";
import { getComplaintForStudent } from "@/server/queries/complaints";

export default async function EditComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["student"]);
  const { id } = await params;
  const complaint = await getComplaintForStudent(id, user.id);
  if (!complaint) notFound();
  if (complaint.status !== "PENDING") redirect(`/complaints/${id}`);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col pb-space-xl">
      <header className="mb-space-lg flex flex-col gap-2 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            Student Dashboard
          </span>
          <span className="text-[12px] text-secondary opacity-60">/</span>
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">
            Edit Filing
          </span>
        </div>
        <h1 className="mt-1 font-headline-lg text-display-md font-normal tracking-tight text-on-surface">
          Update complaint
        </h1>
        <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
          You can change the issue type, title and description while the complaint is still pending.
        </p>
      </header>
      <NewComplaintForm
        edit={{
          id: complaint.id,
          department: complaint.department,
          issueType: complaint.issueType,
          title: complaint.title,
          description: complaint.description,
          imageUrl: complaint.imageUrl,
        }}
      />
    </div>
  );
}
