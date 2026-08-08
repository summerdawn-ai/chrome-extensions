# Substack Archive Button (All Domains)

Extension for Chrome to provide archive controls on Substack post pages, including custom-domain publications.

## Overview

This extension adds Archive and Unarchive controls to Substack post pages for logged-in users, including publications hosted on custom domains.

It runs on all HTTPS sites so it can support Substack publications that use a custom domain. For Substack-owned domains only, use the [Substack Archive Button](../substack-archive-button/README.md).

### Version History

- **1.0.1 (2026-08-08)**: Fix compatibility with current Substack pages, fix mobile button.
- **1.0.0 (2026-05-05)**: Initial release.

## Installation

### Manual

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder (`src/substack-archive-button-all-domains`).

## How it Works

The extension only activates on post pages (path starts with `/p/`) where the Substack Save/Unsave button is present. It then injects Archive and Unarchive controls next to the existing Save button and in the post actions menu.

Because Substack-powered custom-domain sites serve the same page structure as `substack.com`, the same DOM checks apply. The extension remains dormant on unrelated sites even though the manifest allows broad HTTPS access.

## License

This project is licensed under the MIT License.
