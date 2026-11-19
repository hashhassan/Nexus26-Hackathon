# CampusConnect

Campus complaint and feedback portal: students file complaints, they are auto-routed to the right department, and admins resolve them with a full status trail.

**Live:** https://nexus26-hackathon.vercel.app

## Demo logins

Password for every account: `Demo@1234`

| Role | Email | Scope |
| --- | --- | --- |
| Super admin | super@campus.edu | All departments |
| Department admin | cafeteria@campus.edu | Cafeteria |
| Department admin | library@campus.edu | Library |
| Department admin | labs@campus.edu | Labs / IT |
| Department admin | teaching@campus.edu | Teaching |
| Student | ali@student.edu | Own complaints |
| Student | ayesha@student.edu | Own complaints |

New students can also register at `/sign-up`.

## Tech stack

- Next.js (App Router) + TypeScript, Tailwind v4, shadcn/ui (Base UI)
- Prisma 7 + Neon Postgres (`@prisma/adapter-neon`)
- Better Auth (email + password), Zod validation
- Vercel Blob for image attachments, deployed on Vercel

## Key features

- Student sign-up / sign-in with role-based routing (student, department admin, super admin)
- File a complaint by category and issue type; it is auto-routed to that department, with an optional image
- Student dashboard with stats, status filters and per-complaint tracking
- Admin complaints table with search, status/department filters and pagination
- Admins update status with remarks; rejecting requires a reason; closed complaints are locked
- Admin dashboard: stat cards, complaints by department (or issue type), status breakdown
- Notifications for students (status updates) and admins (new complaints), with mark-all-read
- Profile & settings: change name and password

Extras:

1. Status timeline on the complaint detail page (built from update history)
2. Student 1-5 star rating + comment on resolved complaints, with an "Avg. Satisfaction" card on the admin dashboard
3. "Top recurring issues" card on the admin dashboard (department-scoped)

## Security

- All role checks run on the server: layouts, pages and every server action call `requireRole`; the UI never decides access.
- Students only ever query their own complaints (`studentId` comes from the session, never the client); another student's complaint URL returns 404.
- Department admins are locked to their own department by `getDepartmentScope`, used by every admin query and action. URL params cannot widen the scope.
- Uploads are validated server-side (PNG/JPG, max 4MB).

## Local setup

```bash
npm install
# create .env with: DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, BLOB_READ_WRITE_TOKEN
npx prisma migrate deploy --config prisma7.config.ts
npm run db:seed        # demo users + sample complaints (idempotent)
npm run dev
```
