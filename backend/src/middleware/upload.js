import path from 'node:path';
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_SIZE = 2 * 1024 * 1024; // ۲ مگابایت

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  // Multer 2.3+ is required. These limits also block deeply nested field
  // names and oversized sparse array indexes used in multipart DoS attacks.
  limits: {
    fileSize: MAX_SIZE,
    files: 6,
    fields: 10,
    fieldSize: 16 * 1024,
    fieldNameSize: 100,
    parts: 16,
    fieldNestingDepth: 2,
    fieldArrayIndexLimit: 20,
  },
  fileFilter(_req, file, cb) {
    const extOk = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(path.extname(file.originalname).toLowerCase());
    if (!ALLOWED.has(file.mimetype) || !extOk) {
      return cb(ApiError.badRequest('فقط تصویر با فرمت JPG، PNG، WEBP یا AVIF و حداکثر ۲ مگابایت مجاز است'));
    }
    return cb(null, true);
  },
}).array('images', 6);

/** آپلود فله‌ای تصاویر محصولات: هر درخواست تا ۲۰ فایل، هر فایل حداکثر ۵ مگابایت. */
export const BULK_MAX_FILES = 20;
export const uploadBulkImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: BULK_MAX_FILES,
    fields: 4,
    fieldSize: 64 * 1024,
    fieldNameSize: 100,
    parts: BULK_MAX_FILES + 4,
  },
  fileFilter(_req, file, cb) {
    const extOk = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(path.extname(file.originalname).toLowerCase());
    if (!ALLOWED.has(file.mimetype) || !extOk) {
      return cb(ApiError.badRequest(`فرمت فایل «${file.originalname}» مجاز نیست (فقط JPG، PNG، WEBP، AVIF)`));
    }
    return cb(null, true);
  },
}).array('images', BULK_MAX_FILES);
