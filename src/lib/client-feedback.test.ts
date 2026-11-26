import assert from 'node:assert/strict';
import { test } from 'node:test';
import { transmissionLabel } from './bike-display';
import { vehicleLookupFields } from './vehicle-lookup';
import { blogPostSchema, blogSlug, safeContentLink } from './blog';

test('stock transmission labels omit gear counts without altering the stored specification', () => {
  for (const label of ['Manual, 5-speed', 'Manual, 6-speed', '6-speed manual']) assert.equal(transmissionLabel(label), 'Manual');
  assert.equal(transmissionLabel('Automatic CVT'), 'Automatic');
  assert.equal(transmissionLabel('Semi-automatic, 4-speed'), 'Semi-automatic');
  assert.equal(transmissionLabel(''), undefined);
});

test('registration responses use only supplied DVLA fields, including a zero-capacity electric engine', () => {
  const actual = vehicleLookupFields({ make: 'LEXMOTO', colour: 'GREY', fuelType: 'ELECTRIC', yearOfManufacture: 2024, engineCapacity: 0, motExpiryDate: '2027-11-25', model: 'invented model', gearbox: 'invented gearbox' });
  assert.deepEqual(actual, { make: 'Lexmoto', colour: 'Grey', fuel: 'Electric', year: 2024, engineCc: 0, motExpiry: '2027-11-25' });
  assert.equal(vehicleLookupFields({ colour: 123, yearOfManufacture: 'wrong' }).colour, undefined);
});

test('blog publishing requires content and prevents unsafe addresses and links', () => {
  const draft = { slug: 'test-article', title: 'Test article', excerpt: '', body: '', coverUrl: '', published: false, publishedAt: null, updatedAt: '2026-11-26T00:00:00.000Z' };
  assert.equal(blogPostSchema.safeParse(draft).success, true);
  assert.equal(blogPostSchema.safeParse({ ...draft, published: true }).success, false);
  assert.equal(blogPostSchema.safeParse({ ...draft, published: true, excerpt: 'A short introduction.', body: 'A complete article with enough text to publish.' }).success, true);
  assert.equal(blogPostSchema.safeParse({ ...draft, slug: '../private' }).success, false);
  assert.equal(blogPostSchema.safeParse({ ...draft, coverUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(blogSlug('News & Stories: GearUp!'), 'news-stories-gearup');
  for (const href of ['javascript:alert(1)', 'data:text/html,unsafe', '//outside.test', '/\\outside.test', '/%2foutside.test']) assert.equal(safeContentLink(href), false, href);
  for (const href of ['/used-bikes', '#delivery', 'https://gearupmotorcycles.co.uk', 'mailto:sales@gearupmotorcycles.co.uk']) assert.equal(safeContentLink(href), true, href);
});
