/*
+import { Link } from 'react-router-dom';
+import { FiArrowLeft, FiCheck, FiShoppingBag } from 'react-icons/fi';
+import SmartImage from '../ui/SmartImage.jsx';
+import { useCartActions } from '../../context/CartContext.jsx';
+import { finalPrice, toFa, toman } from '../../utils/format.js';
+
+const fallbackCopy = [
+  'انتخابی خوش‌عطر و مطمئن برای آشپزی روزمره، با بسته‌بندی تازه و کیفیت کنترل‌شده.',
+  'از مبدأ معتبر تهیه شده و برای حفظ عطر، رنگ و طعم در شرایط استاندارد نگهداری می‌شود.',
+  'یک انتخاب کاربردی برای آشپزخانه، با کیفیت یکنواخت و مشخصات روشن.',
+  'محصولی منتخب از قفسه کالاوران، مناسب مصرف روزانه و خریدی که می‌شود تکرارش کرد.',
+];
+
+function ProductActions({ product, inverse = false }) {
+  const { addItem } = useCartActions();
+  const [busy, setBusy] = useState(false);
+  const out = product.stock <= 0;
+
+  const add = async () => {
+    if (busy || out) return;
+    setBusy(true);
+    await addItem(product._id);
+    setBusy(false);
+  };
+
+  return (
+    <div className="featured-editorial__actions">
+      <button
+        type="button"
+        onClick={add}
+        disabled={busy || out}
+        className={`featured-editorial__buy ${inverse ? 'featured-editorial__buy--inverse' : ''}`}
+      >
+        {busy ? 'در حال افزودن' : out ? 'ناموجود' : 'افزودن به سبد'}
+        <FiShoppingBag size={17} aria-hidden="true" />
+      </button>
+      <Link
+        to={`/products/${product.slug}`}
+        className={`featured-editorial__details ${inverse ? 'featured-editorial__details--inverse' : ''}`}
+      >
+        جزئیات محصول <FiArrowLeft size={15} aria-hidden="true" />
+      </Link>
+    </div>
+  );
+}
*/
+
+function ProductMeta({ product, inverse = false }) {
+  const facts = [
+    ['مبدأ', product.origin || 'منتخب کالاوران'],
+    ['بسته', `${toFa(product.weight || 100)} ${product.unit || 'گرم'}`],
+    ['امتیاز', product.rating ? `${toFa(product.rating)} از ۵` : 'تازه‌وارد'],
+  ];
+
+  return (
+    <dl className={`featured-editorial__meta ${inverse ? 'featured-editorial__meta--inverse' : ''}`}>
+      {facts.map(([label, value]) => (
+        <div key={label}>
+          <dt>{label}</dt>
+          <dd>{value}</dd>
+        </div>
+      ))}
+    </dl>
+  );
+}
+
+function EditorialProduct({ product, index }) {
+  const inverse = index === 1;
+  const description = product.shortDescription || product.description || fallbackCopy[index];
+  const image = product.images?.[0]?.url;
+
+  return (
+    <article
+      className={`featured-editorial__product featured-editorial__product--${index + 1}`}
+      data-featured-layout={index + 1}
+    >
+      <div className="featured-editorial__media">
+        <SmartImage
+          src={image}
+          alt={product.images?.[0]?.alt || product.name}
+          loading={index === 0 ? 'eager' : 'lazy'}
+          fetchpriority={index === 0 ? 'high' : 'auto'}
+          decoding="async"
+          width="800"
+          height="900"
+          sizes={index === 1 ? '(max-width: 767px) 100vw, 45vw' : '(max-width: 767px) 92vw, 42vw'}
+          className="featured-editorial__image"
+          fallbackClassName="min-h-72"
+        />
+      </div>
+
+      <div className="featured-editorial__body">
+        <p className="featured-editorial__eyebrow">
+          <span>{toFa(String(index + 1).padStart(2, '0'))}</span>
+          {product.category?.name || 'محصول ویژه'}
+        </p>
+        <h2>{product.name}</h2>
+        <p className="featured-editorial__description">{description}</p>
+
+        {index === 2 && product.benefits?.length > 0 && (
+          <ul className="featured-editorial__benefits" aria-label="ویژگی‌ها">
+            {product.benefits.slice(0, 3).map((benefit) => (
+              <li key={benefit}><FiCheck size={15} aria-hidden="true" />{benefit}</li>
+            ))}
+          </ul>
+        )}
+
+        <ProductMeta product={product} inverse={inverse} />
+        <div className="featured-editorial__price">
+          <strong>{toman(finalPrice(product))}</strong>
+          {product.discount > 0 && <del>{toman(product.price)}</del>}
+        </div>
+        <ProductActions product={product} inverse={inverse} />
+      </div>
+    </article>
+  );
+}
+
+export function FeaturedEditorialSkeleton() {
+  return (
+    <div className="featured-editorial featured-editorial--loading" aria-label="محصولات ویژه در حال بارگذاری است">
+      {[0, 1].map((item) => (
+        <div key={item} className="featured-editorial__skeleton">
+          <span className="skeleton" />
+          <div><i className="skeleton" /><b className="skeleton" /><em className="skeleton" /></div>
+        </div>
+      ))}
+    </div>
+  );
+}
+
+export default function FeaturedEditorial({ products = [] }) {
+  return (
+    <div className="featured-editorial">
      {products.slice(0, 4).map((product, index) => (
        <EditorialProduct key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}*/
