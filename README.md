# Chrome Extensions

Extensions for Chrome and other Chromium-based desktop browsers.

## Overview

The current extensions add archive controls to Substack post pages.

### Extensions

- [Substack Archive Button](./src/substack-archive-button/README.md): Adds Archive and Unarchive controls on `substack.com` and `*.substack.com` post pages.
- [Substack Archive Button (All Domains)](./src/substack-archive-button-all-domains/README.md): Adds the same controls on Substack post pages, including publications hosted on custom domains.

Store listing and publishing docs are in [`docs/`](./docs).

## Development

Load an extension unpacked from its folder under `src/`:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select the desired variant folder under `src/`.

Pack an extension for local distribution or store submission:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Pack extension**.
4. Set the extension root directory to the desired folder under `src/`.

## Contributing

Contributions are welcome. Please fork the repository, create a focused branch for your change, and open a pull request with a clear description of what changed and why; issues are also welcome for bug reports and feature ideas.

## Security

We welcome responsible security reports. Please contact the repository owner privately with the details rather than opening a public issue, so the problem can be investigated and addressed before it is disclosed.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
