import { Article } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
import { getPaging, meta } from '../utils/pagination.js';
import { invalidateSitemap } from '../seo/sitemap.js';
import { SeoRedirect } from '../models/index.js';

export const listArticles = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaging(req.query);
  const filter = { isPublished: true };
  const [articles, total] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  return ok(res, { articles, meta: meta(total, page, limit) }, 'مقالات');
});

export const getArticle = asyncHandler(async (req, res) => {
  const key = req.params.slug;
  const isAdmin = req.user?.role === 'ADMIN';
  // Admin edit form loads by id; the public site loads by slug and only sees published articles
  // (drafts used to be readable by anyone who guessed the slug, and indexable).
  const query = isAdmin && /^[0-9a-f]{24}$/i.test(key) ? { $or: [{ _id: key }, { slug: key }] } : { slug: key };
  const article = await Article.findOne({ ...query, ...(isAdmin ? {} : { isPublished: true }) });
  if (!article) throw ApiError.notFound('مقاله پیدا نشد');
  return ok(res, { article }, 'مقاله');
});

export const adminListArticles = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaging(req.query, { defaultLimit: 20 });
  const filter = {};
  if (req.query.search) filter.$text = { $search: String(req.query.search) };
  if (req.query.status === 'published') filter.isPublished = true;
  if (req.query.status === 'draft') filter.isPublished = false;
  const [articles, total] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  return ok(res, { articles, meta: meta(total, page, limit) }, 'مقالات (مدیریت)');
});

export const createArticle = asyncHandler(async (req, res) => {
  const { slug, title, excerpt, body, image, tag, minutes, isPublished } = req.body;
  const exists = await Article.findOne({ slug });
  if (exists) throw ApiError.conflict('این شناسه (slug) از قبل وجود دارد');
  const article = new Article({
    slug: slug.trim(),
    title: title.trim(),
    excerpt: excerpt.trim(),
    body: Array.isArray(body) ? body.filter(b => b.trim()) : [body.trim()],
    image: image || null,
    tag: tag?.trim() || '',
    minutes: minutes || 5,
    isPublished: isPublished !== false,
  });
  await article.save();
  invalidateSitemap();
  return created(res, article.toObject(), 'مقاله ایجاد شد');
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { slug, title, excerpt, body, image, tag, minutes, isPublished } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) throw ApiError.notFound('مقاله پیدا نشد');
  const previousSlug = article.slug;
  if (slug && slug !== article.slug) {
    const exists = await Article.findOne({ slug });
    if (exists) throw ApiError.conflict('این شناسه (slug) از قبل وجود دارد');
    article.slug = slug.trim();
  }
  if (title) article.title = title.trim();
  if (excerpt) article.excerpt = excerpt.trim();
  if (body) article.body = Array.isArray(body) ? body.filter(b => b.trim()) : [body.trim()];
  if (image !== undefined) article.image = image || null;
  if (tag) article.tag = tag.trim();
  if (minutes) article.minutes = minutes;
  if (isPublished !== undefined) article.isPublished = isPublished;
  await article.save();
  if (article.slug !== previousSlug) {
    await SeoRedirect.recordMove(`/journal/${previousSlug}`, `/journal/${article.slug}`, 'article');
  }
  invalidateSitemap();
  return ok(res, article.toObject(), 'مقاله بروز شد');
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) throw ApiError.notFound('مقاله پیدا نشد');
  invalidateSitemap();
  return ok(res, {}, 'مقاله حذف شد');
});
