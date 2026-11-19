# Design
- Single source for styling. Stitch HTML (`design/stitch/`) wins on conflicts. Tokens live in `src/app/globals.css` with Stitch's Tailwind names (`bg-surface-container-low`, `text-on-surface-variant`).

## Colors (token #hex)
- Canvas: surface/background #faf8ff, surface-container-lowest #ffffff (cards), -low #f2f3ff, surface-container #eaedff, -high #e2e7ff, -highest #dae2fd, surface-dim #d2d9f4
- Text: on-surface #131b2e, on-surface-variant #464553, secondary #505f76, outline #777584, outline-variant #c8c4d5, hairline border #E7E5E4
- Primary: primary-container #3730a3 (buttons, active states; hover #312E81), on-primary #fff, on-primary-container #a9a7ff, primary-fixed #e2dfff, on-primary-fixed #0f0069
- Secondary: secondary-container #d0e1fb, on-secondary-container #54647a, secondary-fixed #d3e4fe, secondary-fixed-dim #b7c8e1, on-secondary-fixed #0b1c30, on-secondary-fixed-variant #38485d
- Tertiary: tertiary #231f74, tertiary-container #3a388b, tertiary-fixed #e2dfff, tertiary-fixed-dim #c3c0ff, on-tertiary #fff, on-tertiary-fixed #100563, on-tertiary-fixed-variant #3e3c8f
- Error: error #ba1a1a, on-error #fff, error-container #ffdad6, on-error-container #93000a
- Inverse: inverse-surface #283044, inverse-on-surface #eef0ff
- shadcn `primary` = primary-container #3730a3 (so `text-primary`/`bg-primary` render #3730a3, not Stitch's #1f108e)
- Status badges (bg / text): Pending #FEF3C7 / #92400E, In Progress #EFF6FF / #1E40AF, Resolved #ECFDF5 / #065F46, Rejected #FFF1F2 / #9F1239

## Typography (Newsreader headings, Inter everything else)
- display-lg 48/56 w400, display-md 36/44 w400, headline-lg 28/36 w500, headline-md 22/28 w500 (Newsreader)
- title-md 16/24 w600, body-lg 15/24, body-md 14/20, label-md 13/18 w500, label-sm 11/16 w600 tracking .04em (Inter)
- Use `font-<token> text-<token>` together, as in the Stitch HTML

## Spacing / layout
- gutter 1.5rem, margin 3rem, space-xs .25, sm .5, md 1, lg 1.5, xl 2.5rem
- Sidebar rail w-64 fixed left, 1px hairline; cards p-space-lg, list rows p-space-md, module gaps space-xl

## Shape / elevation
- Cards, panels: white, 1px #E7E5E4, `rounded-xl` (1rem), shadow-card `0 1px 3px rgba(15,23,42,.04), 0 1px 2px rgba(15,23,42,.02)`
- Modals/flyouts: shadow-flyout `0 12px 32px -4px rgba(15,23,42,.08), 0 4px 12px -2px rgba(15,23,42,.03)`
- Buttons, inputs, search, menus: `rounded-md` (0.5rem). Badges: `rounded-full`

## Components
- Primary button: bg primary-container, white text, hover #312E81 + `hover:-translate-y-0.5`
- Secondary button: white, 1px #E7E5E4, text on-surface, hover bg #FAFAF7 + border #D6D3D1
- Input: white, 1px #E7E5E4, focus border #3730A3 + ring `0 0 0 3px rgba(55,48,163,.12)`, placeholder #94A3B8
- Badge: px .625rem py .25rem, 11px, w600, tracking .02em, status colors only
- Icons: 1.5px outline in 32/40px #F1F5F9 `rounded-md` frame

## Hover / motion
- All interactive: `transition duration-200` (ease cubic-bezier(.16,1,.3,1))
- Buttons lift, cards gain shadow, icons `scale-110`
- Don't: hard-coded colors in components (use tokens), dark mode
