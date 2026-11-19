import { ProfileSettingsView } from "@/components/profile/profile-settings-view";
import { mockComplaints, mockStudent } from "@/lib/mock-data";

export default function ProfilePage() {
  const mine = mockComplaints.filter((c) => c.studentId === mockStudent.id);
  const rated = mine.filter((c) => c.rating !== null);

  return (
    <ProfileSettingsView
      user={mockStudent}
      role="student"
      stats={{
        total: mine.length,
        resolved: mine.filter((c) => c.status === "RESOLVED").length,
        avgRating: rated.length ? rated.reduce((sum, c) => sum + (c.rating ?? 0), 0) / rated.length : null,
        ratedCount: rated.length,
      }}
    />
  );
}
