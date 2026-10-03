/**
 * Schema.org JSON-LD builders.
 *
 * Every value comes from real data (DB documents or SITE facts). Nothing is
 * invented: aggregateRating is only emitted when approved reviews exist, the
 * return policy mirrors the published /terms page, and FAQPage is only built
 * from FAQs that are rendered visibly on the same page.
 */
import { SITE, toSchemaPrice } from './site.js';
import { absoluteUrl, normalizeSiteUrl } from './urls.js';
import { cleanText, truncate } from './text.js';

export const orgId = (siteUrl) => `${normalizeSiteUrl(siteUrl)}/#organization`;
export const websiteId = (siteUrl) => `${normalizeSiteUrl(siteUrl)}/#website`;

const UNIT_CODES = {
  'گرم': 'GRM', 'گرمی': 'GRM', g: 'GRM',
  'کیلوگرم': 'KGM', 'کیلو': 'KGM', kg: 'KGM',
  'میلی‌لیتر': 'MLT', 'میلی لیتر': 'MLT', 'سی‌سی': 'MLT', ml: 'MLT',
  'لیتر': 'LTR', l: 'LTR',
};

export function returnPolicyLd() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: SITE.address.addressCountry,
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: SITE.returnDays,
  };
}

export function organizationLd(siteUrl, { sameAs = [] } = {}) {
  const url = normalizeSiteUrl(siteUrl);
  const links = sameAs.filter((u) => /^https?:\/\//.test(u || ''));
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': orgId(url),
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: `${url}/`,
    logo: { '@type': 'ImageObject', url: absoluteUrl(url, SITE.logo), width: 512, height: 512 },
    image: absoluteUrl(url, SITE.defaultImage),
    description: SITE.defaultDescription,
    email: SITE.email,
    telephone: SITE.telephone,
    address: { '@type': 'PostalAddress', ...SITE.address },
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: SITE.telephone,
      email: SITE.email,
      contactType: 'customer service',
      areaServed: SITE.address.addressCountry,
      availableLanguage: ['fa'],
    }],
    hasMerchantReturnPolicy: returnPolicyLd(),
    ...(links.length ? { sameAs: links } : {}),
  };
}

export function websiteLd(siteUrl) {
  const url = normalizeSiteUrl(siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(url),
    url: `${url}/`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    inLanguage: SITE.language,
    publisher: { '@id': orgId(url) },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${url}/products?search={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** items: [{ name, path }] – the last item is the current page. */
export function breadcrumbLd(siteUrl, items) {
  const clean = items.filter((i) => i && i.name);
  if (clean.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: clean.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cleanText(item.name),
      ...(item.path ? { item: absoluteUrl(siteUrl, item.path) } : {}),
    })),
  };
}

export function finalPriceToman(product) {
  const price = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  return discount > 0 ? Math.round((price * (100 - discount)) / 1000) * 10 : price;
}

export function productLd(product, { siteUrl, canonicalPath, images = [], shipping } = {}) {
  const url = absoluteUrl(siteUrl, canonicalPath);
  const priceToman = finalPriceToman(product);
  const inStock = Number(product.stock || 0) > 0;
  const unitCode = UNIT_CODES[String(product.unit || '').trim()];
  const sku = product.productNumber ? `KLV-${String(product.productNumber).padStart(3, '0')}` : String(product._id || product.id || '');

  const offer = {
    '@type': 'Offer',
    url,
    priceCurrency: SITE.storeCurrency,
    price: toSchemaPrice(priceToman),
    availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': orgId(siteUrl) },
    hasMerchantReturnPolicy: returnPolicyLd(),
  };

  if (shipping && Number.isFinite(Number(shipping.flat))) {
    const free = shipping.freeThreshold && priceToman >= Number(shipping.freeThreshold);
    offer.shippingDetails = {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: free ? 0 : toSchemaPrice(shipping.flat), currency: SITE.storeCurrency },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: SITE.address.addressCountry },
    };
  }

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: cleanText(product.name),
    description: truncate([product.shortDescription, product.description].filter(Boolean).join('. '), 4900),
    url,
    sku,
    brand: { '@type': 'Brand', name: SITE.name },
    ...(product.category?.name ? { category: cleanText(product.category.name) } : {}),
    ...(images.length ? { image: images } : {}),
    ...(unitCode && Number(product.weight) > 0
      ? { weight: { '@type': 'QuantitativeValue', value: Number(product.weight), unitCode } }
      : {}),
    offers: offer,
  };

  const reviews = Number(product.reviewsCount || 0);
  const rating = Number(product.rating || 0);
  if (reviews > 0 && rating > 0) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(rating * 10) / 10,
      reviewCount: reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return ld;
}

export function itemListLd(siteUrl, products = [], { startIndex = 0 } = {}) {
  if (!products.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: startIndex + i + 1,
      url: absoluteUrl(siteUrl, `/products/${p.slug}`),
      name: cleanText(p.name),
    })),
  };
}

export function collectionPageLd(siteUrl, { name, description, canonicalPath, products = [], startIndex = 0 }) {
  const url = absoluteUrl(siteUrl, canonicalPath);
  const list = itemListLd(siteUrl, products, { startIndex });
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: cleanText(name),
    ...(description ? { description: cleanText(description) } : {}),
    inLanguage: SITE.language,
    isPartOf: { '@id': websiteId(siteUrl) },
    ...(list ? { mainEntity: { '@type': 'ItemList', itemListElement: list.itemListElement } } : {}),
  };
}

/** Only call with FAQs that are visible on the same page. */
export function faqLd(faqs = []) {
  const valid = faqs.filter((f) => cleanText(f?.question) && cleanText(f?.answer));
  if (!valid.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((f) => ({
      '@type': 'Question',
      name: cleanText(f.question),
      acceptedAnswer: { '@type': 'Answer', text: cleanText(f.answer) },
    })),
  };
}

export function articleLd(article, { siteUrl, canonicalPath, image } = {}) {
  const url = absoluteUrl(siteUrl, canonicalPath);
  const published = article.date || article.createdAt;
  const modified = article.updatedAt || published;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: truncate(article.title, 110),
    description: cleanText(article.excerpt),
    ...(image ? { image: [image] } : {}),
    ...(published ? { datePublished: new Date(published).toISOString() } : {}),
    ...(modified ? { dateModified: new Date(modified).toISOString() } : {}),
    ...(article.tag ? { articleSection: cleanText(article.tag) } : {}),
    inLanguage: SITE.language,
    author: { '@type': 'Organization', name: SITE.name, url: `${normalizeSiteUrl(siteUrl)}/` },
    publisher: { '@id': orgId(siteUrl) },
  };
}
