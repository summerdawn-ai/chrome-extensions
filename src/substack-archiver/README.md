# Substack Archiver

Chrome extension that adds Archive and Unarchive controls to supported Substack post pages.

The extension can run on any site, but it only injects on pages whose path starts with `/p/`.

## Load unpacked

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this folder.

## Restrict site access

If you want Chrome to limit the extension back down to Substack-owned domains, change the extension's site access in Chrome:

1. Open `chrome://extensions`.
2. Open this extension's details page.
3. Under Site access, choose `On specific sites`.
4. Add the Substack sites you want, for example `https://substack.com/*` and `https://*.substack.com/*`.
5. Reload any open Substack post pages.

Using `On all sites` keeps custom-domain Substack posts working. Regardless of the Chrome site-access setting, the extension still only activates on pages whose path starts with `/p/`.