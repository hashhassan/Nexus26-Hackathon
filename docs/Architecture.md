# Architecture

## Stack
- Next.js App Router + TS, Tailwind v4, shadcn (Base UI), Prisma 7 + Neon, Better Auth, Zod, recharts, @vercel/blob, Vercel

## Models
- User (Better Auth): + `role` (student|dept_admin|super_admin), `department` (Department?, only dept_admin)
- Enums: Department {CAFETERIA, LIBRARY, LABS_IT, TEACHING}; Status {PENDING, IN_PROGRESS, RESOLVED, REJECTED}
- Complaint: id, title, description, department, issueType, status, imageUrl?, rating? (1–5), ratingComment?, studentId, createdAt, updatedAt
- ComplaintUpdate: id, complaintId, adminId, status, remark, createdAt (one per status change or remark)
- Dept/issue-type mapping: single constants file `src/lib/departments.ts`

## Routes
- /sign-in, /sign-up
- `/` redirects by role: student → /complaints, admins → /admin (template /dashboard removed)
- Student: /complaints (list + stats + status tabs), /complaints/new, /complaints/[id]
- Admin: /admin (dashboard), /admin/complaints (table + search + filters), /admin/complaints/[id] (detail + action panel)

## Folders
- queries in `src/server/queries`, mutations in `src/server/actions`, role helpers in `src/server/auth.ts`
- Zod schemas + constants in `src/lib`; layouts use shared AppShell (sidebar)

## Security (server-side only)
- Every query/action calls `requireRole` first
- Student queries filter `studentId = session.user.id`; mismatch → `notFound()`
- dept_admin queries add `department = user.department` in the Prisma where-clause; other dept by URL → `notFound()`
- super_admin: no department filter; role-gated layouts are a convenience, not the guard
- Rating action: owner only, status RESOLVED only, once

## Key decisions
- category = department: simplest auto-routing, no routing table
- ComplaintUpdate table: one source for remarks thread and status timeline
- Server-side scoping in where-clause: hiding UI is not RBAC
- Seed users via Better Auth API: passwords hash correctly
- Image upload cut first if behind schedule: only non-required-critical extra
