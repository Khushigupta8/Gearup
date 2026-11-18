# GearUp Motorcycles: website

Static site, 17 pages. Live at https://gearup-website-ten.vercel.app. Every push to `main` deploys to production on Vercel.

## Structure

```
/                         HTML pages (index, used-bikes, bike, basket, reserve, accessories …)
assets/
├── css/site.css          all styles
├── js/site.js            all scripts (hero carousel, gallery, toggles, finance calculator)
├── fonts/                Anton, Archivo, Archivo Narrow
└── images/
    ├── logo/             GearUp logo
    ├── hero/             homepage hero bikes (HD cut-outs)
    ├── bikes/            stock photos used on cards
    ├── gallery/<bike>/   bike page photo sets, numbered in display order
    ├── cutouts/          transparent bike cut-outs
    ├── styles/           Shop by style images
    ├── accessories/      kit and product photos
    ├── lifestyle/        rider and workshop photography
    ├── icons/            Why GearUp icons
    └── brands/           manufacturer logos
```

## Adding images

Use lowercase, hyphenated names (`yamaha-mt07.webp`), save as WebP, and put each file in the folder that matches what it shows. For a new bike's gallery, create `images/gallery/<make-model>/` and number the files `01-…`, `02-…` in display order.

## Run locally

There's no build step. Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

Then open the URL it prints (usually http://localhost:3000).
