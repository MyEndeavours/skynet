# Skynet Logistics website

A static website: plain HTML, CSS and JavaScript. There is no build step.

## What's in here

| File | What it does |
| --- | --- |
| `index.html` | The page itself |
| `projects.js` | **Your projects, email address and availability. This is the only file you need to edit.** |
| `styles.css` | Look and layout |
| `script.js` | Animations, project viewer and contact form. No edits needed. |
| `assets/` | Logo files and icons |
| `assets/projects/` | Put project screenshots here |
| `_headers` | Security and caching settings for Cloudflare |
| `robots.txt` | Lets search engines index the site |

## Deploy to Cloudflare (via GitHub)

1. **Create a GitHub repository.** Sign in at github.com, click **New repository**, name it (e.g. `skynet-logistics-site`), then click **Create repository**. Private or public both work.
2. **Upload the files.** On the new repository page, click **uploading an existing file**. Open this folder on your computer, select **everything inside it** (not the folder itself), and drag it onto the page. `index.html` must sit at the top level of the repository. Click **Commit changes**.
3. **Connect Cloudflare.** Sign in at dash.cloudflare.com and go to **Workers & Pages**, then **Create**. Choose the **Pages** tab, then **Connect to Git** / **Import an existing Git repository**. Authorise GitHub (you can limit access to just this repository) and select the repository.
4. **Build settings.** Framework preset: **None**. Build command: leave **empty**. Build output directory: leave empty (or `/`). Click **Save and Deploy**.
5. **Visit your site.** After about a minute you'll get an address like `https://skynet-logistics-site.pages.dev`.
6. **Add your domain (optional).** In the project, open **Custom domains**, click **Set up a custom domain** and follow the prompts. If your domain already uses Cloudflare, the DNS record is created for you.

From then on, **every change you commit to GitHub goes live automatically** within a minute or so.

## Before you go live

Open `projects.js` on GitHub (click the file, then the pencil icon) and change:

- `email` – where contact-form briefs are sent (currently `hello@yourdomain.com`)
- `availability` and `responseTime`
- `budgets` – the budget ranges in the form
- `PROJECTS` – the six entries are **samples**. Replace them with your real projects.

## Adding a project

Copy one of the entries in `PROJECTS` and edit it. Each project has:

- `name`, `category` (`'Website'` or `'Service platform'`; any new category automatically becomes a filter), `year`
- `summary` – one line shown in the list
- `brief`, `built` (a list), `outcome`, `stack` (a list) – shown in the project details window
- `url` – live link (adds "Visit live site" buttons)
- `image` – screenshot, e.g. `'assets/projects/my-project.webp'`. Upload the image into `assets/projects/` first. Best size: 1600 × 1000 px (16:10).
- `code` – tracking number (optional, generated if left out)
- `preview` – only used when there's no `image`; controls the drawn preview


Leave any field empty (`''` or `[]`) and that part is hidden.

## Contact form

With no setup, the form opens the visitor's email app with their brief filled in. To receive submissions without that step, create a free form endpoint (e.g. Formspree) and paste its URL into `formEndpoint` in `projects.js`.
