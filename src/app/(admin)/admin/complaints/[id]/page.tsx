import { notFound } from "next/navigation";
import { ComplaintDetail } from "@/components/complaint/complaint-detail";
import { requireRole } from "@/server/auth";
import { getComplaintForAdmin } from "@/server/queries/admin-complaints";

export default async function AdminComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireRole(["dept_admin", "super_admin"]);
  const { id } = await params;
  const complaint = await getComplaintForAdmin(id, viewer);
  if (!complaint) notFound();

  return <ComplaintDetail complaint={complaint} viewer="admin" canAct={viewer.role === "dept_admin"} />;
}
