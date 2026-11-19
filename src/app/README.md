# app

Pages only. Each folder here is a URL. Keep logic out; call `server/` and use `components/`.

- `layout.tsx` - wraps every page (fonts, toast popups).
- `page.tsx` - the home page (`/`).
- `globals.css` - global styles and theme colors.
- `error.tsx` - shown when something crashes.
- `not-found.tsx` - the 404 page.
- `favicon.ico` - the browser tab icon.
- `(auth)/` - sign-in and sign-up pages (the brackets don't appear in the URL).
- `dashboard/` - the page you see after logging in.
- `dev/` - developer-only pages. Hidden in production.
- `api/` - backend endpoints (not pages).
