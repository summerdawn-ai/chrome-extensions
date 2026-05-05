# Substack Archive Button (All Domains) — Store Listing

## Name

Substack Archive Button (All Domains)

## Short description (132 characters max)

Adds Archive and Unarchive buttons to Substack post pages, including publications on custom domains.

## Detailed description

**Substack Archive Button (All Domains)** adds Archive and Unarchive controls directly
to Substack post pages — including Substack publications hosted on custom domains — so you
can manage your reading archive without navigating away.

### What it does

When you open a Substack post, the extension adds:

- An **Archive** (or **Unarchive**) item to the post actions menu (the "..." menu on desktop).
- An **Archive** button in the mobile bottom action bar next to the Save button.

Archiving or unarchiving happens instantly via the Substack API — the same action you would
perform from your reading archive page — with a brief confirmation toast.

### Custom domain support

Many Substack publications use a custom domain (e.g. `newsletter.example.com`). This variant
supports those publications in addition to `substack.com` and `*.substack.com`. For a
Substack-only variant, see
[Substack Archive Button](https://chromewebstore.google.com/detail/substack-archive-button).

### When it activates

The extension only activates when all of the following are true:

- The page URL path starts with `/p/` (a Substack post page).
- The Substack Save/Unsave button is present in the page.

It stays completely dormant on any other page, even though it is granted broad HTTPS access
to support custom domains.

### Permissions

This extension requires access to all HTTPS sites solely to support Substack publications
that use custom domains. It performs no action on sites that do not have the Substack
Save/Unsave button present.

### Privacy

The extension does not collect, transmit, or store any personal data. See the
[Privacy Policy](https://docs.summerdawn.ai/chrome-extensions/substack-archive-button-all-domains/PRIVACY_POLICY) for details.

## Category

Productivity

## Language

English
