# Memory

## Status
- Tasks 1-6b done (all Phase 1 frontend screens incl. notifications + profile, mock data). Next: Task 7 (seed + role routing)

## Demo logins (shared password: `Demo@12345`)
- super_admin: admin@campus.test
- dept_admin Cafeteria: cafeteria@campus.test
- dept_admin Library: library@campus.test
- dept_admin Labs/IT: labs@campus.test
- dept_admin Teaching: teaching@campus.test
- student: student1@campus.test, student2@campus.test

## Gotchas
- `cn()` knows the Stitch type scale (text-label-sm etc.); don't swap it back to plain twMerge or font sizes get dropped next to text colors
- StatCard/EmptyState are restyled to Stitch; template /dashboard still uses them (removed in Task 7)
