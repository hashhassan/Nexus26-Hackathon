<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

## Docs rules (keep them short, we're on a hackathon clock)
- docs/ files are working notes, not reports. Bullets only. No intros, summaries, filler words, or repeating what's in another doc or the code.
- Write only what changes a decision or what a future session needs. If the code already shows it, don't write it.
- Size limits (hard caps):
  - PRD.md: max 60 lines (problem, users, must-have features, 1–2 innovation features, out of scope)
  - Architecture.md: max 50 lines (data models, routes/pages, key decisions with a one-line reason each)
  - Design.md: max 40 lines (colors, fonts, spacing, component style, do/don't)
  - Tasks.md: max 80 lines
  - Memory.md: max 40 lines (current status, gotchas, decisions made mid-build). Replace old entries, don't append history.
- When updating a doc: read only the section you're changing, edit only the lines that changed, never rewrite the whole file. If a file is over its cap, cut before adding.

## Reading rules
- Read only the files the current task needs. Don't scan folders, re-read docs/, or explore "for context."
- Start from the files named in the task or Tasks.md. Open other files only if an import or error points to them.
- Read docs/ files only when the task needs them: PRD/Architecture for planning, Design.md for UI tasks, Memory.md at the start of a session.
- Override for the Next.js block above: open `node_modules/next/dist/docs/` only when an API is unclear or an error/deprecation points to it. Not before every task.

## Task sizing (Tasks.md). Total build time is 4–5 hours
- Whole project: 8–12 tasks max, split into 3 phases:
  - Phase 1 Core (must-have features from PRD): 4–6 tasks
  - Phase 2 Innovation (1–2 extra features): 2–3 tasks
  - Phase 3 Polish + deploy check: 1–2 tasks
- Each task = one complete, testable feature slice, about 15–30 min
  (e.g. "Projects: schema + queries + actions + list/create pages").
- Don't split a feature into tiny tasks ("add button", "add types"). Don't merge two features into one task either.
- Each task: one-line title + 2–3 bullets of what "done" means.
- Mark tasks [x] when done. Don't add notes under finished tasks.

## Stack
Next.js App Router + TypeScript, Tailwind v4, shadcn/ui (Base UI based), Prisma 7, Neon (Postgres), Better Auth, Zod, deployed on Vercel.

## Prisma 7
- Generator is `prisma-client`; output is `src/generated/prisma`.
- Always import from `@/generated/prisma/client`, never from `@prisma/client`.
- Use the Neon adapter (`@prisma/adapter-neon`) via the singleton in `src/lib/prisma.ts`.
- `DATABASE_URL` = pooled connection, used at runtime. `DIRECT_URL` = direct connection, used for migrations (`prisma7.config.ts`).
- Pin `prisma`, `@prisma/client` and `@prisma/adapter-neon` to major 7. Never install Prisma 8.

## Folders
- `src/app`: pages, layouts and route handlers only.
- `src/components/ui`: shadcn components. `src/components/shared`: app-level shared components. Both are pure UI: no Prisma imports, no data fetching. Client-side auth actions via `authClient` (e.g. sign-out) are allowed.
- `src/server/queries`: database reads.
- `src/server/actions`: Server Actions (mutations).
- `src/server/auth.ts`: session and role helpers (`getSession`, `requireSession`, `requireRole`).
- `src/lib`: Prisma client, auth config, utils and Zod schemas.

## Components
- Build screens from `src/components/shared` and `src/components/ui` first.
- Create a new shared component only when something is reused 2+ times.
- Follow `docs/Design.md` for styling. Use Tailwind theme tokens (`bg-background`, `text-muted-foreground`), not hard-coded colors.
- shadcn here is Base UI based: a Button that renders a link needs `nativeButton={false}` (e.g. `<Button nativeButton={false} render={<Link href="/x" />}>`).
- Pass icons across the server/client boundary as elements (`<Icon />`), not component references.

## Workflow
- One task per session. Use plan mode only for multi-file work.
- Within each task: build the UI with mock data typed from Prisma types first, then wire queries/actions.
- After each task run `npm run lint` and `npx tsc --noEmit`.
- Update `docs/Tasks.md` and `docs/Memory.md` when a task finishes.

## UI workflow (Stitch)
- Rebuild Stitch screens from `design/stitch/` (HTML + PNG per screen). Read only the current screen's files.
- On the first Stitch screen, map its colors/fonts to theme tokens in `globals.css` once. After that, keep Stitch's layout and spacing classes 1:1 but swap hard-coded colors for tokens.
- The Stitch HTML wins over `docs/Design.md` when they differ.
- Screenshot the result and compare it to the PNG (max 2 loops).

## Don'ts
- Never read `.env` or anything in `src/generated/`.
- Never commit `.env`.
- Do not run git commands. The user runs git and commits themselves (git is denied in `.claude/settings.json`).
- No new dependencies without asking.