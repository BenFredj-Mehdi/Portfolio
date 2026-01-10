# Mehdi Ben Fredj — IT Engineering Portfolio

A personal portfolio built as a fast, responsive static website showcasing education, experience, certifications, projects, and competitions — with a contact form that sends real emails.

## Tech Stack
- HTML, CSS, JavaScript (no framework)
- Web3Forms (free plan) for the contact form email delivery
- Chatbase.co (personal chatbot integration — coming soon)
- AWS (static hosting — coming soon)

## Features
- Hero section with portrait, quick category buttons (Cybersecurity, Cloud, DevOps, AI) and an Events button
- Certifications pages with "View credential" and "View certification" buttons
- Smooth scroll, reveal-on-scroll animations, simple project filter
- Mobile-friendly layout and navigation

## Structure
- `index.html` — Home
- `cybersecurity.html`, `cloud.html`, `devops.html`, `ai.html` — category pages
- `events.html` — attended events (new category)
- `styles.css` — theme and layout
- `script.js` — interactions (nav toggle, smooth scroll, reveal, filters)
- `Images/` — assets (note the capital `I`)

## Contact Form (Web3Forms)
The contact form posts to `https://api.web3forms.com/submit` using an `access_key` (free plan). After submission, the site shows a confirmation message. No backend is needed.

## Run Locally
Open `index.html` directly, or serve the folder:

```powershell
# Python 3
python -m http.server 8000; Start-Process "http://localhost:8000"

# Or any static server
# npx serve .
```

## Deployment Notes
- Case-sensitive paths matter in production (Linux hosts). Assets live under `Images/...` — ensure references use the same capitalization.
- If CSS changes don’t appear after deployment, hard refresh (Ctrl+F5) or temporarily add `?v=2` to `styles.css` in HTML to bust cache.

## Mobile Version
This project includes a dedicated mobile stylesheet `mobile.css` loaded only on small screens via:
`<link rel="stylesheet" href="mobile.css" media="(max-width: 720px)" />`

Mobile improvements:
- Tidy stacked navigation with a toggle
- Portrait centered and sized for small screens
- CTA buttons stacked and full-width for easy tapping
- Single-column grids for certifications and projects
- Contact form optimized for small screens

## Roadmap
- Integrate Chatbase.co chatbot on the site (coming soon)
- Deploy to AWS (S3/CloudFront) with HTTPS and caching (coming soon)
