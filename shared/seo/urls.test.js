import test from 'node:test';
import assert from 'node:assert/strict';
import {
  absoluteUrl,
  canonicalPathFor,
  isPrivatePath,
  normalizePath,
  robotsFor,
} from './urls.js';

test('normalizePath removes duplicate and trailing slashes', () => {
  assert.equal(normalizePath('//products///'), '/products');
  assert.equal(normalizePath('/'), '/');
});

test('canonicalPathFor drops search, sort and filter parameters', () => {
  assert.equal(
    canonicalPathFor('/products/', '?search=سنبل&sort=popular&minPrice=100&page=2'),
    '/products?page=2',
  );
  assert.equal(canonicalPathFor('/products', '?page=1'), '/products');
});

test('canonicalPathFor preserves only valid page numbers greater than one', () => {
  assert.equal(canonicalPathFor('/products', '?page=0'), '/products');
  assert.equal(canonicalPathFor('/products', '?page=3'), '/products?page=3');
});

test('private routes are marked noindex and nofollow', () => {
  assert.equal(isPrivatePath('/checkout'), true);
  assert.equal(isPrivatePath('/account/orders'), true);
  assert.equal(robotsFor('/checkout'), 'noindex, nofollow');
});

test('search and filter query variants are noindex, follow', () => {
  assert.equal(robotsFor('/products', '?search=سنبل'), 'noindex, follow');
  assert.equal(robotsFor('/products', '?sort=popular'), 'noindex, follow');
});

test('clean public URLs remain indexable', () => {
  assert.match(robotsFor('/products'), /^index, follow/);
  assert.match(robotsFor('/products', '?page=2'), /^index, follow/);
});

test('absoluteUrl encodes Persian path segments and preserves query strings', () => {
  assert.equal(
    absoluteUrl('https://kallavaran.com/', '/journal/گیاه-دارویی?page=2'),
    'https://kallavaran.com/journal/%DA%AF%DB%8C%D8%A7%D9%87-%D8%AF%D8%A7%D8%B1%D9%88%DB%8C%DB%8C?page=2',
  );
});
