# server

Code that runs only on the server.

- `auth.ts` - session helpers: `getSession()` (who is logged in), `requireSession()` (redirect to sign-in if nobody), `requireRole(roles)` (also checks the role; wrong role goes to `/`).
- `queries/` - functions that read from the database.
- `actions/` - Server Actions: functions that change data (create, update, delete).
