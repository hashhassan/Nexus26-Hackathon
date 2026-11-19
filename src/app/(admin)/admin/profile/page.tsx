import { ProfileSettingsView } from "@/components/profile/profile-settings-view";
import { DEPARTMENTS, DEPARTMENT_KEYS } from "@/lib/constants";
import { requireRole } from "@/server/auth";
import { getProfileStats } from "@/server/queries/profile";

export default async function AdminProfilePage() {
  const user = await requireRole(["dept_admin", "super_admin"]);
  const dept = DEPARTMENT_KEYS.find((k) => k === user.department);

  return (
    <ProfileSettingsView
      user={{ name: user.name, email: user.email, createdAt: user.createdAt }}
      role={user.role}
      departmentLabel={dept ? DEPARTMENTS[dept].label : undefined}
      stats={await getProfileStats(user)}
    />
  );
}
