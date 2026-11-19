// Sorting and filtering for the accessories grid and the motorbikes listing.

const num = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || 0;
const text = (el, sel) => el.querySelector(sel)?.textContent || '';

/** Re-append items in a new order. Non-item tiles (e.g. the promo tile) keep the slot they had on page load. */
const slotsOf = new WeakMap();
function reorder(grid, items, sorted) {
  if (!slotsOf.has(grid)) slotsOf.set(grid, [...grid.children].map((el, i) => [el, i]).filter(([el]) => !items.includes(el)));
  const fixed = slotsOf.get(grid);
  fixed.forEach(([el]) => el.remove());
  sorted.forEach((el) => grid.appendChild(el));
  fixed.forEach(([el, i]) => grid.insertBefore(el, grid.children[i] || null));
}

// ---------- Accessories ----------
(function accessories() {
  const grid = document.getElementById('kitGrid');
  if (!grid) return;
  const items = [...grid.querySelectorAll('.prod')];
  const sortSel = document.getElementById('srt');
  const search = document.getElementById('ks');
  const chips = [...document.querySelectorAll('.shop-cats .chip[data-cat]')];
  const count = document.getElementById('kitCount');
  let cat = 'all';

  const price = (el) => num(text(el, '.pp b'));
  const sorters = {
    pop: (a, b) => a.dataset.pop - b.dataset.pop,
    'price-asc': (a, b) => price(a) - price(b),
    'price-desc': (a, b) => price(b) - price(a),
    new: (a, b) => a.dataset.new - b.dataset.new,
  };

  let empty = document.createElement('p');
  empty.className = 'kit-empty muted';
  empty.hidden = true;
  grid.after(empty);

  function apply() {
    const q = (search?.value || '').trim().toLowerCase();
    let shown = 0;
    items.forEach((el) => {
      const hay = (text(el, 'h3') + ' ' + text(el, '.br') + ' ' + el.dataset.cat).toLowerCase();
      const ok = (cat === 'all' || el.dataset.cat === cat) && (!q || q.split(/\s+/).every((w) => hay.includes(w)));
      el.hidden = !ok;
      if (ok) shown++;
    });
    reorder(grid, items, [...items].sort(sorters[sortSel?.value] || sorters.pop));
    if (count) count.textContent = shown === items.length && !q && cat === 'all' ? 'Showing 8 of 48 products' : `${shown} product${shown === 1 ? '' : 's'}`;
    empty.hidden = shown > 0;
    empty.textContent = q ? `No kit matches "${search.value.trim()}". Try another word or clear the search.` : 'Nothing in this category yet.';
  }

  sortSel?.addEventListener('change', apply);
  search?.addEventListener('input', apply);
  search?.closest('form')?.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  chips.forEach((c) => c.addEventListener('click', () => {
    cat = c.dataset.cat;
    chips.forEach((x) => x.classList.toggle('on', x === c));
    apply();
  }));
})();

// ---------- Motorbikes listing ----------
(function bikes() {
  const grid = document.getElementById('bikeGrid');
  const sortSel = document.getElementById('srt');
  if (!grid || !sortSel) return;
  const items = [...grid.querySelectorAll('.bc')];
  items.forEach((el, i) => { el.dataset.i = i; });

  const spec = (el, icon) => num(el.querySelector(`.sp use[href="#${icon}"]`)?.closest('span')?.textContent);
  const price = (el) => num(text(el, '.pricechip b'));
  const monthly = (el) => num(text(el, '.pricechip > span'));
  const sorters = {
    new: (a, b) => a.dataset.i - b.dataset.i,
    'price-asc': (a, b) => price(a) - price(b),
    'price-desc': (a, b) => price(b) - price(a),
    'mo-asc': (a, b) => monthly(a) - monthly(b),
    'miles-asc': (a, b) => spec(a, 'i-gauge') - spec(b, 'i-gauge'),
    'year-desc': (a, b) => spec(b, 'i-cal') - spec(a, 'i-cal'),
  };
  // Pagination: 8 bikes a page (plus the promo tile on page 1 makes a full 3 x 3 grid).
  const PER = 8;
  const pager = document.querySelector('.pager');
  const fixed = [...grid.children].filter((el) => !items.includes(el));
  const pages = Math.ceil(items.length / PER);
  let page = 1;

  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  function drawPager() {
    if (!pager) return;
    if (pages < 2) { pager.hidden = true; return; }
    let h = page > 1 ? `<a href="#" data-p="${page - 1}" aria-label="Previous page">${icon('i-left')}</a>` : '';
    for (let p = 1; p <= pages; p++) h += `<a href="#" data-p="${p}"${p === page ? ' class="on" aria-current="page"' : ''}>${p}</a>`;
    if (page < pages) h += `<a href="#" data-p="${page + 1}" aria-label="Next page">${icon('i-right')}</a>`;
    pager.innerHTML = h;
  }

  function render() {
    const sorted = [...items].sort(sorters[sortSel.value] || sorters.new);
    reorder(grid, items, sorted);
    sorted.forEach((el, i) => { el.hidden = Math.floor(i / PER) + 1 !== page; });
    fixed.forEach((el) => { el.hidden = page !== 1; });
    drawPager();
  }

  sortSel.addEventListener('change', () => { page = 1; render(); });
  pager?.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-p]');
    if (!a) return;
    e.preventDefault();
    page = Number(a.dataset.p);
    render();
    grid.parentElement.querySelector('.toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  render();
})();
