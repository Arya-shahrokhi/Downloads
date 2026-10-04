import { connectDB, disconnectDB } from '../config/db.js';
import { Category, Product } from '../models/index.js';
import { premiumRiceProducts } from './premiumRiceProducts.js';

const run = async () => {
  await connectDB();
  const category = await Category.findOne({ name: 'محصولات ویژه' });
  if (!category) throw new Error('دسته «محصولات ویژه» پیدا نشد؛ ابتدا seed اصلی را اجرا کنید.');

  for (const item of premiumRiceProducts) {
    const { category: _category, ...product } = item;
    await Product.findOneAndUpdate(
      { slug: product.slug },
      { ...product, category: category._id, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`[premium-rice] ${premiumRiceProducts.length} محصول ساخته یا به‌روزرسانی شد`);
};

run()
  .catch((error) => {
    console.error('[premium-rice] خطا:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
