import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const required = [
  'backend/src/server.js',
  'frontend/src/main.jsx',
  'frontend/public/images/brand/kalavaran-logo.png',
  'frontend/vite.config.js',
];
for (const file of required) {
  if (!existsSync(resolve(file))) throw new Error(`فایل لازم پیدا نشد: ${file}`);
}
const app = readFileSync('backend/src/app.js', 'utf8');
if (!app.includes("app.use('/api'")) throw new Error('مسیر API ثبت نشده است');
if (!app.includes('frontendDist')) throw new Error('سرو فرانت در production تنظیم نشده است');
console.log('PASS: ساختار و تنظیمات اجرای پروژه سالم است');
