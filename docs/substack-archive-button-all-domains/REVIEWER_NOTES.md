# Reviewer Notes — Substack Archive Button (Custom Domains)

Thank you for reviewing this extension.

## What the extension does

Substack Archive Button (Custom Domains) adds Archive and Unarchive controls to Substack
post pages, including publications hosted on custom domains.
It calls the Substack `/api/v1/inbox/archive` API endpoint to archive or unarchive the
current post, then shows a brief in-page toast confirmation.

## Permissions justification

| Permission / host | Reason |
|---|---|
| `https://*/*` | Required to support Substack publications on custom domains (e.g. `newsletter.example.com`). The extension only activates where the Substack Save/Unsave button is detected. |

Although the manifest matches all HTTPS sites, the extension is completely dormant on any
page that does not match both of the following conditions:

1. URL path starts with `/p/`.
2. The Substack Save/Unsave button (`button.post-ufi-button.style-tabs[aria-label="Save"]`
   or `...Unsave`) is present in the DOM.

A companion extension restricted to `substack.com` and `*.substack.com` is also available
for users who do not need custom-domain support.

## How to test

### On a standard Substack domain

1. Sign in to a Substack account at <https://substack.com>.
2. Open any post page (URL path starts with `/p/`), for example your Reading list.
3. Open the post actions menu ("..." button) — an **Archive** menu item should appear.
4. On mobile viewports, an **Archive** button should appear in the bottom action bar.
5. Click **Archive** — the post should be archived and a toast should confirm.
6. Reload the page and click **Unarchive** to restore the post.

### On a custom-domain Substack publication

Repeat the above steps on any Substack publication that uses a custom domain.
The extension should behave identically.

### Confirming dormancy on non-Substack sites

1. Navigate to any non-Substack HTTPS site.
2. Verify no extension UI appears and no network requests to `/api/v1/inbox/archive` are made.

## Runtime behaviour

- The content script checks that the page path starts with `/p/` and that the Substack
  Save/Unsave button is present before injecting anything. It is completely dormant on
  all other pages.
- The injected page script further checks for `window._preloads.post` before running.
  If the expected Substack data structure is absent, the script exits immediately.

## Source

Full source is available at <https://github.com/summerdawn-ai/chrome-extensions>.
