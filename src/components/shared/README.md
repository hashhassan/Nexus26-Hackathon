# shared

Our own reusable pieces. Import them all from `@/components/shared`.

- `app-shell.tsx` - page layout: navbar on top, optional sidebar, centered content.
- `navbar.tsx` - top bar with brand, links and a user area.
- `sidebar.tsx` - side menu with active link. Collapses into a button on mobile.
- `page-header.tsx` - page title, description and action buttons.
- `stat-card.tsx` - a small card showing one number.
- `empty-state.tsx` - "nothing here yet" message with optional button.
- `loading-state.tsx` - grey placeholder shapes while loading (cards, list, table).
- `error-state.tsx` - error message with a retry button.
- `confirm-dialog.tsx` - "Are you sure?" popup (can be red for delete).
- `form-fields.tsx` - label + input/textarea/select + error text in one piece.
- `sign-out-button.tsx` - button that logs the user out.
- `index.ts` - lists everything above so it can be imported from one place.
