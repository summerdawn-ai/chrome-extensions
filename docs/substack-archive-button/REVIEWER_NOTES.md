# Reviewer Notes — Substack Archive Button

Thank you for reviewing this extension.

## What the extension does

Substack Archive Button adds Archive and Unarchive controls to Substack post pages.
It calls the Substack `/api/v1/inbox/archive` API endpoint to archive or unarchive the
current post, then shows a brief in-page toast confirmation.

## Permissions justification

| Permission / host | Reason |
|---|---|
| `https://substack.com/*` | Required to run on Substack-owned post pages and to call the Substack API. |
| `https://*.substack.com/*` | Required to run on subdomain Substack publications (e.g. `example.substack.com`). |

No additional permissions are requested.

## How to test

1. Sign in to a Substack account at <https://substack.com>.
2. Open any post page (URL path starts with `/p/`), for example your Reading list.
3. Open the post actions menu ("..." button) — an **Archive** menu item should appear.
4. On mobile viewports, an **Archive** button should appear in the bottom action bar.
5. Click **Archive** — the post should be archived and a toast should confirm.
6. Reload the page and click **Unarchive** to restore the post.

## Runtime behaviour

- The content script checks that the page path starts with `/p/` and that the Substack
  Save/Unsave button is present before injecting anything. It is completely dormant on
  all other pages.
- The injected page script further checks for `window._preloads.post` before running.
  If the expected Substack data structure is absent, the script exits immediately.

## Source

Full source is available at <https://github.com/summerdawn-ai/chrome-extensions>.
