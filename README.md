# Ciber Cazadora - Portfolio Site

A Jekyll-powered portfolio site for cybersecurity professionals.

## Quick Start

1. Copy all files to your `xxx.github.io` repo (replace everything)
2. Push to GitHub. GitHub Pages will build it automatically.

That's it. No gems to install if you're using GitHub Pages' built-in Jekyll.

## Local Development

```bash
gem install jekyll bundler
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`

## What to Customize

### Must-do (marked with TODO or placeholder text):

- **index.html** - Replace placeholder stats (X+, X) with real numbers
- **index.html** - Update About section with your actual background
- **index.html** - Replace experience timeline with real job history
- **index.html** - Add real project descriptions and results
- **index.html** - Update certifications with your actual certs (link to Credly)
- **index.html** - Update contact links (LinkedIn, email, GitHub)
- **_config.yml** - Update description if needed

### Blog Posts

Add new posts in `_posts/` with the format:
```
_posts/YYYY-MM-DD-title-goes-here.md
```

Each post needs front matter:
```yaml
---
layout: post
title: "Your Post Title"
date: 2026-03-25
---

Post content in Markdown.
```

### Adding a Resume PDF

1. Add your resume PDF to the root directory (e.g., `resume.pdf`)
2. Update the "Download Resume" link in the Experience section

## File Structure

```
├── _config.yml          # Site config
├── _layouts/
│   ├── default.html     # Base layout
│   └── post.html        # Blog post layout
├── _includes/
│   ├── nav.html         # Navigation
│   └── footer.html      # Footer
├── _posts/              # Blog posts (Markdown)
├── assets/
│   ├── css/style.css    # All styles
│   └── js/main.js       # Scroll animations + mobile nav
├── index.html           # Home page (all sections)
└── Gemfile
```
