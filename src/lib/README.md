# lib

Setup and small helpers used across the app.

- `prisma.ts` - the database client (connects to Neon). Import `prisma` from here.
- `auth.ts` - Better Auth setup (server side): email/password login, `role` field.
- `auth-client.ts` - Better Auth for the browser: `signIn`, `signUp`, `signOut`, `useSession`.
- `schemas.ts` - Zod validation rules for forms (sign-in, sign-up). Add new ones here.
- `utils.ts` - `cn()` helper for combining Tailwind class names.
