import { z } from 'zod';
import { numeric, objectId } from './common.js';

export const createCategorySchema = {
  body: z.object({
    name: z.string().trim().min(2, 'نام دسته‌بندی الزامی است').max(60),
    description: z.string().trim().max(500).optional(),
    icon: z.string().trim().max(40).optional(),
    // local project images (/images/...) are valid too, not only absolute URLs
    image: z.object({ url: z.string().refine((v) => /^https?:\/\//.test(v) || /^\/(images|uploads)\//.test(v), 'آدرس تصویر معتبر نیست') }).optional(),
    parent: objectId.nullable().optional(),
    order: numeric().int().optional(),
    isActive: z.boolean().optional(),
    // SEO (optional)
    slug: z.string().trim().max(100).regex(/^[A-Za-z0-9\u0600-\u06FF\u200c\s-]*$/, 'نامک فقط حروف، عدد و خط تیره باشد').optional(),
    seoTitle: z.string().trim().max(90).optional(),
    seoDescription: z.string().trim().max(200).optional(),
    intro: z.string().trim().max(5000).optional(),
    faqs: z.array(z.object({
      question: z.string().trim().min(3).max(200),
      answer: z.string().trim().min(3).max(1200),
    }).strict()).max(12).optional(),
  }).strict(),
};

export const updateCategorySchema = {
  body: createCategorySchema.body.partial(),
};
