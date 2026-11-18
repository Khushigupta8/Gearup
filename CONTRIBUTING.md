# Contributing

This explains how we work on this repo. Read it once before your first change.

## Setup

You need Node 20.19 or newer. The version is in `.nvmrc`; run `nvm use` if you have nvm.

```
git clone https://github.com/Khushigupta8/Gearup.git
cd Gearup
npm run setup      # installs frontend and backend
npm run dev        # website at http://localhost:5173
```

## Workflow

`main` is the live site. Every merge to `main` deploys to production, so nobody pushes to it directly. Everything goes through a pull request.

1. **Update main:** `git checkout main && git pull`
2. **Create a branch** named `type/short-description`:
   - `feat/bike-page-video`
   - `fix/mobile-whatsapp-button`
   - `style/footer-spacing`
   - `content/workshop-prices`
   - `chore/update-vite`
3. **Commit small, clear changes** (see commit messages below).
4. **Push** and open a pull request into `main`. Fill in the template.
5. **Check the Vercel preview.** Vercel comments a preview link on the PR. Open it on desktop **and** on a phone.
6. **Wait for the checks.** The `Build` check must pass.
7. **Review:** the code owner reviews and approves.
8. **Merge** with **Squash and merge**. The branch is deleted automatically and the site goes live in about a minute.

Keep one task per branch and PR. If a PR grows past a few hundred lines, split it.

## Commit messages

Start with a short imperative summary of 72 characters or fewer. Add a body if the "why" isn't obvious.

```
Add 50cc filter to motorbikes page
Fix hero price box overlapping on slide change
```

Don't mention tools or generators in commits, PRs or code comments.

## Project structure

```
frontend/
├── *.html            one file per page, page content only
├── partials/         header.html, footer.html, icons.html (shared by every page)
├── src/
│   ├── main.js       entry, imports styles and all scripts
│   ├── styles/main.css
│   └── js/           one file per feature (ui, home, shop-by-style, bike-gallery)
└── public/assets/    images/ and fonts/, served as-is from /assets/...
backend/
├── src/server.js     API entry
└── src/routes, services, db
```

### Frontend rules

- **Header, footer, nav, icons:** edit them in `frontend/partials/`, never inside a page.
- **New page:** copy a small page such as `insurance.html`, keep the `<!-- @include … -->` lines, and set `active=` to the nav key it belongs to. Vite picks up every `.html` file in `frontend/` automatically.
- **Nav keys:** `used` (Motorbikes), `finance`, `px`, `sell`, `acc`, `ins`, `workshop`.
- **Icons:** add a `<symbol id="i-name">` to `partials/icons.html`, then use `<svg class="i"><use href="#i-name"/></svg>`.
- **CSS:** use the existing variables (`--red`, `--ink`, `--paper`, `--r`, `--sh`). Rounded boxes and slanted buttons are the house style.
- **JS:** add a new file in `src/js/` for a new feature and import it in `src/main.js`.
- **Images:**
  - Save as WebP, lowercase-hyphenated (`yamaha-mt07.webp`), in the folder that matches what it shows: `bikes`, `gallery/<make-model>`, `cutouts`, `hero`, `styles`, `accessories`, `lifestyle`, `icons`, `brands`, `logo`.
  - Reference with an absolute path: `/assets/images/...`.
  - Keep photos under about 300 KB and hero cut-outs at about 1600px wide.
- **Every change must work at 360px phone width**, with no sideways scroll.

### Backend rules

- Secrets go in `backend/.env` only, never in git. Add every new variable to `.env.example` with an empty value.
- One route file per area in `src/routes/`, and business logic in `src/services/`.

## Before you open a PR

- `npm run build` passes.
- Checked on desktop and at phone width.
- No console errors.
- New images are WebP, named and placed correctly.
- No secrets or `.env` files committed.
