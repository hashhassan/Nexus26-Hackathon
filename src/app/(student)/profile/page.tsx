import { ProfileSettingsView } from "@/components/profile/profile-settings-view";
import { requireRole } from "@/server/auth";
import { getProfileStats } from "@/server/queries/profile";

export default async function ProfilePage() {
  const user = await requireRole(["student"]);

  return (
    <ProfileSettingsView
      user={{ name: user.name, email: user.email, createdAt: user.createdAt }}
      role="student"
      stats={await getProfileStats(user)}
    />
  );
}
