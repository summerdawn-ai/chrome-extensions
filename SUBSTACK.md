# Substack Archive Handoff

This folder contains a unified injector prototype for adding archive controls to Substack post pages.

## Files

- `substack-archive-enhancer.js`
  - A content-script-style injector that patches both desktop and mobile layouts.
  - It is written to be usable as a DevTools snippet now and as the basis for a Chrome extension content script later.

## Verified Findings

### IDs and state source

The post page exposes reliable hydrated data at:

```js
window._preloads.post
window._preloads.post.inboxItem
```

Relevant fields:

```js
window._preloads.post.id
window._preloads.post.publication_id
window._preloads.post.inboxItem.archived_at
window._preloads.post.inboxItem.saved_at
```

Archive state should be initialized from:

```js
!!window._preloads.post.inboxItem.archived_at
```

### Archive API

The working request is same-origin from the publication page, not cross-origin to `substack.com`.

Archive:

```js
POST /api/v1/inbox/archive
{
  contentKey: `post:${post_id}`,
  post_id,
  publication_id
}
```

Unarchive:

```js
POST /api/v1/inbox/archive
{
  contentKey: `post:${post_id}`,
  post_id,
  publication_id,
  archived: false
}
```

Notes:

- `contentKey` must use camelCase.
- Cross-origin calls to `https://substack.com/api/v1/inbox/archive` hit CORS issues from publication pages.
- Same-origin `fetch("/api/v1/inbox/archive", ...)` works.

## Desktop behavior

Desktop pages expose a `...` menu containing `Save` or `Unsave`.

The injector waits for a menu with `role="menu"`, finds the `Save` / `Unsave` item, clones it, and inserts an `Archive` / `Unarchive` item immediately after it.

The desktop item label is driven by current local state:

- `Archive` when `archived_at` is null
- `Unarchive` when `archived_at` is a timestamp

## Mobile behavior

Mobile pages do not expose the menu. Instead, they use a bottom action row with buttons like:

```html
button.post-ufi-button.style-tabs
```

The best mobile anchor is the save button:

```js
button.post-ufi-button.style-tabs[aria-label="Save"]
```

The injector clones that button, replaces the icon, and inserts a no-label archive button beside it.

The mobile button uses the same state toggle logic as desktop.

## Toast behavior

Substack uses a notifications region like:

```html
<div role="region" aria-label="Notifications (F8)">
  <ol class="viewport-_BM4Bg"></ol>
</div>
```

The native save toast is rendered as an `li.toast-IVcFeu` with Radix-style markup.

The injector recreates that shell closely enough to match the save/unsave toast style and shows:

- `Post archived`
- `Post unarchived`

Each toast includes an `Undo` action that reverses the just-completed archive mutation.

## Local state behavior

After a successful archive or unarchive request, the injector updates:

```js
window._preloads.post.inboxItem.archived_at
window._preloads.post.inboxItem.updated_at
```

That lets both desktop and mobile controls update immediately without a reload.

The real page also rehydrates `archived_at` correctly after a full reload.

## What was actually verified

Verified live:

- `post_id = 193134597`
- `publication_id = 8530157`
- archive request returns HTTP 200 using same-origin endpoint
- unarchive works with the same endpoint plus `archived: false`
- `archived_at` becomes non-null after archive + reload
- `archived_at` returns to null after unarchive + reload
- desktop menu injection approach works on the live page

Verified by supplied DOM, not by live browser inspection in the tool:

- mobile bottom action row structure and selectors
- mobile save button shape used as the archive button template

## Suggested next steps in a new session

1. Create a Chrome extension manifest and use `substack-archive-enhancer.js` as the content script.
2. Test on both desktop and mobile-responsive Substack post pages.
3. Decide whether the archive button should appear before or after Save on mobile.
4. Optionally add analytics-free debug logging guards or a development flag.
5. If needed, tighten selector scoping so only the top post action bar is patched on mobile.

## Useful debugging hooks

The injector installs a global helper:

```js
window.__substackArchiveEnhancer
```

Useful methods:

```js
window.__substackArchiveEnhancer.getState()
window.__substackArchiveEnhancer.refreshUi()
window.__substackArchiveEnhancer.cleanup()
```