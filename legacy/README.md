# Legacy static site

The approved HTML version of the site, kept here only as the source for porting each page into `src/app`.
Nothing in this folder is built or served.

- `pages/` one HTML file per page. The `<style>` block inside a page holds that page's own CSS.
- `partials/` header, footer, icons and account menu (already ported to `src/components/layout`).
- `js/` page behaviour (tabs, finance calculator, gallery, sort and filter) to rebuild as client components.

When a page is ported, delete its file here. Delete the folder once it is empty.
