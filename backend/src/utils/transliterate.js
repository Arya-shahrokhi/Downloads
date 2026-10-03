/**
 * Persian → Latin ("Finglish") transliteration for clean, readable URL slugs.
 *
 *   «گل گاوزبان»      → gol-gavzaban
 *   «عرق نعناع»       → aragh-nana
 *   «روغن بادام شیرین» → roghan-badam-shirin
 *
 * Persian script omits short vowels, so letter-by-letter conversion gives
 * unreadable slugs ("gl-gavzban"). We therefore use a dictionary of words that
 * actually appear in an Attari catalogue first, and fall back to a
 * letter-level mapping with simple vowel heuristics for unknown words.
 * Admins can always type a custom slug in the product/category form.
 *
 * Pure module, no dependencies (unit-testable with plain `node`).
 */

const WORDS = {
  // product types & forms
  'عرق': 'aragh', 'عرقیات': 'aragh-ha', 'چای': 'chai', 'دمنوش': 'damnoosh', 'دمنوش‌ها': 'damnoosh-ha', 'روغن': 'roghan',
  'روغن‌های': 'roghan-haye', 'پودر': 'pudr', 'حب': 'hab', 'ترکیب': 'tarkib', 'عصاره': 'asare', 'ریشه': 'rishe',
  'برگ': 'barg', 'گل': 'gol', 'تخم': 'tokhm', 'دانه': 'daneh', 'پوست': 'poost', 'چوب': 'choob', 'هسته': 'hasteh',
  'صمغ': 'samgh', 'جوانه': 'javaneh', 'خشک': 'khoshk', 'ساییده': 'sayideh', 'آسیاب‌شده': 'asiab-shode', 'رشته‌ای': 'reshtei',
  'ادویه': 'advieh', 'ادویه‌ها': 'advieh-ha', 'گیاهان': 'giahan', 'گیاه': 'giah', 'دارویی': 'daroei', 'گیاهی': 'giahi',
  'خشکبار': 'khoshkbar', 'محصولات': 'mahsoolat', 'طبیعی': 'tabiei', 'برنج': 'berenj', 'غلات': 'gholat', 'ویژه': 'vizheh',
  'سنتی': 'sonnati', 'فرآورده‌های': 'faravardehaye', 'و': 'va',
  // herbs, spices, foods (from the Kalavaran catalogue)
  'زعفران': 'zaferan', 'زعفرانی': 'zaferani', 'محمدی': 'mohammadi', 'گلاب': 'golab', 'نعناع': 'nana', 'نعنا': 'nana',
  'کاسنی': 'kasni', 'شاتره': 'shatareh', 'بهارنارنج': 'bahar-narenj', 'بیدمشک': 'bidmeshk', 'رازیانه': 'razianeh',
  'آویشن': 'avishan', 'کرفس': 'karafs', 'زیره': 'zireh', 'خارشتر': 'kharshotor', 'سنجد': 'senjed', 'دارچین': 'darchin',
  'دارچینی': 'darchini', 'زنجبیل': 'zanjebil', 'هل': 'hel', 'زنیان': 'zenian', 'گزنه': 'gazaneh', 'اسطوخودوس': 'ostokhoddoos',
  'سبز': 'sabz', 'سیاه': 'siah', 'ترش': 'torsh', 'کوهی': 'koohi', 'بابونه': 'baboneh', 'به': 'beh', 'لیمو': 'limoo',
  'به‌لیمو': 'beh-limoo', 'گاوزبان': 'gavzaban', 'سنبل': 'sonbol', 'الطیب': 'otib', 'سنبل‌الطیب': 'sonbol-otib', 'پونه': 'pooneh',
  'مرزه': 'marzeh', 'رزماری': 'rosemary', 'اکلیل': 'eklil', 'سیاه‌دانه': 'siah-daneh', 'شربتی': 'sharbati', 'بارهنگ': 'barhang',
  'خاکشیر': 'khakshir', 'اسفرزه': 'esfarzeh', 'قدومه': 'ghodoomeh', 'شیرازی': 'shirazi', 'کتان': 'katan', 'گشنیز': 'geshniz',
  'شوید': 'shevid', 'میخک': 'mikhak', 'فلفل': 'felfel', 'قرمز': 'ghermez', 'زردچوبه': 'zardchoobeh', 'سماق': 'somagh',
  'جوز': 'jooz', 'هندی': 'hendi', 'وانیل': 'vanil', 'گلپر': 'golpar', 'عسل': 'asal', 'گون': 'gavan', 'کنار': 'konar',
  'مرکبات': 'morakabat', 'چهل': 'chehel', 'چهل‌گیاه': 'chehel-giah', 'موم': 'moom', 'زنبور': 'zanboor', 'بره': 'bareh',
  'گرده': 'gardeh', 'ژل': 'zhel', 'رویال': 'royal', 'انجیر': 'anjir', 'آلو': 'aloo', 'کشمش': 'keshmesh', 'توت': 'toot',
  'خرما': 'khorma', 'عناب': 'annab', 'زرشک': 'zereshk', 'آلبالو': 'albaloo', 'زغال': 'zoghal', 'اخته': 'akhteh',
  'زغال‌اخته': 'zoghal-akhteh', 'نبات': 'nabat', 'شکر': 'shekar', 'سرخ': 'sorkh', 'شیرین': 'shirin', 'بیان': 'bayan',
  'شیرین‌بیان': 'shirin-bayan', 'قاصدک': 'ghasedak', 'ختمی': 'khatmi', 'پنیرک': 'panirak', 'همیشه': 'hamisheh', 'بهار': 'bahar',
  'همیشه‌بهار': 'hamisheh-bahar', 'بنفشه': 'banafsheh', 'نسترن': 'nastaran', 'نیلوفر': 'niloofar', 'سنا': 'sana',
  'زیتون': 'zeytoon', 'بو': 'boo', 'اکالیپتوس': 'eucalyptus', 'پرتقال': 'porteghal', 'نارنج': 'narenj', 'صندل': 'sandal',
  'کندر': 'kondor', 'مصطکی': 'mastaki', 'مریم': 'maryam', 'گلی': 'goli', 'مریم‌گلی': 'maryam-goli', 'کندش': 'kondosh',
  'کافور': 'kafoor', 'عربی': 'arabi', 'کنجد': 'konjed', 'ارده': 'ardeh', 'نارگیل': 'nargil', 'بادام': 'badam', 'تلخ': 'talkh',
  'کرچک': 'karchak', 'آرگان': 'argan', 'مورد': 'moord', 'انگور': 'angoor', 'زردآلو': 'zardaloo', 'انار': 'anar',
  'دنبه': 'dombeh', 'حیوانی': 'heyvani', 'گندم': 'gandom', 'جو': 'jo', 'سیر': 'sir', 'پیاز': 'piaz', 'کاکائو': 'cacao',
  'بادرنجبویه': 'badranjbooyeh', 'آرامش': 'aramesh', 'سرماخوردگی': 'sarmakhordegi', 'لاغری': 'laghari', 'خواب': 'khab',
  'انرژی': 'energy', 'پسته': 'pesteh', 'اکبری': 'akbari', 'ممتاز': 'momtaz', 'ایرانی': 'irani', 'هاشمی': 'hashemi',
  'طارم': 'tarom', 'دم‌سیاه': 'domsiah', 'ارگانیک': 'organic', 'اصل': 'asl', 'درجه': 'daraje', 'یک': 'yek',
  'دو': 'do', 'آتشه': 'atashe', 'سرگل': 'sargol', 'قائنات': 'ghaenat', 'لاهیجان': 'lahijan', 'سیلان': 'seylan',
  'آلمانی': 'almani', 'درشت': 'dorosht', 'سفید': 'sefid', 'ممتازه': 'momtazeh', 'تازه': 'tazeh', 'بسته': 'basteh',
};

// letter-level fallback
const LETTERS = {
  'آ': 'a', 'ا': 'a', 'أ': 'a', 'إ': 'e', 'ء': '', 'ئ': 'y', 'ؤ': 'o', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j',
  'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
  'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': '', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'ك': 'k', 'گ': 'g', 'ل': 'l',
  'م': 'm', 'ن': 'n', 'و': 'o', 'ه': 'h', 'ة': 'h', 'ی': 'i', 'ي': 'i', 'ى': 'a', 'ۀ': 'eh',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
};

const PERSIAN_RE = /[\u0600-\u06FF]/;

function transliterateWord(word) {
  if (!word) return '';
  if (WORDS[word]) return WORDS[word];
  // try removing a trailing plural/ezafe suffix: «ها»، «های»، «ی»
  const suffixMatch = word.match(/^(.+?)(‌?های|‌?ها|‌?ی)$/);
  if (suffixMatch && WORDS[suffixMatch[1]]) {
    const suffix = suffixMatch[2].replace('\u200c', '');
    return `${WORDS[suffixMatch[1]]}-${suffix === 'ی' ? 'i' : suffix === 'ها' ? 'ha' : 'haye'}`;
  }
  // compound with ZWNJ: translate parts
  if (word.includes('\u200c')) return word.split('\u200c').map(transliterateWord).filter(Boolean).join('-');

  let out = '';
  const chars = [...word];
  chars.forEach((ch, i) => {
    let mapped = LETTERS[ch];
    if (mapped === undefined) mapped = ch;
    // «و» between consonants reads as "oo", at the start as "v"
    if (ch === 'و') mapped = i === 0 ? 'v' : 'oo';
    // «ی» at the start is "y"
    if (ch === 'ی' && i === 0) mapped = 'y';
    // final «ه» after a consonant is usually a silent "e"
    if (ch === 'ه' && i === chars.length - 1 && i > 0) mapped = 'eh';
    out += mapped;
  });
  return out;
}

/** Transliterates a Persian (or mixed) string into ASCII words separated by spaces. */
export function transliterate(value) {
  const text = String(value ?? '')
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0670]/g, '') // Arabic diacritics (tashkil)
    .replace(/ـ/g, '');                      // kashida
  if (!PERSIAN_RE.test(text)) return text;
  return text
    .split(/[\s\-_/]+/)
    .map((token) => {
      if (!PERSIAN_RE.test(token)) return token;
      const t = token.replace(/^\u200c+|\u200c+$/g, '');
      return WORDS[t] || transliterateWord(t);
    })
    .join(' ');
}

/** ASCII URL slug: lowercase a–z, 0–9 and single hyphens. */
export function asciiSlug(value, { maxLength = 80 } = {}) {
  const slug = transliterate(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= maxLength) return slug;
  return slug.slice(0, maxLength).replace(/-[^-]*$/, '') || slug.slice(0, maxLength);
}

export const isCleanSlug = (slug) => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
