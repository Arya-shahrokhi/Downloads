import { z } from 'zod';
import { PricingSettings, Product } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';
import { applyDailyCosts, recalculatePrices } from '../services/pricingService.js';

const money = z.coerce.number().min(0).max(1e10);
const dry = z.union([z.boolean(), z.enum(['true', 'false', '1', '0'])]).optional()
  .transform((v) => v === true || v === 'true' || v === '1');

export const pricingSettingsSchema = {
  body: z.object({
    marginPercent: z.coerce.number().min(0).max(500).optional(),
    roundTo: z.coerce.number().int().min(1).max(100000).optional(),
    packagingTiers: z.array(z.object({ maxGrams: z.coerce.number().min(1), cost: money })).min(1).max(20).optional(),
    dryRun: dry,
  }),
};

export const dailyCostsSchema = {
  body: z.object({
    dryRun: dry,
    items: z.array(z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
      slug: z.string().min(1).max(160).optional(),
      productNumber: z.coerce.number().int().min(1).optional(),
      costPerKg: money.nullable().optional(),
      costPerUnit: money.nullable().optional(),
      packagingCost: money.nullable().optional(),
      autoPrice: z.boolean().optional(),
    }).refine((i) => i.id || i.slug || i.productNumber, { message: 'شناسه، slug یا شماره محصول لازم است' }))
      .min(1).max(1000),
  }),
};

export const recalcSchema = { body: z.object({ dryRun: dry }).default({}) };

/** GET /api/admin/pricing */
export const getPricing = asyncHandler(async (_req, res) => {
  const settings = await PricingSettings.current();
  const [withoutCost, manual] = await Promise.all([
    Product.countDocuments({ isActive: true, costPerKg: null, costPerUnit: null }),
    Product.countDocuments({ autoPrice: false }),
  ]);
  return ok(res, { settings, withoutCost, manual }, 'تنظیمات قیمت‌گذاری');
});

/** PUT /api/admin/pricing  (سود٪، پله‌های بسته‌بندی، گرد کردن) */
export const updatePricing = asyncHandler(async (req, res) => {
  const { dryRun, ...changes } = req.body;
  const settings = await PricingSettings.current();
  settings.set(changes);
  if (dryRun) {
    const report = await recalculatePrices({ dryRun: true, settings: settings.toObject() });
    return ok(res, { settings, report }, 'پیش‌نمایش؛ چیزی ذخیره نشد');
  }
  await settings.save();
  const report = await recalculatePrices({ settings });
  return ok(res, { settings, report }, `تنظیمات ذخیره شد و قیمت ${report.changed} محصول به‌روز شد`);
});

/** PUT /api/admin/pricing/costs  (ثبت قیمت روز) */
export const updateDailyCosts = asyncHandler(async (req, res) => {
  const report = await applyDailyCosts(req.body.items, { dryRun: req.body.dryRun });
  return ok(res, { report }, report.dryRun ? 'پیش‌نمایش؛ چیزی ذخیره نشد' : `قیمت ${report.changed} محصول به‌روز شد`);
});

/** POST /api/admin/pricing/recalculate */
export const recalculate = asyncHandler(async (req, res) => {
  const report = await recalculatePrices({ dryRun: req.body?.dryRun });
  return ok(res, { report }, report.dryRun ? 'پیش‌نمایش؛ چیزی ذخیره نشد' : `قیمت ${report.changed} محصول به‌روز شد`);
});
