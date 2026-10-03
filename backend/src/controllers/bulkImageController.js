import mongoose from 'mongoose';
import { Product } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
import { destroyImage, uploadBuffer } from '../config/cloudinary.js';

/** فهرست سبک همه محصولات برای تطبیق نام فایل‌ها با محصول (بدون صفحه‌بندی). */
export const imageIndex = asyncHandler(async (_req, res) => {
  const products = await Product.find({})
    .select('productNumber name slug images isActive')
    .sort({ productNumber: 1, name: 1 })
    .lean();
  return ok(res, {
    products: products.map((p) => ({
      _id: p._id, productNumber: p.productNumber ?? null, name: p.name, slug: p.slug,
      image: p.images?.[0]?.url || null, imagesCount: p.images?.length || 0, isActive: p.isActive,
    })),
  }, 'فهرست تصاویر محصولات');
});

/**
 * تعویض فله‌ای تصاویر.
 * فیلد map: آرایه JSON هم‌ترتیب با فایل‌ها، هر عضو شناسه محصول مقصد.
 * فیلد mode: replace (تصویر جدید جای همه تصاویر قبلی) یا primary (تصویر اصلی می‌شود، بقیه می‌مانند).
 */
export const bulkReplaceImages = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (!files.length) throw ApiError.badRequest('هیچ تصویری ارسال نشده است');

  let map;
  try { map = JSON.parse(req.body.map || '[]'); } catch { throw ApiError.badRequest('نگاشت فایل‌ها نامعتبر است'); }
  if (!Array.isArray(map) || map.length !== files.length) throw ApiError.badRequest('تعداد نگاشت با تعداد فایل‌ها برابر نیست');
  if (new Set(map).size !== map.length) throw ApiError.badRequest('برای یک محصول بیش از یک تصویر انتخاب شده است');
  const mode = req.body.mode === 'primary' ? 'primary' : 'replace';

  const results = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const productId = map[i];
    try {
      if (!mongoose.isValidObjectId(productId)) throw ApiError.badRequest('شناسه محصول نامعتبر است');
      const product = await Product.findById(productId);
      if (!product) throw ApiError.notFound('محصول پیدا نشد');

      const uploaded = await uploadBuffer(file.buffer, 'attari/products', file.mimetype, { nameHint: product.slug || product.name });
      if (!uploaded?.url) throw ApiError.badRequest('ذخیره تصویر انجام نشد');
      const image = { url: uploaded.url, publicId: uploaded.publicId || undefined, alt: product.name };

      const old = product.images || [];
      if (mode === 'replace') {
        product.images = [image];
        // حذف تصاویر قبلی از Cloudinary (فقط آپلودی‌ها؛ تصاویر ثابت پروژه دست نمی‌خورند)
        await Promise.allSettled(old.filter((o) => o.publicId).map((o) => destroyImage(o.publicId)));
      } else {
        product.images = [image, ...old].slice(0, 6);
      }
      await product.save();
      results.push({ file: file.originalname, productId, name: product.name, ok: true, url: image.url });
    } catch (err) {
      results.push({ file: file.originalname, productId, ok: false, error: err.message || 'خطای ناشناخته' });
    }
  }

  const done = results.filter((r) => r.ok).length;
  return ok(res, { results, done, failed: results.length - done }, `${done} تصویر جایگزین شد`);
});
