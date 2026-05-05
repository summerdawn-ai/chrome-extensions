# Substack Archive Button — Store Listing

## Name

Substack Archive Button

## Short description (132 characters max)

Adds Archive and Unarchive buttons to Substack post pages so you can manage your reading archive without leaving the page.

## Detailed description

**Substack Archive Button** adds Archive and Unarchive controls directly to Substack post pages,
so you can manage your reading archive without navigating away.

### What it does

When you open a Substack post, the extension adds:

- An **Archive** (or **Unarchive**) item to the post actions menu (the "..." menu on desktop).
- An **Archive** button in the mobile bottom action bar next to the Save button.

Archiving or unarchiving happens instantly via the Substack API — the same action you would
perform from your reading archive page — with a brief confirmation toast.

### When it activates

The extension only activates when all of the following are true:

- The page URL path starts with `/p/` (a Substack post page).
- The Substack Save/Unsave button is present in the page.

It stays completely dormant on any other page.

### Permissions

This extension requires no special browser permissions beyond the ability to run on
Substack-owned domains (`substack.com` and `*.substack.com`).

### Privacy

The extension does not collect, transmit, or store any personal data. See the
[Privacy Policy](PRIVACY_POLICY.md) for details.

## Category

Productivity

## Language

English
