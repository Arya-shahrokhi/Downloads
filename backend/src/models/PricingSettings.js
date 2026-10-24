import mongoose from 'mongoose';

/**
 * تنظیمات سراسری قیمت‌گذاری (یک سند واحد).
 * مقادیر پیش‌فرض بسته‌بندی فقط نقطه‌ی شروع‌اند؛ از پنل/API با اعداد واقعی جایگزین کنید.
 */
const tierSchema = new mongoose.Schema(
  {
    maxGrams: { type: Number, required: true, min: 1 }, // تا این وزن (گرم یا میلی‌لیتر)
    cost: { type: Number, required: true, min: 0 }, // هزینه بسته‌بندی به تومان
  },
  { _id: false },
);

export const DEFAULT_TIERS = [
  { maxGrams: 100, cost: 8000 },
  { maxGrams: 250, cost: 12000 },
  { maxGrams: 500, cost: 18000 },
  { maxGrams: 1000, cost: 25000 },
  { maxGrams: 5000, cost: 40000 },
];

const pricingSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    marginPercent: { type: Number, default: 30, min: 0, max: 500 },
    packagingTiers: { type: [tierSchema], default: () => DEFAULT_TIERS },
    roundTo: { type: Number, default: 1000, min: 1 }, // گرد کردن رو به بالا به این مضرب
  },
  { timestamps: true },
);

pricingSettingsSchema.statics.current = async function current() {
  const found = await this.findOne({ key: 'default' });
  return found || this.create({ key: 'default' });
};

export const PricingSettings = mongoose.model('PricingSettings', pricingSettingsSchema);
