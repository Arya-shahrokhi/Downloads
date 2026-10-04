/**
 * تست‌های امنیتی خودکار برای آپلود تصاویر (middleware/upload.js)
 *
 * اجرا:  npm --prefix backend run test:security
 * بدون وابستگی اضافه: node:test + fetch/FormData داخلی Node 20.
 *
 * هر تست یک بردار حمله‌ی رایج را شبیه‌سازی می‌کند و انتظار دارد سرور
 * با 400 رد کند (نه 200 و نه 500).
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret-0123456789abcdef';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-0123456789abcdef';

let server;
let base;

// ---------- نمونه فایل‌ها ----------
// PNG واقعی ۱x۱
const PNG = Buffer.from(
  '89504e470d0a1a0a0000000d4948445200000001000000010806000000'
  + '1f15c4890000000d49444154789c6360000002000154a24f5f0000000049454e44ae426082',
  'hex',
);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
const PHP_SHELL = Buffer.from('<?php system($_GET["c"]); ?>');
const HTML_XSS = Buffer.from('<html><script>alert(document.cookie)</script></html>');
const SVG_XSS = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>');

const MB = 1024 * 1024;
const big = (bytes) => Buffer.concat([JPEG_MAGIC, Buffer.alloc(bytes - JPEG_MAGIC.length, 0)]);

/** ساخت multipart و ارسال. files: [{ buf, name, type, field? }] */
async function send(route, files, extraFields = {}) {
  const fd = new FormData();
  for (const f of files) fd.append(f.field || 'images', new Blob([f.buf], { type: f.type }), f.name);
  for (const [k, v] of Object.entries(extraFields)) fd.append(k, v);
  const res = await fetch(`${base}${route}`, { method: 'POST', body: fd });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

const img = (name = 'ok.png', buf = PNG, type = 'image/png') => ({ buf, name, type });

before(async () => {
  const { default: express } = await import('express');
  const { uploadImages, uploadBulkImages } = await import('../src/middleware/upload.js');
  const { errorHandler } = await import('../src/middleware/errorHandler.js');

  const app = express();
  const report = (req, res) => res.json({
    success: true,
    count: req.files?.length ?? 0,
    // اگر روزی storage عوض شود و فایل روی دیسک برود، این مقدار پر می‌شود
    paths: (req.files || []).map((f) => f.path ?? null),
  });
  app.post('/single', uploadImages, report);
  app.post('/bulk', uploadBulkImages, report);
  app.use(errorHandler);

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

// ---------- مسیر سالم ----------
describe('baseline', () => {
  test('valid PNG is accepted', async () => {
    const r = await send('/single', [img()]);
    assert.equal(r.status, 200);
    assert.equal(r.body.count, 1);
  });

  test('uploads stay in memory, never written to disk (path traversal safe)', async () => {
    const r = await send('/single', [img('../../../../tmp/pwn.png')]);
    assert.equal(r.status, 200);
    assert.deepEqual(r.body.paths, [null]);
  });
});

// ---------- نوع فایل ----------
describe('file type attacks', () => {
  const cases = [
    ['PHP shell with .php extension', img('shell.php', PHP_SHELL, 'application/x-php')],
    ['PHP shell spoofing image/jpeg mimetype', img('shell.php', PHP_SHELL, 'image/jpeg')],
    ['double extension shell.jpg.php', img('shell.jpg.php', PHP_SHELL, 'image/jpeg')],
    ['HTML/XSS file', img('xss.html', HTML_XSS, 'text/html')],
    ['HTML disguised as .jpg but text/html mimetype', img('xss.jpg', HTML_XSS, 'text/html')],
    ['SVG with onload XSS', img('logo.svg', SVG_XSS, 'image/svg+xml')],
    ['SVG renamed to .png', img('logo.png', SVG_XSS, 'image/svg+xml')],
    ['executable', img('setup.exe', Buffer.from('MZ\x90\x00'), 'application/octet-stream')],
    ['file without extension', img('noext', PNG, 'image/png')],
    ['null-byte filename', img('shell.php.png', PHP_SHELL, 'image/png')],
  ];
  for (const [title, file] of cases) {
    test(`rejects: ${title}`, async () => {
      const r = await send('/single', [file]);
      if (title === 'null-byte filename') {
        // یا رد شود، یا اگر قبول شد حداقل روی دیسک نرفته باشد
        assert.ok(r.status === 400 || (r.status === 200 && r.body.paths.every((p) => p === null)));
        return;
      }
      assert.equal(r.status, 400, `expected 400, got ${r.status}`);
    });
  }

  test('mixed batch: one bad file rejects the whole request', async () => {
    const r = await send('/single', [img(), img('shell.php', PHP_SHELL, 'image/jpeg')]);
    assert.equal(r.status, 400);
  });

  // این تست فعلاً todo است: الان فقط mimetype و پسوند (هر دو از سمت کلاینت) چک می‌شود.
  // بعد از اضافه شدن چک magic bytes (مثلاً با file-type یا sharp)، todo را بردارید.
  test('rejects PHP content renamed to .jpg with image/jpeg mimetype (magic-byte check)', {
    todo: 'needs server-side magic-byte validation in upload.js',
  }, async () => {
    const r = await send('/single', [img('innocent.jpg', PHP_SHELL, 'image/jpeg')]);
    assert.equal(r.status, 400);
  });
});

// ---------- DoS / محدودیت‌ها ----------
describe('size and count limits (DoS)', () => {
  test('single: file over 2MB is rejected', async () => {
    const r = await send('/single', [img('big.jpg', big(2 * MB + 1), 'image/jpeg')]);
    assert.equal(r.status, 400);
  });

  test('single: exactly 2MB is accepted', async () => {
    const r = await send('/single', [img('edge.jpg', big(2 * MB), 'image/jpeg')]);
    assert.equal(r.status, 200);
  });

  test('single: more than 6 files is rejected', async () => {
    const files = Array.from({ length: 7 }, (_, i) => img(`f${i}.png`));
    const r = await send('/single', files);
    assert.equal(r.status, 400);
  });

  test('single: unexpected field name is rejected', async () => {
    const r = await send('/single', [{ ...img(), field: 'avatar' }]);
    assert.equal(r.status, 400);
  });

  test('single: too many text fields is rejected', async () => {
    const fields = Object.fromEntries(Array.from({ length: 11 }, (_, i) => [`f${i}`, 'x']));
    const r = await send('/single', [img()], fields);
    assert.equal(r.status, 400);
  });

  test('single: oversized text field is rejected', async () => {
    const r = await send('/single', [img()], { note: 'a'.repeat(16 * 1024 + 1) });
    assert.equal(r.status, 400);
  });

  test('single: overly long field name is rejected', async () => {
    const r = await send('/single', [img()], { ['x'.repeat(101)]: '1' });
    assert.equal(r.status, 400);
  });

  test('bulk: file over 5MB is rejected', async () => {
    const r = await send('/bulk', [img('big.jpg', big(5 * MB + 1), 'image/jpeg')]);
    assert.equal(r.status, 400);
  });

  test('bulk: more than 20 files is rejected', async () => {
    const files = Array.from({ length: 21 }, (_, i) => img(`f${i}.png`));
    const r = await send('/bulk', files);
    assert.equal(r.status, 400);
  });

  test('bulk: rejects disguised PHP', async () => {
    const r = await send('/bulk', [img('x.php', PHP_SHELL, 'image/jpeg')]);
    assert.equal(r.status, 400);
  });

  test('server never answers 500 on malformed multipart', async () => {
    const res = await fetch(`${base}/single`, {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data; boundary=----broken' },
      body: '------broken\r\nContent-Disposition: form-data; name="images"; filename="a.png"\r\n\r\nnope',
    });
    assert.ok(res.status < 500, `got ${res.status}`);
  });
});
