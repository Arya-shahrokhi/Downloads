/**
 * چرخش محتوا بر اساس ویزیت.
 *
 * ایده: هر «ورود» (تب/جلسه‌ی تازه، نه رفرش) یک seed جدید می‌سازد.
 * با این seed یک مولد تصادفی قطعی ساخته می‌شود، پس در طول همان ویزیت
 * صفحه ثابت می‌ماند (بدون پرش بین رندرها)، ولی ویزیت بعدی ترکیب دیگری می‌بیند.
 *
 * انتخاب محصولات وزن‌دار است (کیفیت × تازگی):
 *   - کیفیت: امتیاز، تعداد فروش، موجود بودن
 *   - تازگی: محصولی که در ۳ ویزیت اخیر دیده شده جریمه می‌شود
 *     (ویزیت قبلی ×0.15، دو ویزیت قبل ×0.575، سه ویزیت قبل ×0.72)
 * پس محصولات خوب بیشتر دیده می‌شوند، ولی هیچ‌وقت دو بار پشت‌سرهم یک چیز تکراری نمی‌آید.
 */

const VISIT_KEY = 'kv:visit';
const SEEN_KEY = 'kv:seen';
const SESSION_KEY = 'kv:visit-counted';
const MEMORY = 3; // چند ویزیت اخیر را به خاطر بسپار

const readJSON = (storage, key, fallback) => {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const writeJSON = (storage, key, value) => {
  try { storage.setItem(key, JSON.stringify(value)); } catch { /* حالت خصوصی یا حافظه پر */ }
};

/** FNV-1a: رشته → عدد ۳۲ بیتی */
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** مولد تصادفی سبک و قطعی (mulberry32) */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const newId = () => (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/**
 * ویزیت فعلی. شمارنده فقط یک بار در هر جلسه‌ی مرورگر بالا می‌رود،
 * پس رفرش یا ناوبری داخلی صفحه را به‌هم نمی‌ریزد.
 */
export function getVisit() {
  if (typeof window === 'undefined') return { id: 'ssr', count: 0, seed: 1 };
  const state = readJSON(localStorage, VISIT_KEY, null) || { id: newId(), count: 0 };
  let counted = false;
  try { counted = sessionStorage.getItem(SESSION_KEY) === '1'; } catch { /* */ }
  if (!counted) {
    state.count += 1;
    writeJSON(localStorage, VISIT_KEY, state);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* */ }
  }
  return { id: state.id, count: state.count, seed: hashString(`${state.id}:${state.count}`) };
}

/** مولد جدا برای هر بخش، تا ترتیب فراخوانی‌ها روی نتیجه اثر نگذارد. */
export const rng = (visit, salt) => mulberry32(visit.seed ^ hashString(salt));

/** id → چند ویزیت پیش دیده شده (۱ = ویزیت قبلی) */
export function getRecentlySeen(visit) {
  if (typeof window === 'undefined') return new Map();
  const history = readJSON(localStorage, SEEN_KEY, {});
  const seen = new Map();
  Object.entries(history).forEach(([visitNo, ids]) => {
    const ago = visit.count - Number(visitNo);
    if (ago < 1 || ago > MEMORY || !Array.isArray(ids)) return;
    ids.forEach((id) => {
      if (!seen.has(id) || seen.get(id) > ago) seen.set(id, ago);
    });
  });
  return seen;
}

/** ثبت آنچه در این ویزیت نشان داده شد. */
export function recordSeen(visit, ids) {
  if (typeof window === 'undefined' || !ids.length) return;
  const history = readJSON(localStorage, SEEN_KEY, {});
  const merged = new Set([...(history[visit.count] || []), ...ids.filter(Boolean).map(String)]);
  history[visit.count] = [...merged].slice(-200);
  Object.keys(history).forEach((k) => {
    if (visit.count - Number(k) > MEMORY) delete history[k];
  });
  writeJSON(localStorage, SEEN_KEY, history);
}

/** کیفیت پایه‌ی محصول برای وزن‌دهی. */
export function productWeight(p) {
  const rating = Math.min(Math.max(Number(p?.rating) || 0, 0), 5);
  const sold = Number(p?.soldCount) || 0;
  const stock = p?.stock === undefined ? 1 : (Number(p.stock) > 0 ? 1 : 0.2);
  const discount = Number(p?.discount) > 0 ? 1.1 : 1;
  return (1 + rating / 5) * (1 + Math.log10(1 + sold) / 3) * stock * discount;
}

const noveltyFactor = (ago) => (ago ? 1 - 0.85 / ago : 1);

/**
 * انتخاب وزن‌دار بدون جایگذاری (Efraimidis–Spirakis):
 * برای هر آیتم key = u^(1/w) و بزرگ‌ترین‌ها برنده‌اند.
 */
export function rotatePick(items = [], {
  count, rand = Math.random, seen = new Map(), weight = productWeight, key = (x) => String(x?._id),
} = {}) {
  return items
    .map((item) => {
      const w = Math.max(weight(item) * noveltyFactor(seen.get(key(item))), 1e-6);
      return { item, k: Math.pow(rand(), 1 / w) };
    })
    .sort((a, b) => b.k - a.k)
    .slice(0, count ?? items.length)
    .map((s) => s.item);
}

/** Fisher–Yates با مولد قطعی */
export function seededShuffle(items = [], rand = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
