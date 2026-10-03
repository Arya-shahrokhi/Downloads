import { Category, Product, SeoRedirect } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';
import { normalizeSlugInput, uniqueSlug } from '../utils/slug.js';
import { pick } from '../utils/pick.js';
import { categorySlugFor } from '../seo/shared.js';
import { invalidateSitemap } from '../seo/sitemap.js';

const EDITABLE = ['name', 'description', 'icon', 'image', 'parent', 'order', 'isActive',
  'seoTitle', 'seoDescription', 'intro', 'faqs'];

/** Admin-typed slug → known English slug for the name → transliterated name. */
const resolveSlug = (requested, name, ignoreId) => {
  const custom = requested ? normalizeSlugInput(requested) : '';
  return uniqueSlug(Category, custom || categorySlugFor(name) || name, ignoreId);
};

export const listCategories = asyncHandler(async (req, res) => {
  const wantsAll = req.query.all === 'true';

  // پنل مدیریت با توکن منقضی: optionalAuth بی‌صدا کاربر را مهمان حساب می‌کرد و فقط
  // دسته‌های فعال برمی‌گشت (دسته‌های غیرفعال از پنل غیب می‌شدند). حالا 401 می‌دهیم
  // تا فرانت توکن را تازه کند و دوباره درخواست بزند.
  if (wantsAll && req.headers.authorization && !req.user) {
    throw ApiError.unauthorized('نشست شما منقضی شده است، دوباره وارد شوید');
  }

  const isAdminView = wantsAll && req.user?.role === 'ADMIN';
  if (isAdminView) res.set('Cache-Control', 'no-store');

  const categories = await Category.find(isAdminView ? {} : { isActive: true }).sort({ order: 1, name: 1 }).lean();
  // شمارش محصولات با یک aggregate، نه یک کوئری به ازای هر دسته.
  // نمای مدیریت همه‌ی محصولات را می‌شمارد (همان چیزی که جلوی حذف دسته را می‌گیرد).
  const counts = await Product.aggregate([
    ...(isAdminView ? [] : [{ $match: { isActive: true } }]),
    { $group: { _id: '$category', count: { $sum: 1 }, active: { $sum: { $cond: ['$isActive', 1, 0] } } } },
  ]);
  const map = new Map(counts.map((c) => [String(c._id), c]));
  return ok(res, {
    categories: categories.map((c) => {
      const n = map.get(String(c._id));
      return {
        ...c,
        productsCount: n?.count || 0,
        ...(isAdminView ? { activeProductsCount: n?.active || 0 } : {}),
      };
    }),
  }, 'دسته‌بندی‌ها');
});

export const createCategory = asyncHandler(async (req, res) => {
  const data = pick(req.body, EDITABLE);
  data.slug = await resolveSlug(req.body.slug, data.name);
  const category = await Category.create(data);
  await SeoRedirect.clearPath(`/category/${category.slug}`);
  invalidateSitemap();
  return created(res, { category }, 'دسته‌بندی ایجاد شد');
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('دسته‌بندی پیدا نشد');
  const data = pick(req.body, EDITABLE);
  const oldSlug = category.slug;
  const requested = req.body.slug !== undefined ? normalizeSlugInput(req.body.slug) : '';
  if (requested && requested !== oldSlug) data.slug = await resolveSlug(requested, data.name || category.name, category._id);
  else if (!requested && data.name && data.name !== category.name) data.slug = await resolveSlug('', data.name, category._id);
  category.set(data);
  await category.save();
  if (category.slug !== oldSlug) {
    // Old category URL keeps its rankings/backlinks via a permanent redirect
    await SeoRedirect.recordMove(`/category/${oldSlug}`, `/category/${category.slug}`, 'category');
  }
  invalidateSitemap();
  return ok(res, { category }, 'دسته‌بندی به‌روزرسانی شد');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse) throw ApiError.badRequest(`${inUse} محصول در این دسته‌بندی است، ابتدا آن‌ها را منتقل کنید`);
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound('دسته‌بندی پیدا نشد');
  await SeoRedirect.recordGone(`/category/${category.slug}`, 'category');
  invalidateSitemap();
  return ok(res, {}, 'دسته‌بندی حذف شد');
});
