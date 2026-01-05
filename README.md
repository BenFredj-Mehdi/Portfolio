# Mehdi Ben Fredj — IT Engineering Portfolio

This is a small static portfolio template (dark IT-themed) to introduce yourself. It includes sections for Competitions, Certifications, Cursus, and Projects, plus simple dynamic features (filtering, modal, reveal-on-scroll).

Quick start (Windows PowerShell):

```powershell
# Open locally in your browser (double-click `index.html`), or run a simple server:
# If you have Python 3 installed:
python -m http.server 8000; Start-Process "http://localhost:8000"

# Or with PowerShell's built-in Serve (if available):
# Serve-PS -Port 8000
```

Files:
- `index.html` — main page
- `styles.css` — dark theme and layout
- `script.js` — interactivity (nav, scroll reveal, filter, modal)

New pages:
- `cybersecurity.html` — certifications and projects for Cybersecurity
- `cloud.html` — certifications and projects for Cloud
- `devops.html` — certifications and projects for DevOps
- `ai.html` — certifications and projects for AI

How to customize:
- Replace placeholder cards under each section with your real content.
- Add images/screenshots to projects and update the modal HTML in `script.js`.
- Change colors in `styles.css` at the `:root` variables to adjust the theme.

 
Background behavior:
- The site now uses a tiled (duplicated) `images/background.jfif` with a dark overlay so the image repeats across the page. To change background behavior edit the `background-image`, `background-size`, and `background-repeat` rules in `styles.css`.
JSON-driven certifications (new)
`data/certifications.json`: store all your certifications here as an array of objects. Example fields: `title`, `issuer`, `issued_on` (ISO date), `description`, `domain` (one of `cybersecurity|cloud|devops|ai`), `url`, `image`.
`certifications.html` loads the JSON and provides a domain filter UI.

Next suggestions I can implement for you:
- Add a CMS-friendly JSON file and render entries from it
- Add contact form with form validation and Netlify/Formspree integration
- Add deployment instructions (GitHub Pages or Netlify)
