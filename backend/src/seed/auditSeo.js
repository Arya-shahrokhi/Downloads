/**
 * SEO audit: redirects, sitemap integrity, broken links.
 * Run: npm run seo:audit --workspace backend
 */
import { Article, Category, Product, SeoRedirect } from '../models/index.js';
import { buildCategorySeo, buildProductSeo, buildArticleSeo } from '../seo/shared.js';
import { seoOptions } from '../seo/context.js';

const opts = seoOptions();

export async function auditSeo() {
  console.log('\n=== SEO AUDIT ===\n');

  // 1. REDIRECTS
  console.log('📊 REDIRECTS');
  const redirects = await SeoRedirect.find().lean();
  const chains = new Map(); // detect A → B → C chains
  redirects.forEach((r) => {
    if (r.statusCode === 301 && r.toPath) {
      const target = redirects.find((x) => x.fromPath === r.toPath);
      if (target) chains.set(r.fromPath, { via: r.toPath, final: target.toPath });
    }
  });

  const gone = redirects.filter((r) => r.statusCode === 410);
  const moved = redirects.filter((r) => r.statusCode === 301);

  console.log(`  301 moved:    ${moved.length}`);
  console.log(`  410 gone:     ${gone.length}`);
  if (chains.size > 0) {
    console.log(`  ⚠️  redirect chains: ${chains.size}`);
    [...chains.entries()].forEach(([from, { via, final }]) => {
      console.log(`     ${from} → ${via} → ${final}`);
    });
  }

  // 2. ORPHANED REDIRECTS (target no longer exists)
  console.log('\n🔍 ORPHANED REDIRECTS');
  const orphans = [];
  for (const r of moved) {
    const match = r.toPath.match(/^\/products\/(.+)$|^\/category\/(.+)$/);
    if (!match) continue;
    const slug = match[1] || match[2];
    const exists = await (match[1]
      ? Product.exists({ slug, isActive: true })
      : Category.exists({ slug, isActive: true }));
    if (!exists) orphans.push(r);
  }
  if (orphans.length > 0) {
    console.log(`  ⚠️  ${orphans.length} redirects point to deleted/inactive items`);
    orphans.slice(0, 5).forEach((r) => console.log(`     ${r.fromPath} → ${r.toPath}`));
    if (orphans.length > 5) console.log(`     ... and ${orphans.length - 5} more`);
  } else {
    console.log('  ✓ all 301 targets exist');
  }

  // 3. SITEMAP INTEGRITY
  console.log('\n📋 SITEMAP CONTENT');
  const [products, categories, articles] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    Article.countDocuments({ isPublished: true }),
  ]);

  const staticArticles = (await import('../../../shared/content/journal.js')).ARTICLES.length;
  console.log(`  products:     ${products}`);
  console.log(`  categories:   ${categories}`);
  console.log(`  articles:     ${articles} (DB) + ${staticArticles} (static)`);

  // 4. PRODUCTS WITH MISSING/BROKEN IMAGE URLS
  console.log('\n🖼️  PRODUCT IMAGE URLS');
  const badImages = await Product.find({
    isActive: true,
    $or: [
      { images: { $size: 0 } },
      { 'images.url': { $in: ['', null] } },
      { 'images.url': /^https:\/\/res\.cloudinary\.com.*\/$/ }, // ends with /
    ],
  }).select('slug name images');

  if (badImages.length > 0) {
    console.log(`  ⚠️  ${badImages.length} products with missing/broken image URLs`);
    badImages.slice(0, 3).forEach((p) => console.log(`     ${p.slug} (${p.images.length} images)`));
  } else {
    console.log('  ✓ all active products have images');
  }

  // 5. CLOUDINARY URLS (check f_auto format)
  const cloudinaryProducts = await Product.countDocuments({
    isActive: true,
    'images.url': /^https:\/\/res\.cloudinary\.com/,
  });
  const withTransform = await Product.countDocuments({
    isActive: true,
    'images.url': /\/image\/upload\/f_/,
  });
  console.log(`  cloudinary:   ${cloudinaryProducts} products`);
  if (cloudinaryProducts > 0 && withTransform === 0) {
    console.log(`  ⚠️  none have f_auto delivery transformation (will be added by SmartImage)`)
  }

  // 6. CATEGORY CONTENT ISSUES
  console.log('\n📑 CATEGORY CONTENT');
  const badIntro = await Category.find({
    isActive: true,
    $or: [
      { intro: { $regex: '[گ-ی]+-[گ-ی]+' } }, // old Persian slugs
      { seoTitle: { $size: 0 } },
    ],
  }).select('slug seoTitle intro');

  if (badIntro.length > 0) {
    console.log(`  ⚠️  ${badIntro.length} categories with potential issues`);
    badIntro.forEach((c) => {
      if (!c.seoTitle) console.log(`     ${c.slug}: missing seoTitle`);
      if (c.intro?.includes('-')) console.log(`     ${c.slug}: intro may have old slugs`);
    });
  } else {
    console.log('  ✓ all categories have seoTitle');
  }

  // 7. ARTICLE ISSUES
  console.log('\n✍️  ARTICLES');
  const badArticles = await Article.find({
    isPublished: true,
    $or: [
      { body: { $size: 0 } },
      { image: { $size: 0 } },
    ],
  }).select('slug body');

  if (badArticles.length > 0) {
    console.log(`  ⚠️  ${badArticles.length} published articles missing body/image`);
  } else {
    console.log('  ✓ all published articles have content and images');
  }

  // 8. SEO FIELD COVERAGE
  console.log('\n⚡ SEO FIELD COVERAGE');
  const productsWithSeo = await Product.countDocuments({ isActive: true, seoTitle: { $ne: '' } });
  const categoriesWithSeo = await Category.countDocuments({ isActive: true, seoTitle: { $ne: '' } });

  console.log(`  products:     ${productsWithSeo}/${products} have custom seoTitle`);
  console.log(`  categories:   ${categoriesWithSeo}/${categories} have custom seoTitle`);

  // 9. SLUG ISSUES (Persian, duplicates, special chars)
  console.log('\n🔤 SLUG HEALTH');
  const persianProduct = await Product.findOne({ isActive: true, slug: /[ـ-ی]/ });
  const persianCategory = await Category.findOne({ isActive: true, slug: /[ـ-ی]/ });

  if (persianProduct || persianCategory) {
    console.log(`  ⚠️  found Persian characters in slugs (should be ASCII only)`);
    if (persianProduct) console.log(`     product: ${persianProduct.slug}`);
    if (persianCategory) console.log(`     category: ${persianCategory.slug}`);
  } else {
    console.log('  ✓ all slugs are ASCII-only');
  }

  // 10. SITEMAP GENERATION TEST
  console.log('\n🧪 SITEMAP GENERATION');
  try {
    const { generateSitemap } = await import('../seo/sitemap.js');
    const xml = await generateSitemap();
    const urlCount = (xml.match(/<url>/g) || []).length;
    const imageCount = (xml.match(/<image:image>/g) || []).length;
    console.log(`  ${urlCount} URLs in sitemap`);
    console.log(`  ${imageCount} images indexed`);

    // Check for broken URLs in sitemap (should be RFC-3986 compliant)
    const badUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .filter((u) => /[^-._~:/?#[\]@!$&'()*+,;=A-Za-z0-9%]/.test(u));
    if (badUrls.length > 0) {
      console.log(`  ⚠️  ${badUrls.length} URLs have non-compliant characters`);
      badUrls.slice(0, 2).forEach((u) => console.log(`     ${u.slice(0, 80)}…`));
    }
  } catch (err) {
    console.log(`  ❌ sitemap generation failed: ${err.message}`);
  }

  console.log('\n✅ AUDIT COMPLETE\n');
}

export default auditSeo;
