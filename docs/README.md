# SecJS GitHub Pages Demo

This folder contains the public landing page served via GitHub Pages.

## Deployment
1. Push `docs/index.html` (and any assets) to the repository
2. Enable GitHub Pages: `Settings → Pages`
   - Source: **Deploy from a branch**
   - Branch: `master` (or `main`), Folder: `/docs`
3. Wait a few minutes; the site will be available at `https://<username>.github.io/<repo>/`

## Layout
```
docs/
├── index.html   # Main page
└── README.md    # This file
```

## Customization
- Update statistics and copywriting in `index.html`
- Adjust colors/typography in the embedded `<style>` block
- Add new sections or assets as needed (images, JS, etc.)

## Tips
- Keep links pointing to the correct GitHub repository
- Upload images/assets to the repo or reference trusted CDNs
- Sync the README and landing page so instructions stay consistent
