import assert from 'node:assert/strict';
import { test } from 'node:test';
import { adminUploadPolicy } from './admin-upload-policy';
import { safeAccountPath } from './auth-redirect';
import { applyFilters, countBy, matchesBikeSearch, parseFilters, setHref, toggleHref } from './bike-filters';
import { valuationHref, valuationPrefill } from './valuation-prefill';
import type { Bike } from '@/types';

const base: Bike = { slug: 'titan-2020', year: 2020, make: 'Lexmoto', model: 'Titan 125', registration: 'YT20 OCS', price: 1295, mileage: 4200, engineCc: 125, style: 'scooter', image: '/bike.webp', status: 'available' };
const bikes: Bike[] = [base, { ...base, slug: 'titan-2024', year: 2024, registration: 'PL73 YYV', price: 1549 }, { ...base, slug: 'keeway', make: 'Keeway', model: 'RKS 125', registration: undefined, style: 'naked', price: 1895 }];

test('stock search distinguishes identical models by registration and accepts reordered words', () => {
  assert.deepEqual(applyFilters(bikes, parseFilters({ q: 'yt20ocs' })).map((b) => b.slug), ['titan-2020']);
  assert.equal(applyFilters(bikes, parseFilters({ q: '125 TITAN' })).length, 2);
  assert.equal(matchesBikeSearch(base, '2024 Titan'), false);
  assert.equal(matchesBikeSearch(bikes[2], 'missing-registration'), false);
});

test('model, search and price filters combine and option counts respect the search', () => {
  const filters = parseFilters({ model: 'titan125', q: 'Lexmoto', max: '1400' });
  assert.deepEqual(applyFilters(bikes, filters).map((b) => b.slug), ['titan-2020']);
  assert.equal(countBy(bikes, parseFilters({ q: 'Titan' }), 'make', (b) => b.make === 'Keeway'), 0);
  assert.equal(applyFilters(bikes, parseFilters({ q: 'unlisted bike' })).length, 0);
});

test('changing a filter preserves one verbatim search value, including punctuation', () => {
  const query = 'Titan, 125 & YT20 OCS';
  const changed = new URL(setHref({ q: query, make: 'lexmoto' }, 'max', '1500'), 'https://gearup.test');
  assert.deepEqual(changed.searchParams.getAll('q'), [query]);
  assert.equal(changed.searchParams.get('make'), 'lexmoto');
  assert.equal(toggleHref({ q: query, model: 'titan125' }, 'q'), '/used-bikes?model=titan125');
});

test('valuation handoff preserves registration and comma-separated mileage for the chosen form', () => {
  const sell = new URL(valuationHref('/sell-your-bike', 'ab12 cde', '8,500'), 'https://gearup.test');
  assert.equal(sell.pathname, '/sell-your-bike');
  assert.equal(sell.hash, '#value');
  assert.equal(sell.searchParams.get('registration'), 'AB12 CDE');
  assert.equal(sell.searchParams.get('mileage'), '8500');
  assert.equal(new URL(valuationHref('/part-exchange', '', '0'), 'https://gearup.test').searchParams.get('mileage'), '0');
  assert.deepEqual(valuationPrefill({ registration: ['yt20 ocs', 'ignore'], mileage: '-50' }), { registration: 'YT20 OCS', mileage: '' });
  assert.equal(valuationPrefill({ mileage: '999999999' }).mileage, '');
});

test('sign-in return paths cannot leave the site or loop back to sign-in', () => {
  for (const path of ['https://outside.test', '//outside.test', '/\\outside.test', '/\t/outside.test', '/%2Foutside.test', '/%5Coutside.test', '/admin/../login', '/login/', '/admin/login']) {
    assert.equal(safeAccountPath(path), '/account', path);
  }
  assert.equal(safeAccountPath('/used-bikes/titan/reserve?from=stock#details'), '/used-bikes/titan/reserve?from=stock#details');
  assert.equal(safeAccountPath('/account?tab=saved'), '/account?tab=saved');
});

test('DMS upload tokens are limited to intended destinations, matching types and sizes', () => {
  assert.deepEqual(adminUploadPolicy('bikes/bike-123/main/photo.webp')?.allowedContentTypes, ['image/webp']);
  assert.equal(adminUploadPolicy('bikes/bike-123/receipt/invoice.jpg')?.maximumSizeInBytes, 8 * 1024 * 1024);
  assert.equal(adminUploadPolicy('bikes/bike-123/video/walkaround.mp4')?.maximumSizeInBytes, 500 * 1024 * 1024);
  assert.ok(adminUploadPolicy('cms/hero/banner.png'));
  assert.ok(adminUploadPolicy('promos/finance.webp'));
  assert.ok(adminUploadPolicy('products/helmet.webp'));
  for (const path of ['bikes/../main/photo.webp', 'bikes/unknown/private/file.webp', 'bikes/bike-123/main/script.svg', 'bikes/bike-123/main/video.mp4', 'bikes/bike-123/video/photo.png', 'cms/../../secret.png', 'enquiries/private.webp', 'https://outside.test/photo.png', 'promos/banner.webp?rewrite=1']) {
    assert.equal(adminUploadPolicy(path), null, path);
  }
});
