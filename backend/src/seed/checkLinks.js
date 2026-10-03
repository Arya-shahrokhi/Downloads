/**
 * Check for broken internal links in:
 * - Category intros (text with /category/… or /products/…)
 * - Article bodies and related categories
 * - Admin-written article fields
 *
 * Run: npm run link:check --workspace backend
 */
import { Article, Category, Product } from '../models/index.js';

const linkRegex = /\/(?:products|category)\/([a-z0-9-]+)/gi;

export async function checkLinks() {
  console.log('\n=== LINK AUDIT ===\n');

  const issues = [];

  // 1. Category intros linking to non-existent products/categories
  console.log('🔗 CATEGORY INTROS');
  const cats = await Category.find({ isActive: true }).lean();
  for (const cat of cats) {
    if (!cat.intro) continue;
    const matches = [...cat.intro.matchAll(linkRegex)];
    for (const m of matches) {
      const [full, slug] = m;
      const isProduct = full.includes('/products');
      const exists = await (isProduct
        ? Product.exists({ slug, isActive: true })
        : Category.exists({ slug, isActive: true }));
      if (!exists) {
        issues.push(`  ${cat.slug}: intro links to missing ${isProduct ? 'product' : 'category'} /${slug}`);
      }
    }
  }

  // 2. Article related categories
  console.log('📚 ARTICLE LINKS');
  const articles = await Article.find({ isPublished: true }).lean();
  for (const art of articles) {
    if (art.relatedCategory) {
      const exists = await Category.exists({ slug: art.relatedCategory, isActive: true });
      if (!exists) {
        issues.push(`  ${art.slug}: relatedCategory /${art.relatedCategory} not found`);
      }
    }
    // Check article body for old Persian slugs
    if (art.body && typeof art.body === 'string' && /[گ-ی]+-[گ-ی]+/.test(art.body)) {
      issues.push(`  ${art.slug}: body may have old Persian slugs`);
    }
  }

  // 3. Product descriptions (usually don't have links, but check for obvious mistakes)
  console.log('🛍️  PRODUCT LINKS');
  const prods = await Product.find({ isActive: true, description: /\/(?:products|category)\// }).lean();
  if (prods.length > 0) {
    console.log(`  ⚠️  ${prods.length} products have internal links in description (unusual)`);
  }

  if (issues.length === 0) {
    console.log('  ✓ no broken links found');
  } else {
    console.log(`\n⚠️  ${issues.length} issues:\n${issues.join('\n')}`);
  }

  console.log('\n✅ LINK CHECK COMPLETE\n');
}

export default checkLinks;
