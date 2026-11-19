import { ProfileSettingsView } from "@/components/profile/profile-settings-view";
import { mockAdmins, mockComplaints } from "@/lib/mock-data";

export default function AdminProfilePage() {
  const rated = mockComplaints.filter((c) => c.rating !== null);

  return (
    <ProfileSettingsView
      user={mockAdmins[0]}
      role="super_admin"
      stats={{
        total: mockComplaints.length,
        resolved: mockComplaints.filter((c) => c.status === "RESOLVED").length,
        avgRating: rated.length ? rated.reduce((sum, c) => sum + (c.rating ?? 0), 0) / rated.length : null,
        ratedCount: rated.length,
      }}
    />
  );
}
