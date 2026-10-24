import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, publicId: String, alt: String },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    productNumber: { type: Number, min: 1, unique: true, sparse: true, index: true },
    name: { type: String, required: [true, 'نام محصول الزامی است'], trim: true, maxlength: 140 },
    // Clean ASCII slug used in /products/<slug>. Old slugs are kept as 301 redirects (SeoRedirect).
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    shortDescription: { type: String, trim: true, maxlength: 240 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    price: { type: Number, required: true, min: 0, index: true },
    oldPrice: { type: Number, min: 0, default: null },
    discount: { type: Number, min: 0, max: 90, default: 0, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, default: 'گرم' },
    weight: { type: Number, default: 100 },
    images: { type: [imageSchema], default: [] },
    ingredients: { type: [String], default: [] },
    usage: { type: String, trim: true, maxlength: 1200 },
    benefits: { type: [String], default: [] },
    origin: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5, index: true },
    reviewsCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },

    // --- SEO (optional). Empty = generated automatically from name/description. ---
    // Existing documents simply don't have these fields; the defaults keep them valid.
    seoTitle: { type: String, trim: true, maxlength: 90, default: '' },
    seoDescription: { type: String, trim: true, maxlength: 200, default: '' },

    // --- قیمت‌گذاری خودکار (pricingService). null = این محصول قیمت روز ندارد و price دستی است. ---
    costPerKg: { type: Number, min: 0, default: null }, // قیمت روز خرید هر کیلو / لیتر
    costPerUnit: { type: Number, min: 0, default: null }, // برای محصولات «عدد» / «بسته»
    packagingCost: { type: Number, min: 0, default: null }, // جایگزین پله‌ی بسته‌بندی سراسری
    autoPrice: { type: Boolean, default: true }, // false = قیمت دستی، بازمحاسبه دستش نمی‌زند
    costUpdatedAt: { type: Date, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// جستجوی متنی فارسی روی نام و توضیحات
productSchema.index({ name: 'text', shortDescription: 'text', description: 'text', ingredients: 'text' }, {
  weights: { name: 10, shortDescription: 4, ingredients: 2, description: 1 },
  name: 'product_text_idx',
});
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

productSchema.virtual('inStock').get(function inStock() {
  return this.stock > 0;
});

/** قیمت نهایی همیشه از سرور محاسبه می‌شود، هرگز از کلاینت. */
productSchema.methods.finalPrice = function finalPrice() {
  return this.discount > 0 ? Math.round((this.price * (100 - this.discount)) / 1000) * 10 : this.price;
};

productSchema.pre('save', function syncOldPrice(next) {
  if (this.discount > 0) this.oldPrice = this.price;
  else this.oldPrice = null;
  next();
});

export const Product = mongoose.model('Product', productSchema);
