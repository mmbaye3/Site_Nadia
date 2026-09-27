# Nadia & Partners — Static Family Law Site

Simple static site scaffold for a family law practice. Customize text, replace branding, and optionally deploy to GitHub Pages or Netlify.

Quick start

1. Replace placeholder text (firm name, phone, attorney bios) in the HTML files.
2. Update `contact.html` form action with your Formspree ID or another form endpoint.

Initialize git and push to GitHub

```bash
git init
git add .
git commit -m "Initial site scaffold"
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

Enable Git visualization

- After you have commits, run the script to generate `git-history.txt`:

Windows:

```bat
scripts\generate_git_history.bat
```

This produces `git-history.txt` in the site root. When you serve the site (GitHub Pages, Netlify), open `history.html` to view the textual git history.

Deployment

- GitHub Pages: push to the `main` branch (or `gh-pages`) and enable Pages in repo settings.
- Netlify: drag-drop the folder or connect the GitHub repo.

Customization notes

- Colors are in `css/styles.css` under `:root` variables. Replace with firm branding.
- Add images to an `images/` folder and reference them in the pages.

Next steps I can do for you

- Initialize the git repo and create the first commit.
- Connect to GitHub and enable GitHub Pages.
- Add analytics, SEO meta tags, or a simple CMS (Netlify CMS).
