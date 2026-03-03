# yourfiyan.github.io

Portfolio site for Syed Sufiyan Hamza, served via GitHub Pages at <https://yourfiyan.github.io/>.

## Fixing the Custom Domain Redirect

If visiting `https://yourfiyan.github.io/` redirects you to `https://yourfiyan.me/`, the cause is a **custom domain configured in GitHub Pages Settings**, not a file in this repository.

### Why this happens

GitHub Pages stores a custom domain setting server-side (in **Settings → Pages → Custom domain**). When a custom domain is set, GitHub automatically redirects the default `<username>.github.io` URL to that domain. Removing this setting — and ensuring no `CNAME` file exists in the published branch — stops the redirect.

### How to remove the redirect

1. Go to **Settings → Pages** in this repository.
2. Under **Custom domain**, clear the field so it is blank and click **Save**.
3. Confirm that no `CNAME` file exists in the root of the `main` branch (there is none in this repository).
4. Wait a few minutes for GitHub Pages to propagate the change. The site will then be reachable at `https://yourfiyan.github.io/` without any redirect.

### How to avoid accidental redirects in the future

- **Do not set a custom domain** in Settings → Pages unless you own the domain and want visitors to use it.
- **Do not commit a `CNAME` file** to the root of the published branch unless you intend to use a custom domain. A `CNAME` file containing `yourfiyan.me` would cause the same redirect.
- If you need to use a custom domain in the future, add a `CNAME` file containing your domain (e.g., `yourfiyan.me`) to the repository root, configure DNS as described in the [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), and set the domain in Settings → Pages.
