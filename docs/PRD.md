# PRD: CampusConnect

## Problem
- Campus complaints (food, library, labs, teaching) get lost in verbal/paper channels. No routing, no status, no accountability.

## Users / roles (Better Auth `user.role`)
- student: self-registers at /sign-up. Submits complaints, sees ONLY own complaints, status, admin remarks.
- dept_admin: seeded, one per department, `user.department` set. Manages ONLY own department's complaints.
- super_admin: seeded. Sees all complaints, search + filters, all analytics.

## Categories = departments (auto-routed on submit)
- CAFETERIA → Cafeteria Administration: food quality/hygiene, high prices, limited variety, staff behaviour
- LIBRARY → Library Administration: outdated books, librarian availability, opening hours, seating space
- LABS_IT → Laboratory / IT Administration: computers not working, internet, projector/multimedia, missing software
- TEACHING → Teaching / Academic Administration: teacher late, notes unavailable, poor explanation, classroom discipline

## Statuses
- PENDING, IN_PROGRESS, RESOLVED, REJECTED. Rejecting requires a reason.

## Required features
- Student register/login, role-based access
- Submit complaint by category + issue type, auto-routed to department
- Optional image attachment
- Status management by admins + tracking by students (status, remarks thread)
- Admin dashboard: stat cards (total, pending, in progress, resolved, rejected), bar chart by department
- Admin complaints table with search + filters (super_admin: all; dept_admin: own department)

## Extras (only these 3, on existing screens)
- Status timeline on complaint detail (from update history)
- Student star rating (1–5 + comment) on resolved complaints; "Avg. Satisfaction" card on admin dashboard
- "Top recurring issues" card on admin dashboard (issue types ranked by count, department-scoped)

## Out of scope
- Admin registration (admins are seeded)
- Email notifications
- Password reset
- Dark mode
- Mobile app
