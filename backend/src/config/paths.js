/**
 * مسیرهای ذخیره‌سازی با پشتیبانی persistent disk برای production.
 * Render: PRODUCTS_PERSISTENT_DIR خودش از disk تعریف‌شده می‌آید.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repoRoot = path.resolve(backendRoot, '..');

// persistent disk برای production (اختیاری؛ پیش‌فرض: ریپو)
const persistentDir = process.env.PRODUCTS_PERSISTENT_DIR || repoRoot;

export const paths = {
  repoRoot,
  backendRoot,
  persistentDir,
  seedDir: path.join(persistentDir, 'backend', 'src', 'seed'),
  adminProductsJson: path.join(persistentDir, 'backend', 'src', 'seed', 'adminProducts.json'),
  adminProductsJs: path.join(persistentDir, 'backend', 'src', 'seed', 'adminProducts.js'),
  publicImageDir: path.join(persistentDir, 'frontend', 'public', 'images', 'products', 'admin'),
  publicImageUrl: '/images/products/admin/',
};
