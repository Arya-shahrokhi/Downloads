import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, 'backend/.env');

if (!existsSync(envPath)) {
  await copyFile(resolve(root, 'backend/.env.example'), envPath);
  let value = await readFile(envPath, 'utf8');
  // رمز ادمین توسعه: تصادفی و یکتا برای هر نصب، نه یک مقدار ثابت در سورس
  const adminPassword = randomBytes(18).toString('base64url');
  value = value
    .replace('JWT_ACCESS_SECRET=', `JWT_ACCESS_SECRET=${randomBytes(32).toString('hex')}`)
    .replace('JWT_REFRESH_SECRET=', `JWT_REFRESH_SECRET=${randomBytes(32).toString('hex')}`)
    .replace(/^ADMIN_PASSWORD=$/m, `ADMIN_PASSWORD=${adminPassword}`);
  await writeFile(envPath, value);
  console.log('[setup] backend/.env و کلیدهای امن ساخته شد');
  console.log(`[setup] رمز ادمین توسعه (در backend/.env هم ذخیره شد): ${adminPassword}`);
}

if (!existsSync(resolve(root, 'frontend/.env'))) {
  await copyFile(resolve(root, 'frontend/.env.example'), resolve(root, 'frontend/.env'));
  console.log('[setup] frontend/.env ساخته شد');
}
