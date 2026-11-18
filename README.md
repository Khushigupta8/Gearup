# GearUp Motorcycles

Website and backend for GearUp Motorcycles, a used motorbike dealer in the UK.

- **Live site:** https://gearup-website-ten.vercel.app

```
frontend/   website: Vite, 17 pages, shared header and footer partials
backend/    API starter: structure and plan, health check only for now
```

## Frontend

```
frontend/
├── *.html            pages (each holds only its own content)
├── partials/         header.html, footer.html, icons.html, shared by every page
├── src/
│   ├── main.js       entry point, loads styles and scripts
│   ├── styles/       main.css
│   └── js/           ui.js, home.js, shop-by-style.js, bike-gallery.js
└── public/assets/
    ├── fonts/        Anton, Archivo, Archivo Narrow
    └── images/       logo, hero, bikes, gallery/<bike>, cutouts, styles,
                      accessories, lifestyle, icons, brands
```

A page pulls in the shared parts with comments, for example `<!-- @include header.html active=finance -->`, which also highlights the Finance link in the nav. To change the header or footer on every page at once, edit the file in `partials/`.

```
cd frontend
npm install
npm run dev       # local preview with live reload
npm run build     # production build into frontend/dist
```

**Images:** use lowercase, hyphenated WebP files (`yamaha-mt07.webp`), each in the folder that matches what it shows. A bike's gallery goes in `public/assets/images/gallery/<make-model>/`, numbered `01-…`, `02-…`.

## Backend

See [backend/README.md](backend/README.md).

## Deploy

Vercel builds `frontend/` on every push to `main`. Other branches get preview links.
