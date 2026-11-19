# components

Reusable UI. No database code here.

- `ui/` - basic shadcn building blocks (button, input, card...).
- `shared/` - our own bigger pieces built from `ui/` (navbar, sidebar, page header...).
- `app-header.tsx` - the top bar used on pages. It checks if you're logged in and shows your name + sign-out, or sign-in/sign-up links.
