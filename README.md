# Substack Archive Enhancer

Chrome extension that adds archive and unarchive controls to supported Substack post pages on the web.

## What it does

- adds an `Archive` or `Unarchive` item beside Substack's native desktop `Save` action
- adds a matching archive button to the mobile action bar when the mobile save control is present
- updates local page state immediately after archive changes
- shows undoable toast notifications after archive changes
- hides archive controls when the viewer is signed out
- hides save controls that the extension can reach while the viewer is signed out

## Current scope

- verified on Substack-hosted publication pages such as `https://publication.substack.com/p/post-slug`
- same-origin archive requests are required, so `substack.com/home/post/...` is not the primary target surface
- the manifest currently matches `*.substack.com`; custom-domain publications are not packaged yet

## Install locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder.

## Test checklist

1. Visit a Substack-hosted post page while signed in.
2. Open the desktop overflow menu and confirm `Archive` or `Unarchive` appears beside `Save`.
3. Toggle the action and confirm the toast and undo flow work.
4. Reload the page and confirm archive state persists.
5. Repeat in a mobile-sized viewport.
6. Sign out and confirm neither archive controls nor save controls are shown on supported surfaces.

## Development

The content script lives in `substack-archive-enhancer.js` and is also usable as a DevTools snippet during iteration.

## License

MIT