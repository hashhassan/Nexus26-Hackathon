# Memory

## Status
- All 12 tasks done (polish, loading states, README, build passes). Remaining: push to GitHub and run the FINAL TEST on the live Vercel site; BLOB_READ_WRITE_TOKEN must be a real token on Vercel and locally
- Students can edit/delete own PENDING complaints (updateMyComplaint/deleteMyComplaint, /complaints/[id]/edit; NewComplaintForm has an `edit` mode)

## Demo logins (shared password: `Demo@1234`, `npm run db:seed` is idempotent)
- super_admin: super@campus.edu
- dept_admin: cafeteria@campus.edu, library@campus.edu, labs@campus.edu, teaching@campus.edu
- student: ali@student.edu, ayesha@student.edu

## Gotchas
- `cn()` knows the Stitch type scale (text-label-sm etc.); don't swap it back to plain twMerge or font sizes get dropped next to text colors
- Access checks live in queries: students via userId, admins via `getDepartmentScope` (src/server/queries/scope.ts); dashboard uses it via getDashboardData (src/server/queries/dashboard.ts)
- After deleting a route, run `npx next typegen` if tsc complains about stale `.next/types`
