import { notFound } from "next/navigation";
import { ComplaintDetail } from "@/components/complaint/complaint-detail";
import { getComplaintForStudent } from "@/server/queries/complaints";
import { requireRole } from "@/server/auth";

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["student"]);
  const { id } = await params;
  const complaint = await getComplaintForStudent(id, user.id);
  if (!complaint) notFound();

  return <ComplaintDetail complaint={complaint} viewer="student" />;
}
