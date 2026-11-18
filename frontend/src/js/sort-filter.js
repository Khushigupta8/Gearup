// Sorting and filtering for the accessories grid and the motorbikes listing.

const num = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || 0;
const text = (el, sel) => el.querySelector(sel)?.textContent || '';

/** Re-append items in a new order without moving any non-item tiles (e.g. promo tiles). */
function reorder(grid, items, sorted) {
  const slots = items.map((el) => el.previousElementSibling);
  const fixed = [...grid.children].filter((el) => !items.includes(el)).map((el) => [el, [...grid.children].indexOf(el)]);
  sorted.forEach((el) => grid.appendChild(el));
  fixed.forEach(([el, i]) => grid.insertBefore(el, grid.children[i] || null));
  void slots;
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
  sortSel.addEventListener('change', () => reorder(grid, items, [...items].sort(sorters[sortSel.value] || sorters.new)));
})();
