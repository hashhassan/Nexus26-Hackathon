import type { Prisma } from "@/generated/prisma/client";
import { DEPARTMENT_KEYS, type Role } from "@/lib/constants";

export type Viewer = { id: string; role: Role; department: string | null };

/**
 * Single source of department access for admin queries.
 * dept_admin -> always their own department (URL params ignored).
 * super_admin -> requested department if valid, otherwise all.
 */
export function getDepartmentScope(viewer: Viewer, requestedDepartment?: string): Prisma.ComplaintWhereInput {
  if (viewer.role === "dept_admin") {
    const own = DEPARTMENT_KEYS.find((k) => k === viewer.department);
    // Misconfigured dept_admin sees nothing rather than everything.
    return own ? { department: own } : { id: "__no_access__" };
  }
  const requested = DEPARTMENT_KEYS.find((k) => k === requestedDepartment);
  return requested ? { department: requested } : {};
}
