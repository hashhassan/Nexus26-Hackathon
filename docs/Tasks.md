# Tasks

## Phase 1 Frontend (mock data only)
- [x] 1. Schema + mock data: Prisma enums and models, migration, constants, typed mock data (Stitch: none)
  - Done when: Complaint, ComplaintUpdate, enums, nullable user `department` migrated
  - Done when: department/category constants in `src/lib`
  - Done when: `src/lib/mock-data.ts` typed with Prisma types
- [x] 2. Auth screens + app shells: /sign-in, /sign-up, student and admin layouts with sidebar (AppShell), UI only (Stitch: SignIn-Register, Student-Dashboard)
  - Done when: sign-in/sign-up match Stitch
  - Done when: student and admin layouts render AppShell with role-specific nav
- [x] 3. Student dashboard screen: /complaints (Stitch: Student-Dashboard)
  - Done when: stats, status filter tabs, complaint list from mock data
  - Done when: empty state shown
- [x] 4. New complaint screen: /complaints/new (Stitch: New-Complain)
  - Done when: category cards + "Will be sent to …" routing preview update on select
  - Done when: form fields and image dropzone UI render
- [x] 5. Complaint detail screen: /complaints/[id] and /admin/complaints/[id] (Stitch: Complain-Detail)
  - Done when: description, image, responses thread, status timeline render
  - Done when: student view has star rating card; admin view has action panel
- [x] 6. Admin screens: /admin and /admin/complaints (Stitch: Admin-Dashboard, Admin-Complain-List)
  - Done when: 6 stat cards (incl. Avg. Satisfaction), bar chart by department, donut by status, top recurring issues, recent complaints
  - Done when: table with search + category/department/status filters
- [x] 6b. Notifications + Profile & Settings screens, 20 min (Stitch: Notification, Profile&Setting)
  - Done when: /notifications and /profile (student layout) and /admin/notifications and /admin/profile (admin layout) render from one shared component each, with mock data
  - Done when: sidebar in both layouts has Notifications (with count badge) and Profile & Settings links

## Phase 2 Backend (real data, no UI redesign)
- [x] 7. Seed + role routing (Stitch: none)
  - Done when: seed creates 1 super_admin, 4 dept_admins, 2 students via Better Auth API, ~15 complaints with updates and ratings
  - Done when: "/" redirects by role; both layouts have server-side role guards; template /dashboard removed
- [x] 8. Student backend (Stitch: New-Complain, Student-Dashboard, Complain-Detail)
  - Done when: create action (Zod, auto-routing by category) and own-complaints query with stats + filter work
  - Done when: detail query is owner only, else notFound()
  - Done when: rating action is owner only, RESOLVED only, once
- [x] 9. Admin complaints backend (Stitch: Admin-Complain-List, Complain-Detail)
  - Done when: list query with search + filters, department-scoped in the where-clause
  - Done when: detail query returns notFound() for another department
  - Done when: status change, remark, resolve, reject (reason required) actions each write a ComplaintUpdate
- [x] 10. Dashboard backend (Stitch: Admin-Dashboard)
  - Done when: stat counts, chart data, Avg. Satisfaction, top recurring issues, recent complaints are real
  - Done when: all department-scoped for dept_admin
- [x] 10b. Notifications + profile backend, 15 min (Stitch: Notification, Profile&Setting)
  - Done when: student notifications = recent ComplaintUpdates on their own complaints; admin notifications = new complaints in their department (all for super_admin); unread = newer than a "notificationsSeenAt" cookie, "Mark all as read" sets the cookie
  - Done when: name update uses Better Auth updateUser, password change uses Better Auth changePassword, activity stats come from real queries
- [x] 11. Image upload with @vercel/blob (Stitch: New-Complain, Complain-Detail). Cut first if behind schedule.
  - Done when: upload on the new complaint form saves imageUrl
  - Done when: image shows on student and admin detail

## Phase 3 Finish
- [x] 12. Polish + deploy check (Stitch: all)
  - Done when: hover animations consistent; loading/empty/error states present
  - Done when: security cases tested by URL; README has live URL + demo logins
  - Done when: lint, tsc, build pass; Vercel deploy works
