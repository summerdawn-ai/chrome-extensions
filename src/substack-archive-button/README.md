# Substack Archive Button

Extension for Chrome to provide archive controls on Substack post pages.

## Overview

This extension adds Archive and Unarchive controls to Substack post pages.

It runs only on Substack-owned domains (`substack.com` and `*.substack.com`). For custom-domain Substack publications, use the [Substack Archive Button (All Domains)](../substack-archive-button-all-domains/README.md).

### Version History

- **1.0.0 (2026-05-05)**: Initial release for Substack-owned domains.

## Installation

### Manual

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder (`src/substack-archive-button`).

## How it Works

The extension only activates on post pages (path starts with `/p/`) where the Substack Save/Unsave button is present. It then injects Archive and Unarchive controls next to the existing Save button and in the post actions menu.

## License

This project is licensed under the MIT License.
