import { v2 as cloudinary } from 'cloudinary';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';
import { toSlug } from '../utils/slug.js';

/** "گل گاوزبان" → "gol-gavzaban-3f9a1c" : descriptive, unique, URL-safe file names (image SEO). */
const fileBaseName = (nameHint) => {
  const base = nameHint ? toSlug(String(nameHint).slice(0, 120)).slice(0, 60) : '';
  const suffix = crypto.randomBytes(3).toString('hex');
  return base ? `${base}-${suffix}` : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
};

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const uploadsRoot = path.join(backendRoot, 'uploads');

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

/** آپلود بافر به Cloudinary؛ در صورت غیرفعال بودن، null برمی‌گرداند تا ذخیره محلی انجام شود. */
export async function uploadBuffer(buffer, folder = 'attari/products', mimetype = 'image/jpeg', { nameHint } = {}) {
  const baseName = fileBaseName(nameHint);
  if (!env.cloudinary.enabled) {
    const extension = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }[mimetype]) || 'jpg';
    const filename = `${baseName}.${extension}`;
    const absoluteDir = path.join(uploadsRoot, 'products');
    await mkdir(absoluteDir, { recursive: true });
    await writeFile(path.join(absoluteDir, filename), buffer);
    return { url: `/uploads/products/${filename}`, publicId: null };
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      // public_id gives a meaningful URL; delivery-time f_auto/q_auto/w_ (WebP/AVIF + resizing)
      // is added by the frontend SmartImage component.
      { folder, public_id: baseName, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => (error ? reject(error) : resolve({ url: result.secure_url, publicId: result.public_id })),
    );
    stream.end(buffer);
  });
}

export async function destroyImage(publicId) {
  if (!env.cloudinary.enabled || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
