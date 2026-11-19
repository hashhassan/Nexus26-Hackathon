import { notFound } from "next/navigation";
import { ComplaintDetail } from "@/components/complaint/complaint-detail";
import { mockComplaints } from "@/lib/mock-data";

export default async function AdminComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const complaint = mockComplaints.find((c) => c.id === id);
  if (!complaint) notFound();

  return <ComplaintDetail complaint={complaint} viewer="admin" />;
}
