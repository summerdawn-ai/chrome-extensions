# Chrome Extensions

Browser extension projects for summerdawn.ai.

## Extensions

### Substack Archive Button

Adds Archive and Unarchive controls to Substack post pages.

Two variants are provided — each is a self-contained extension folder that can be loaded
or packed directly from Chrome developer mode.

| Variant | Folder | Domains |
|---|---|---|
| [Substack Archive Button](./src/substack-archive-button) | `src/substack-archive-button` | `substack.com` and `*.substack.com` only |
| [Substack Archive Button (Custom Domains)](./src/substack-archive-button-all-domains) | `src/substack-archive-button-all-domains` | All HTTPS sites (for custom-domain Substack publications) |

Store listing and publishing docs are in [`docs/`](./docs).

## Local development

Load an extension unpacked from its folder under `src/`:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked** and select the desired variant folder.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
