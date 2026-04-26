# Dev Notes

## Current baseline

- `substack-archive-enhancer.js` was reduced to a minimal desktop-only menu injector.
- The current baseline only patches the desktop overflow menu by cloning the native `Save` / `Unsave` menu item and inserting `Archive` / `Unarchive` beside it.
- The current baseline keeps the same same-origin archive API call: `POST /api/v1/inbox/archive`.
- The current baseline keeps local `window._preloads.post.inboxItem.archived_at` updates so the menu label can refresh without a page reload.

## Why it was simplified

- The previous script had grown into a mixed prototype with desktop, mobile, dialog, toast, signed-out visibility, debug override, and mutation-refresh logic all in one file.
- That expansion made the extension harder to reason about and likely contributed to the menu hang during testing.
- For extension bring-up, the narrowest path is the desktop menu only. That is the version now left in the main script.

## Backup

- The expanded JavaScript version was moved out of the active path and saved to `substack-archive-enhancer.backup.js`.
- That backup was decoded from `substack-archive-enhancer.b64` so the larger experimental version is still available without keeping it active in the extension entry path.

## Next step

- Validate the desktop-only extension in Chrome first.
- After the desktop path is stable, add back narrow follow-up paths one at a time: desktop refinements first, then mobile.