# Substack Archive Button

Chrome extension that adds Archive and Unarchive controls to Substack post pages.

This variant runs only on Substack-owned domains (`substack.com` and `*.substack.com`).
For custom-domain Substack publications, use the [Custom Domains variant](../substack-archive-button-all-domains).

## Load unpacked

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder (`src/substack-archive-button`).

## Pack extension

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Pack extension**.
4. Set the extension root directory to this folder (`src/substack-archive-button`).

## How it works

The extension only activates on post pages (path starts with `/p/`) where the Substack
Save/Unsave button is present. It then injects Archive and Unarchive controls next to the
existing Save button and in the post actions menu.
