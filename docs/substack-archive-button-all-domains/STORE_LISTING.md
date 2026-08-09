# Store Listing — Substack Archive Button (All Domains)

## Store Listing

| Field | Value |
| --- | --- |
| Name | Substack Archive Button (All Domains) |
| Short description (132 characters max) | Adds Archive and Unarchive buttons to Substack post pages for logged-in users, including custom domains. |
| Description | The extension adds Archive and Unarchive controls directly to Substack post pages for logged-in users, including publications hosted on custom domains, so you can manage your reading archive without leaving the page.<br><br>When you open a Substack post, the extension adds:<br>- On desktop: An Archive or Unarchive item to the post actions menu<br>- On mobile: An Archive button in the action bar.<br><br>Archiving or unarchiving happens through the Substack API endpoint, using your existing Substack session. A brief confirmation message appears after the action.<br><br>The extension activates only on post pages where the Save or Unsave control is present and stays dormant on unrelated sites. It does not collect, store, or transmit personal data. It supports Substack-owned domains and Substack publications hosted on custom domains. |
| Category | Productivity / Tools |
| Language | English (United States) |
| Store icon | [icon-128.png](../../src/substack-archive-button-all-domains/icons/icon-128.png) |
| Screenshots | [screenshot-desktop.png](images/screenshot-desktop.png) |

## Privacy

| Field | Value |
| --- | --- |
| Single purpose | The extension lets logged-in Substack users archive or unarchive the post they are viewing by adding controls to the existing Substack post actions menu and mobile action bar, including on publications hosted on custom domains. |
| Host permission justification | Access to https://*/* is required to support Substack publications hosted on custom domains, because their hostnames vary. The extension displays controls and sends the user-requested Archive or Unarchive action only on Substack post pages where the Save or Unsave control is present. It remains dormant on unrelated sites. |
| Remote code | No. The extension does not load or execute remote code. |
| Data usage selections | None. No data is collected. The extension uses the existing authenticated Substack session to perform the user-requested action, but does not collect, store, sell, or transfer personal data to third parties. |
| Privacy policy URL | https://docs.summerdawn.ai/chrome-extensions/substack-archive-button-all-domains/PRIVACY_POLICY |

## Test instructions

| Field | Value |
| --- | --- |
| Additional instructions | Sign in to Substack, open a post on substack.com, a subdomain, or a Substack custom domain, and open the post actions menu. Verify that Archive appears next to Save or Unsave. Switch to a mobile viewport and verify that Archive appears after Save. Click Archive, confirm the success message, reload the page, and click Unarchive to restore the post. |
