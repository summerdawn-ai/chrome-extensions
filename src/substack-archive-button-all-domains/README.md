# Substack Archive Button (Custom Domains)

Chrome extension that adds Archive and Unarchive controls to Substack post pages,
including publications hosted on custom domains.

This variant runs on all HTTPS sites so it can support Substack publications that use
a custom domain. For Substack-owned domains only, use the
[standard variant](../substack-archive-button).

## Load unpacked

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder (`src/substack-archive-button-all-domains`).

## Pack extension

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Pack extension**.
4. Set the extension root directory to this folder (`src/substack-archive-button-all-domains`).

## How it works

The extension only activates on post pages (path starts with `/p/`) where the Substack
Save/Unsave button is present. It then injects Archive and Unarchive controls next to the
existing Save button and in the post actions menu.

Because Substack-powered custom-domain sites serve the same page structure as `substack.com`,
the same DOM checks apply. The extension remains dormant on unrelated sites even though
the manifest allows broad HTTPS access.
