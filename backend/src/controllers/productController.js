import { Category, Product, Review, SeoRedirect } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';
import { getPaging, meta } from '../utils/pagination.js';
import { normalizeSlugInput, uniqueSlug } from '../utils/slug.js';
import { buildProductSeo } from '../seo/shared.js';
import { seoOptions, shareImageFor } from '../seo/context.js';
import { invalidateSitemap } from '../seo/sitemap.js';
import { pick } from '../utils/pick.js';
import { uploadBuffer } from '../config/cloudinary.js';

const EDITABLE = ['productNumber', 'name', 'description', 'shortDescription', 'category', 'price', 'discount', 'stock', 'unit',
  'weight', 'ingredients', 'usage', 'benefits', 'origin', 'images', 'isFeatured', 'isPopular', 'isActive',
  'seoTitle', 'seoDescription'];

/** Public SEO payload (same builder the server uses for the HTML head). */
const withSeo = (product) => {
  const plain = typeof product.toObject === 'function' ? product.toObject({ virtuals: true }) : product;
  return buildProductSeo(plain, { ...seoOptions(), shareImage: shareImageFor(plain.images?.[0]?.url) });
};

/**
 * Slug for create/update: an admin-typed slug wins (normalised to clean ASCII),
 * otherwise it's generated from the name. Always unique.
 */
const resolveSlug = async (requested, name, ignoreId) => {
  const custom = requested ? normalizeSlugInput(requested) : '';
  return uniqueSlug(Product, custom || name, ignoreId);
};

const SORTS = {
  catalog: { productNumber: 1, name: 1 },
  newest: { createdAt: -1 },
  cheapest: { price: 1 },
  expensive: { price: -1 },
  popular: { soldCount: -1, rating: -1 },
  discount: { discount: -1 },
  rating: { rating: -1, reviewsCount: -1 },
};

const isTrue = (value) => value === true || value === 'true' || value === 1 || value === '1';

export const listProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, minRating, inStock, discounted, featured, popular, premium, sort } = req.query;
  const { page, limit, skip } = getPaging(req.query);
  const wantsPremium = isTrue(premium);

  const filter = { isActive: true };
  if (search) filter.$text = { $search: search };
  if (category || wantsPremium) {
    if (wantsPremium && !category) {
      const premiumCategories = await Category.find({ name: { $in: ['ادویه‌ها', 'برنج و غلات'] } }).select('_id').lean();
      const ids = premiumCategories.map((doc) => doc._id);
      if (!ids.length) return ok(res, { products: [], meta: meta(0, page, limit) }, 'محصولی یافت نشد');
      filter.category = { $in: ids };
    } else {
      const categoryQuery = { $or: [{ slug: category }, ...(category.match(/^[0-9a-f]{24}$/i) ? [{ _id: category }] : [])] };
      const doc = await Category.findOne(categoryQuery);
      if (!doc) return ok(res, { products: [], meta: meta(0, page, limit) }, 'محصولی یافت نشد');
      filter.category = doc._id;
    }
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = { ...(minPrice !== undefined ? { $gte: minPrice } : {}), ...(maxPrice !== undefined ? { $lte: maxPrice } : {}) };
  }
  if (minRating !== undefined) filter.rating = { $gte: minRating };
  if (isTrue(inStock)) filter.stock = { $gt: 0 };
  if (isTrue(discounted)) filter.discount = { $gt: 0 };
  if (isTrue(featured)) filter.isFeatured = true;
  if (isTrue(popular)) filter.isPopular = true;

  const sortStage = search && (!sort || sort === 'relevance')
    ? { score: { $meta: 'textScore' } }
    : SORTS[sort] || SORTS.catalog;

  const projection = search ? { score: { $meta: 'textScore' } } : {};

  const [products, total] = await Promise.all([
    Product.find(filter, projection)
      .select('-description -usage -__v')
      .populate('category', 'name slug')  // یک کوئری اضافه، نه N+1
      .sort(sortStage)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true }),
    Product.countDocuments(filter),
  ]);

  return ok(res, { products, meta: meta(total, page, limit) }, 'لیست محصولات');
});

export const getProduct = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const query = key.match(/^[0-9a-f]{24}$/i) ? { $or: [{ _id: key }, { slug: key }] } : { slug: key.toLowerCase() };
  // ادمین باید بتواند محصولات غیرفعال را هم برای ویرایش باز کند؛ مشتری فقط فعال‌ها را ببیند.
  const visibility = req.user?.role === 'ADMIN' ? {} : { isActive: true };
  let product = await Product.findOne({ ...query, ...visibility }).populate('category', 'name slug');
  let redirect = null;

  if (!product) {
    // SEO: renamed products keep working (301 history), deleted ones answer 410 Gone.
    const moved = await SeoRedirect.findOne({ fromPath: `/products/${key}` }).lean();
    if (moved?.statusCode === 410) throw new ApiError(410, 'این محصول دیگر در فروشگاه عرضه نمی‌شود');
    if (moved?.toPath?.startsWith('/products/')) {
      const target = moved.toPath.slice('/products/'.length);
      product = await Product.findOne({ slug: target, ...visibility }).populate('category', 'name slug');
      if (product) redirect = `/products/${product.slug}`;
    }
  }
  if (!product) throw ApiError.notFound('محصول پیدا نشد');

  const related = await Product.find({ category: product.category?._id, _id: { $ne: product._id }, isActive: true })
    .select('name slug price discount oldPrice rating reviewsCount images stock')
    .sort({ soldCount: -1 })
    .limit(8)
    .lean({ virtuals: true });

  return ok(res, { product, related, seo: withSeo(product), ...(redirect ? { redirect } : {}) }, 'جزئیات محصول');
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = pick(req.body, EDITABLE);
  data.slug = await resolveSlug(req.body.slug, data.name);
  const product = await Product.create(data);
  await SeoRedirect.clearPath(`/products/${product.slug}`); // URL is live again
  invalidateSitemap();
  return created(res, { product }, 'محصول ایجاد شد');
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('محصول پیدا نشد');
  const data = pick(req.body, EDITABLE);
  const oldSlug = product.slug;
  const requested = req.body.slug !== undefined ? normalizeSlugInput(req.body.slug) : '';
  if (requested && requested !== oldSlug) {
    // explicit slug change from the admin SEO panel
    data.slug = await resolveSlug(requested, data.name || product.name, product._id);
  } else if (!requested && data.name && data.name !== product.name) {
    // previous behaviour kept: renaming regenerates the slug (now with a 301 from the old URL)
    data.slug = await uniqueSlug(Product, data.name, product._id);
  }
  product.set(data);
  await product.save();
  if (product.slug !== oldSlug) {
    await SeoRedirect.recordMove(`/products/${oldSlug}`, `/products/${product.slug}`, 'product');
  }
  invalidateSitemap();
  return ok(res, { product }, 'محصول به‌روزرسانی شد');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw ApiError.notFound('محصول پیدا نشد');
  await Review.deleteMany({ product: product._id });
  // 410 Gone: Google drops the URL quickly instead of retrying a 404 for weeks.
  await SeoRedirect.recordGone(`/products/${product.slug}`, 'product');
  invalidateSitemap();
  return ok(res, {}, 'محصول حذف شد');
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw ApiError.badRequest('فایلی ارسال نشده است');
  const images = [];
  for (const file of req.files) {
    // Meaningful file names (e.g. gol-gavzaban-k3f9.webp) when the form sends the product name
    const uploaded = await uploadBuffer(file.buffer, 'attari/products', file.mimetype, { nameHint: req.body?.nameHint });
    if (!uploaded?.url) throw ApiError.badRequest('ذخیره تصویر انجام نشد');
    images.push(uploaded);
  }
  return ok(res, { images }, 'تصاویر آپلود شد');
});

export const listReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaging(req.query, { defaultLimit: 10 });
  const filter = { product: req.params.id, isApproved: true };
  const [reviews, total] = await Promise.all([
    Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments(filter),
  ]);
  return ok(res, { reviews, meta: meta(total, page, limit) }, 'نظرات محصول');
});

export const addReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select('_id');
  if (!product) throw ApiError.notFound('محصول پیدا نشد');
  const exists = await Review.exists({ product: product._id, user: req.user._id });
  if (exists) throw ApiError.conflict('شما قبلاً برای این محصول نظر ثبت کرده‌اید');
  const review = await Review.create({ ...pick(req.body, ['rating', 'title', 'comment']), product: product._id, user: req.user._id });
  await review.populate('user', 'name avatar');
  return created(res, { review }, 'نظر شما ثبت شد');
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('نظر پیدا نشد');
  const isOwner = String(review.user) === String(req.user._id);
  if (!isOwner && req.user.role !== 'ADMIN') throw ApiError.forbidden();
  await Review.findOneAndDelete({ _id: review._id });
  return ok(res, {}, 'نظر حذف شد');
});
