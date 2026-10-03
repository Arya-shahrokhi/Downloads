/** کاتالوگ نهایی: فقط ۱۸۳ محصولِ تأییدشده در فایل مرجع. قیمت‌ها به تومان. */
export const categories = [
  {
    "name": "گیاهان دارویی",
    "icon": "leaf",
    "order": 1,
    "description": "گیاهان خشک و دم‌کردنی با کیفیت مزرعه‌ای",
    "image": {
      "url": "/images/categories/herbs.webp"
    }
  },
  {
    "name": "ادویه‌ها",
    "icon": "spice",
    "order": 2,
    "description": "ادویه تازه آسیاب‌شده و دانه‌ای",
    "image": {
      "url": "/images/categories/spices.webp"
    }
  },
  {
    "name": "عرقیات گیاهی",
    "icon": "droplet",
    "order": 3,
    "description": "عرقیات تقطیر سنتی در شیشه دربسته",
    "image": {
      "url": "/images/categories/distillates.webp"
    }
  },
  {
    "name": "دمنوش‌ها",
    "icon": "cup",
    "order": 4,
    "description": "ترکیب‌های دمنوش برای آرامش و انرژی",
    "image": {
      "url": "/images/categories/teas.webp"
    }
  },
  {
    "name": "خشکبار",
    "icon": "nut",
    "order": 5,
    "description": "آجیل و خشکبار تازه بوداده",
    "image": {
      "url": "/images/categories/nuts.webp"
    }
  },
  {
    "name": "روغن‌های گیاهی",
    "icon": "oil",
    "order": 6,
    "description": "روغن پرس سرد بدون افزودنی",
    "image": {
      "url": "/images/categories/oils.webp"
    }
  },
  {
    "name": "محصولات طبیعی",
    "icon": "honey",
    "order": 7,
    "description": "عسل، گلاب و فرآورده‌های طبیعی",
    "image": {
      "url": "/images/categories/natural.webp"
    }
  },
  {
    "name": "برنج و غلات",
    "icon": "grain",
    "order": 8,
    "description": "برنج ایرانی و غلات انتخاب‌شده",
    "image": {
      "url": "/images/categories/rice.webp"
    }
  },
  {
    "name": "محصولات ویژه",
    "icon": "star",
    "order": 9,
    "description": "برنج، ادویه‌های ارگانیک و پرمصرف",
    "image": {
      "url": "/images/categories/premium.webp"
    }
  }
];

export const products = [
  {
    "name": "زعفران",
    "category": "محصولات ویژه",
    "price": 1180000,
    "discount": 5,
    "stock": 24,
    "weight": 4,
    "origin": "قائنات",
    "shortDescription": "سرگل قائنات، رنگ بالا",
    "description": "زعفران سرگل قائنات با رشته‌های یکدست و قدرت رنگ‌دهی بالا. در بسته‌بندی شیشه‌ای درب‌دار و به‌همراه برگه اصالت.",
    "ingredients": [
      "زعفران سرگل"
    ],
    "usage": "ساییده و در آب گرم یا یخ حل کنید.",
    "benefits": [
      "رنگ و عطر قوی",
      "روحیه‌بخش"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/01-saffron.webp",
        "alt": "زعفران"
      }
    ],
    "productNumber": 1
  },
  {
    "name": "گل محمدی",
    "category": "گیاهان دارویی",
    "price": 129000,
    "discount": 8,
    "stock": 51,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل محمدی خشک تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "گل محمدی خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "گل محمدی خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/02-damask-rose.webp",
        "alt": "گل محمدی"
      }
    ],
    "productNumber": 2
  },
  {
    "name": "گلاب",
    "category": "محصولات طبیعی",
    "price": 128000,
    "discount": 5,
    "stock": 82,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "قمصر کاشان",
    "shortDescription": "تقطیر گل محمدی قمصر",
    "description": "گلاب دو آتشه از گل محمدی قمصر کاشان. عطر ماندگار برای شیرینی، دم‌نوش و شربت.",
    "ingredients": [
      "گل محمدی",
      "آب"
    ],
    "usage": "در شیرینی، چای یا شربت.",
    "benefits": [
      "آرام‌بخش",
      "خوش‌عطر"
    ],
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/03-rose-water.webp",
        "alt": "گلاب"
      }
    ],
    "productNumber": 3
  },
  {
    "name": "عرق نعناع",
    "category": "عرقیات گیاهی",
    "price": 78000,
    "discount": 0,
    "stock": 110,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "shortDescription": "تقطیر سنتی، بدون اسانس",
    "description": "عرق نعناع دو آتشه با روش تقطیر سنتی مسی. شفاف و پر عطر، بدون اسانس و افزودنی.",
    "ingredients": [
      "نعناع",
      "آب"
    ],
    "usage": "نصف استکان بعد از غذا.",
    "benefits": [
      "رفع نفخ",
      "آرامش معده"
    ],
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/04-mint-herbal-distillate.webp",
        "alt": "عرق نعناع"
      }
    ],
    "productNumber": 4
  },
  {
    "name": "عرق کاسنی",
    "category": "عرقیات گیاهی",
    "price": 74000,
    "discount": 0,
    "stock": 98,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "shortDescription": "خنک و تلخ ملایم",
    "description": "عرق کاسنی خالص با طعم تلخ ملایم، انتخاب رایج برای پاکسازی و روزهای گرم. اغلب همراه شاه‌تره مصرف می‌شود.",
    "ingredients": [
      "کاسنی",
      "آب"
    ],
    "usage": "یک استکان صبح ناشتا.",
    "benefits": [
      "خنک‌کننده",
      "کمک به کبد"
    ],
    "images": [
      {
        "url": "/images/products/kalavaran/21-chicory-herbal-distillate.webp",
        "alt": "عرق کاسنی"
      }
    ],
    "productNumber": 5
  },
  {
    "name": "عرق شاتره",
    "category": "عرقیات گیاهی",
    "price": 105000,
    "discount": 5,
    "stock": 38,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق شاتره و کاسنی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق شاتره و کاسنی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق شاتره و کاسنی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/22-fumitory-herbal-distillate.webp",
        "alt": "عرق شاتره"
      }
    ],
    "productNumber": 6
  },
  {
    "name": "عرق بهارنارنج",
    "category": "عرقیات گیاهی",
    "price": 96000,
    "discount": 10,
    "stock": 64,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "شیراز",
    "shortDescription": "عطر شکوفه مرکبات",
    "description": "عرق بهارنارنج شیراز از شکوفه تازه. عطر آن قوی است و برای آرامش و بی‌قراری استفاده می‌شود.",
    "ingredients": [
      "شکوفه بهارنارنج",
      "آب"
    ],
    "usage": "نصف استکان قبل از خواب.",
    "benefits": [
      "آرام‌بخش",
      "خوش‌عطر"
    ],
    "isFeatured": true,
    "images": [
      {
        "url": "/images/products/kalavaran/23-orange-blossom-water.webp",
        "alt": "عرق بهارنارنج"
      }
    ],
    "productNumber": 7
  },
  {
    "name": "عرق بیدمشک",
    "category": "عرقیات گیاهی",
    "price": 122000,
    "discount": 8,
    "stock": 51,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق بیدمشک ممتاز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق بیدمشک ممتاز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق بیدمشک ممتاز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/24-pussy-willow-distillate.webp",
        "alt": "عرق بیدمشک"
      }
    ],
    "productNumber": 8
  },
  {
    "name": "عرق رازیانه",
    "category": "عرقیات گیاهی",
    "price": 190000,
    "discount": 0,
    "stock": 103,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق رازیانه تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق رازیانه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق رازیانه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/09-fennel-herbal-distillate.webp",
        "alt": "عرق رازیانه"
      }
    ],
    "productNumber": 9
  },
  {
    "name": "عرق آویشن",
    "category": "عرقیات گیاهی",
    "price": 156000,
    "discount": 12,
    "stock": 77,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق آویشن تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق آویشن با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق آویشن"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/10-thyme-herbal-distillate.webp",
        "alt": "عرق آویشن"
      }
    ],
    "productNumber": 10
  },
  {
    "name": "عرق کرفس",
    "category": "عرقیات گیاهی",
    "price": 105000,
    "discount": 10,
    "stock": 100,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق کرفس تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق کرفس با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق کرفس"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/11-celery-herbal-distillate.webp",
        "alt": "عرق کرفس"
      }
    ],
    "productNumber": 11
  },
  {
    "name": "عرق زیره",
    "category": "عرقیات گیاهی",
    "price": 88000,
    "discount": 5,
    "stock": 116,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق زیره تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق زیره با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق زیره"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/12-cumin-herbal-distillate.webp",
        "alt": "عرق زیره"
      }
    ],
    "productNumber": 12
  },
  {
    "name": "عرق خارشتر",
    "category": "عرقیات گیاهی",
    "price": 88000,
    "discount": 8,
    "stock": 87,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق خارشتر تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق خارشتر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق خارشتر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/13-camelthorn-herbal-distillate.webp",
        "alt": "عرق خارشتر"
      }
    ],
    "productNumber": 13
  },
  {
    "name": "عرق سنجد",
    "category": "عرقیات گیاهی",
    "price": 141000,
    "discount": 15,
    "stock": 74,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "ایران",
    "shortDescription": "عرق سنجد با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "عرق سنجد با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "عرق سنجد"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 14,
    "images": [
      {
        "url": "/images/products/kalavaran/14-oleaster-herbal-distillate.webp",
        "alt": "عرق سنجد"
      }
    ]
  },
  {
    "name": "عرق دارچین",
    "category": "عرقیات گیاهی",
    "price": 156000,
    "discount": 0,
    "stock": 139,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق دارچین تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق دارچین با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق دارچین"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/15-cinnamon-herbal-distillate.webp",
        "alt": "عرق دارچین"
      }
    ],
    "productNumber": 15
  },
  {
    "name": "عرق زنجبیل",
    "category": "عرقیات گیاهی",
    "price": 175000,
    "discount": 0,
    "stock": 100,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "ایران",
    "shortDescription": "عرق زنجبیل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "عرق زنجبیل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "عرق زنجبیل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 16,
    "images": [
      {
        "url": "/images/products/kalavaran/16-ginger-herbal-distillate.webp",
        "alt": "عرق زنجبیل"
      }
    ]
  },
  {
    "name": "عرق هل",
    "category": "عرقیات گیاهی",
    "price": 139000,
    "discount": 15,
    "stock": 126,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق هل تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق هل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق هل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/29-cardamom-herbal-distillate.webp",
        "alt": "عرق هل"
      }
    ],
    "productNumber": 17
  },
  {
    "name": "عرق زنیان",
    "category": "عرقیات گیاهی",
    "price": 105000,
    "discount": 8,
    "stock": 129,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق زنیان تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق زنیان با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق زنیان"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/30-ajwain-herbal-distillate.webp",
        "alt": "عرق زنیان"
      }
    ],
    "productNumber": 18
  },
  {
    "name": "عرق گزنه",
    "category": "عرقیات گیاهی",
    "price": 81000,
    "discount": 10,
    "stock": 139,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "ایران",
    "shortDescription": "عرق گزنه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "عرق گزنه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "عرق گزنه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 19,
    "images": [
      {
        "url": "/images/products/kalavaran/31-nettle-herbal-distillate.webp",
        "alt": "عرق گزنه"
      }
    ]
  },
  {
    "name": "عرق اسطوخودوس",
    "category": "عرقیات گیاهی",
    "price": 173000,
    "discount": 15,
    "stock": 90,
    "weight": 1000,
    "unit": "میلی‌لیتر",
    "origin": "کاشان",
    "shortDescription": "عرق اسطوخودوس تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عرق اسطوخودوس با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عرق اسطوخودوس"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/32-lavender-herbal-distillate.webp",
        "alt": "عرق اسطوخودوس"
      }
    ],
    "productNumber": 20
  },
  {
    "name": "چای سبز",
    "category": "دمنوش‌ها",
    "price": 158000,
    "discount": 8,
    "stock": 72,
    "weight": 200,
    "origin": "لاهیجان",
    "shortDescription": "چین اول، برگ سبز پیچیده",
    "description": "چای سبز چین اول لاهیجان با برگ‌های پیچیده و عطر تازه. دم‌کرده روشن و بدون تلخی اضافه.",
    "ingredients": [
      "چای سبز"
    ],
    "usage": "آب ۸۰ درجه، ۲ تا ۳ دقیقه.",
    "benefits": [
      "متابولیسم",
      "آنتی‌اکسیدان",
      "انرژی ملایم"
    ],
    "images": [
      {
        "url": "/images/products/kalavaran/05-green-tea.webp",
        "alt": "چای سبز"
      }
    ],
    "productNumber": 21
  },
  {
    "name": "چای سیاه",
    "category": "دمنوش‌ها",
    "price": 132000,
    "discount": 0,
    "stock": 58,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای سیاه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای سیاه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای سیاه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 22,
    "images": [
      {
        "url": "/images/products/kalavaran/06-black-tea.webp",
        "alt": "چای سیاه"
      }
    ]
  },
  {
    "name": "چای ترش",
    "category": "دمنوش‌ها",
    "price": 89000,
    "discount": 20,
    "stock": 43,
    "weight": 100,
    "origin": "گیلان",
    "shortDescription": "دم‌نوش سرخ با طعم مطبوع ترش",
    "description": "گل‌های خشک چای ترش با رنگ‌دهی قوی. یک لیوان آن رنگ یاقوتی زیبایی می‌دهد و سرد هم نوشیدنی خوبی است.",
    "ingredients": [
      "گل چای ترش"
    ],
    "usage": "یک قاشق در آب جوش، ۶ دقیقه.",
    "benefits": [
      "کمک به فشار خون",
      "سرشار از آنتی‌اکسیدان"
    ],
    "isFeatured": true,
    "images": [
      {
        "url": "/images/products/kalavaran/07-hibiscus-tea.webp",
        "alt": "چای ترش"
      }
    ],
    "productNumber": 23
  },
  {
    "name": "چای کوهی",
    "category": "گیاهان دارویی",
    "price": 112000,
    "discount": 15,
    "stock": 42,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای کوهی معطر تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "چای کوهی معطر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "چای کوهی معطر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/08-persian-mountain-tea.webp",
        "alt": "چای کوهی"
      }
    ],
    "productNumber": 24
  },
  {
    "name": "چای بابونه",
    "category": "دمنوش‌ها",
    "price": 183000,
    "discount": 8,
    "stock": 97,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای بابونه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای بابونه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای بابونه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 25,
    "images": [
      {
        "url": "/images/products/kalavaran/25-chamomile-tea.webp",
        "alt": "چای بابونه"
      }
    ]
  },
  {
    "name": "چای نعناع",
    "category": "دمنوش‌ها",
    "price": 200000,
    "discount": 10,
    "stock": 110,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای نعناع با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای نعناع با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای نعناع"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 26,
    "images": [
      {
        "url": "/images/products/kalavaran/26-mint-tea.webp",
        "alt": "چای نعناع"
      }
    ]
  },
  {
    "name": "چای دارچین",
    "category": "دمنوش‌ها",
    "price": 72000,
    "discount": 12,
    "stock": 123,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای دارچین با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای دارچین با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای دارچین"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 27,
    "images": [
      {
        "url": "/images/products/kalavaran/27-cinnamon-tea.webp",
        "alt": "چای دارچین"
      }
    ]
  },
  {
    "name": "چای زنجبیل",
    "category": "دمنوش‌ها",
    "price": 89000,
    "discount": 15,
    "stock": 136,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای زنجبیل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای زنجبیل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای زنجبیل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 28,
    "images": [
      {
        "url": "/images/products/kalavaran/28-ginger-tea.webp",
        "alt": "چای زنجبیل"
      }
    ]
  },
  {
    "name": "چای به‌لیمو",
    "category": "دمنوش‌ها",
    "price": 106000,
    "discount": 0,
    "stock": 29,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای به‌لیمو با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای به‌لیمو با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای به‌لیمو"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 29,
    "images": [
      {
        "url": "/images/products/kalavaran/33-lemon-verbena-tea.webp",
        "alt": "چای به‌لیمو"
      }
    ]
  },
  {
    "name": "چای گل گاوزبان",
    "category": "دمنوش‌ها",
    "price": 123000,
    "discount": 0,
    "stock": 42,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چای گل گاوزبان با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چای گل گاوزبان با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چای گل گاوزبان"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 30,
    "images": [
      {
        "url": "/images/products/kalavaran/34-persian-borage-tea.webp",
        "alt": "چای گل گاوزبان"
      }
    ]
  },
  {
    "name": "گل گاوزبان",
    "category": "گیاهان دارویی",
    "price": 148000,
    "discount": 15,
    "stock": 64,
    "weight": 100,
    "origin": "گیلان",
    "shortDescription": "گل درشت و خوش‌رنگ، دم‌کرده‌ای آرام‌بخش",
    "description": "گل گاوزبان دست‌چین از مزارع شمال کشور، بدون ساقه اضافه و با رنگ بنفش زنده. برای دم‌نوش شب و کاهش تنش روزانه انتخاب اول است. در بسته‌بندی زیپ‌دار و دارای دریچه یک‌طرفه ارسال می‌شود.",
    "ingredients": [
      "گل گاوزبان خشک"
    ],
    "usage": "یک قاشق مرباخوری در ۲۰۰ میلی‌لیتر آب جوش، ۷ دقیقه دم بکشد.",
    "benefits": [
      "کاهش استرس",
      "کمک به خواب راحت",
      "حس آرامش"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/35-dried-persian-borage.webp",
        "alt": "گل گاوزبان"
      }
    ],
    "productNumber": 31
  },
  {
    "name": "بابونه",
    "category": "گیاهان دارویی",
    "price": 96000,
    "discount": 0,
    "stock": 88,
    "weight": 100,
    "origin": "اصفهان",
    "shortDescription": "گل کامل بابونه با عطر سیب",
    "description": "بابونه آلمانی با گل‌های کامل و عطر شبیه سیب. دم‌کرده روشن و خوش‌طعم می‌دهد و برای معده و آرامش عصر عالی است.",
    "ingredients": [
      "گل بابونه"
    ],
    "usage": "یک قاشق در آب جوش، ۵ دقیقه سرپوشیده دم بکشد.",
    "benefits": [
      "آرام‌بخش",
      "کمک به هاضمه",
      "ضدنفخ"
    ],
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/36-dried-chamomile.webp",
        "alt": "بابونه"
      }
    ],
    "productNumber": 32
  },
  {
    "name": "به‌لیمو",
    "category": "گیاهان دارویی",
    "price": 163000,
    "discount": 15,
    "stock": 48,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "به‌لیمو ممتاز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "به‌لیمو ممتاز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "به‌لیمو ممتاز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/17-dried-lemon-verbena.webp",
        "alt": "به‌لیمو"
      }
    ],
    "productNumber": 33
  },
  {
    "name": "اسطوخودوس",
    "category": "گیاهان دارویی",
    "price": 95000,
    "discount": 0,
    "stock": 25,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "اسطوخودوس فرانسوی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "اسطوخودوس فرانسوی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "اسطوخودوس فرانسوی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/kalavaran/18-dried-lavender.webp",
        "alt": "اسطوخودوس"
      }
    ],
    "productNumber": 34
  },
  {
    "name": "سنبل‌الطیب",
    "category": "گیاهان دارویی",
    "price": 112000,
    "discount": 5,
    "stock": 38,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "سنبل‌الطیب تمیز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "سنبل‌الطیب تمیز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "سنبل‌الطیب تمیز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/kalavaran/19-dried-valerian-root.webp",
        "alt": "سنبل‌الطیب"
      }
    ],
    "productNumber": 35
  },
  {
    "name": "آویشن",
    "category": "گیاهان دارویی",
    "price": 112000,
    "discount": 10,
    "stock": 51,
    "weight": 100,
    "origin": "شیراز",
    "shortDescription": "آویشن کوهی با اسانس بالا",
    "description": "آویشن شیرازی برداشت بهاره، برگ‌ریز و پر اسانس. هم برای دم‌نوش سرماخوردگی و هم چاشنی غذا کاربرد دارد.",
    "ingredients": [
      "آویشن شیرازی"
    ],
    "usage": "برای دم‌نوش نصف قاشق، برای چاشنی روی غذای گرم بپاشید.",
    "benefits": [
      "کمک به تنفس",
      "ضدسرفه",
      "آنتی‌اکسیدان"
    ],
    "isFeatured": true,
    "images": [
      {
        "url": "/images/products/kalavaran/20-dried-thyme.webp",
        "alt": "آویشن"
      }
    ],
    "productNumber": 36
  },
  {
    "name": "پونه",
    "category": "گیاهان دارویی",
    "price": 197000,
    "discount": 5,
    "stock": 74,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پونه کوهی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "پونه کوهی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "پونه کوهی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/037.webp",
        "alt": "پونه"
      }
    ],
    "productNumber": 37
  },
  {
    "name": "نعناع خشک",
    "category": "گیاهان دارویی",
    "price": 74000,
    "discount": 0,
    "stock": 120,
    "weight": 80,
    "origin": "کاشان",
    "shortDescription": "برگ نعناع سبز و معطر",
    "description": "نعناع سایه‌خشک که رنگ سبز و عطر خود را نگه داشته است. برای آبدوغ‌خیار، کوفته و دم‌نوش معده.",
    "ingredients": [
      "برگ نعناع"
    ],
    "usage": "به‌صورت چاشنی یا یک قاشق در آب جوش.",
    "benefits": [
      "رفع نفخ",
      "خوش‌طعم",
      "خنک‌کننده"
    ],
    "images": [
      {
        "url": "/images/products/real/038.webp",
        "alt": "نعناع خشک"
      }
    ],
    "productNumber": 38
  },
  {
    "name": "مرزه خشک",
    "category": "گیاهان دارویی",
    "price": 131000,
    "discount": 8,
    "stock": 39,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "مرزه خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "مرزه خشک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "مرزه خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 39,
    "images": [
      {
        "url": "/images/products/real/039.webp",
        "alt": "مرزه خشک"
      }
    ]
  },
  {
    "name": "رزماری",
    "category": "گیاهان دارویی",
    "price": 148000,
    "discount": 10,
    "stock": 52,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "رزماری با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "رزماری با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "رزماری"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 40,
    "images": [
      {
        "url": "/images/products/real/040.webp",
        "alt": "رزماری"
      }
    ]
  },
  {
    "name": "اکلیل کوهی",
    "category": "گیاهان دارویی",
    "price": 165000,
    "discount": 12,
    "stock": 65,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "اکلیل کوهی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "اکلیل کوهی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "اکلیل کوهی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 41,
    "images": [
      {
        "url": "/images/products/real/041.webp",
        "alt": "اکلیل کوهی"
      }
    ]
  },
  {
    "name": "رازیانه",
    "category": "گیاهان دارویی",
    "price": 163000,
    "discount": 0,
    "stock": 139,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "رازیانه درشت تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "رازیانه درشت با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "رازیانه درشت"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/042.webp",
        "alt": "رازیانه"
      }
    ],
    "productNumber": 42
  },
  {
    "name": "زیره سبز",
    "category": "ادویه‌ها",
    "price": 146000,
    "discount": 15,
    "stock": 48,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "زیره سبز ایرانی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "زیره سبز ایرانی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "زیره سبز ایرانی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/043.webp",
        "alt": "زیره سبز"
      }
    ],
    "productNumber": 43
  },
  {
    "name": "زیره سیاه",
    "category": "ادویه‌ها",
    "price": 163000,
    "discount": 0,
    "stock": 61,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "زیره سیاه کرمانی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "زیره سیاه کرمانی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "زیره سیاه کرمانی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/044.webp",
        "alt": "زیره سیاه"
      }
    ],
    "productNumber": 44
  },
  {
    "name": "سیاه‌دانه",
    "category": "گیاهان دارویی",
    "price": 88000,
    "discount": 5,
    "stock": 117,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "سیاه‌دانه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "سیاه‌دانه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "سیاه‌دانه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 45,
    "images": [
      {
        "url": "/images/products/real/045.webp",
        "alt": "سیاه‌دانه"
      }
    ]
  },
  {
    "name": "تخم شربتی",
    "category": "گیاهان دارویی",
    "price": 105000,
    "discount": 8,
    "stock": 130,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "تخم شربتی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "تخم شربتی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "تخم شربتی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 46,
    "images": [
      {
        "url": "/images/products/real/046.webp",
        "alt": "تخم شربتی"
      }
    ]
  },
  {
    "name": "بارهنگ",
    "category": "گیاهان دارویی",
    "price": 122000,
    "discount": 10,
    "stock": 143,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "بارهنگ با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "بارهنگ با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "بارهنگ"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 47,
    "images": [
      {
        "url": "/images/products/real/047.webp",
        "alt": "بارهنگ"
      }
    ]
  },
  {
    "name": "خاکشیر",
    "category": "گیاهان دارویی",
    "price": 139000,
    "discount": 12,
    "stock": 36,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "خاکشیر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "خاکشیر با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "خاکشیر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 48,
    "images": [
      {
        "url": "/images/products/real/048.webp",
        "alt": "خاکشیر"
      }
    ]
  },
  {
    "name": "اسفرزه",
    "category": "گیاهان دارویی",
    "price": 156000,
    "discount": 15,
    "stock": 49,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "اسفرزه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "اسفرزه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "اسفرزه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 49,
    "images": [
      {
        "url": "/images/products/real/049.webp",
        "alt": "اسفرزه"
      }
    ]
  },
  {
    "name": "قدومه شیرازی",
    "category": "گیاهان دارویی",
    "price": 173000,
    "discount": 0,
    "stock": 62,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "قدومه شیرازی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "قدومه شیرازی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "قدومه شیرازی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 50,
    "images": [
      {
        "url": "/images/products/real/050.webp",
        "alt": "قدومه شیرازی"
      }
    ]
  },
  {
    "name": "تخم کتان",
    "category": "گیاهان دارویی",
    "price": 190000,
    "discount": 0,
    "stock": 75,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "تخم کتان با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "تخم کتان با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "تخم کتان"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 51,
    "images": [
      {
        "url": "/images/products/real/051.webp",
        "alt": "تخم کتان"
      }
    ]
  },
  {
    "name": "تخم گشنیز",
    "category": "ادویه‌ها",
    "price": 180000,
    "discount": 5,
    "stock": 74,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "تخم گشنیز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "تخم گشنیز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "تخم گشنیز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/052.webp",
        "alt": "تخم گشنیز"
      }
    ],
    "productNumber": 52
  },
  {
    "name": "تخم شوید",
    "category": "ادویه‌ها",
    "price": 78000,
    "discount": 8,
    "stock": 87,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "تخم شوید تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "تخم شوید با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "تخم شوید"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/053.webp",
        "alt": "تخم شوید"
      }
    ],
    "productNumber": 53
  },
  {
    "name": "تخم رازیانه",
    "category": "گیاهان دارویی",
    "price": 96000,
    "discount": 10,
    "stock": 114,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "تخم رازیانه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "تخم رازیانه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "تخم رازیانه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 54,
    "images": [
      {
        "url": "/images/products/real/054.webp",
        "alt": "تخم رازیانه"
      }
    ]
  },
  {
    "name": "زنجبیل",
    "category": "ادویه‌ها",
    "price": 95000,
    "discount": 8,
    "stock": 129,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "زنجبیل آسیاب‌شده تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "زنجبیل آسیاب‌شده با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "زنجبیل آسیاب‌شده"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/055.webp",
        "alt": "زنجبیل"
      }
    ],
    "productNumber": 55
  },
  {
    "name": "دارچین",
    "category": "ادویه‌ها",
    "price": 138000,
    "discount": 0,
    "stock": 66,
    "weight": 100,
    "origin": "سریلانکا",
    "shortDescription": "لوله‌های نازک با شیرینی طبیعی",
    "description": "دارچین سیلان اصل با پوست نازک و طعم شیرین و ملایم، متفاوت با دارچین کاسیا. مناسب دم‌نوش و شیرینی‌پزی.",
    "ingredients": [
      "چوب دارچین سیلان"
    ],
    "usage": "یک تکه در دم‌نوش یا آسیاب برای شیرینی.",
    "benefits": [
      "تعادل قند خون",
      "خوش‌عطر"
    ],
    "isFeatured": true,
    "images": [
      {
        "url": "/images/products/real/056.webp",
        "alt": "دارچین"
      }
    ],
    "productNumber": 56
  },
  {
    "name": "هل سبز",
    "category": "ادویه‌ها",
    "price": 690000,
    "discount": 10,
    "stock": 18,
    "weight": 100,
    "origin": "هند",
    "shortDescription": "هل سبز خوش‌عطر و پر دانه",
    "description": "هل سبز درشت با پوست سالم و دانه‌های تیره و روغنی. عطر آن در چای و شیرینی فوری حس می‌شود.",
    "ingredients": [
      "هل سبز"
    ],
    "usage": "دو عدد در قوری چای یا آسیاب‌شده در شیرینی.",
    "benefits": [
      "خوش‌طعم‌کننده",
      "کمک به گوارش"
    ],
    "images": [
      {
        "url": "/images/products/real/057.webp",
        "alt": "هل سبز"
      }
    ],
    "productNumber": 57
  },
  {
    "name": "هل سیاه",
    "category": "ادویه‌ها",
    "price": 164000,
    "discount": 0,
    "stock": 46,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "هل سیاه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "هل سیاه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "هل سیاه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 58,
    "images": [
      {
        "url": "/images/products/real/058.webp",
        "alt": "هل سیاه"
      }
    ]
  },
  {
    "name": "میخک",
    "category": "ادویه‌ها",
    "price": 129000,
    "discount": 12,
    "stock": 35,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "میخک ممتاز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "میخک ممتاز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "میخک ممتاز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/real/059.webp",
        "alt": "میخک"
      }
    ],
    "productNumber": 59
  },
  {
    "name": "فلفل سیاه",
    "category": "ادویه‌ها",
    "price": 78000,
    "discount": 0,
    "stock": 25,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "فلفل سیاه آسیاب‌شده تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "فلفل سیاه آسیاب‌شده با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "فلفل سیاه آسیاب‌شده"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/real/060.webp",
        "alt": "فلفل سیاه"
      }
    ],
    "productNumber": 60
  },
  {
    "name": "فلفل قرمز",
    "category": "ادویه‌ها",
    "price": 95000,
    "discount": 5,
    "stock": 38,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "فلفل قرمز تند تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "فلفل قرمز تند با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "فلفل قرمز تند"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/061.webp",
        "alt": "فلفل قرمز"
      }
    ],
    "productNumber": 61
  },
  {
    "name": "زردچوبه",
    "category": "ادویه‌ها",
    "price": 68000,
    "discount": 0,
    "stock": 140,
    "weight": 200,
    "shortDescription": "رنگ نارنجی زنده، بدون افزودنی",
    "description": "زردچوبه آسیاب‌شده با کورکومین بالا و رنگ نارنجی روشن. بدون آرد و رنگ افزوده.",
    "ingredients": [
      "زردچوبه"
    ],
    "usage": "در پایه غذا همراه پیاز داغ.",
    "benefits": [
      "ضدالتهاب",
      "آنتی‌اکسیدان"
    ],
    "images": [
      {
        "url": "/images/products/real/062.webp",
        "alt": "زردچوبه"
      }
    ],
    "productNumber": 62
  },
  {
    "name": "سماق",
    "category": "ادویه‌ها",
    "price": 82000,
    "discount": 15,
    "stock": 95,
    "weight": 200,
    "shortDescription": "ترشی طبیعی و رنگ تیره",
    "description": "سماق دانه‌ای تازه با ترشی طبیعی. برای کباب و آش، هم دانه و هم آسیاب‌شده قابل استفاده است.",
    "ingredients": [
      "سماق"
    ],
    "usage": "روی کباب یا در آش.",
    "benefits": [
      "ترش‌کننده طبیعی",
      "آنتی‌اکسیدان"
    ],
    "images": [
      {
        "url": "/images/products/real/063.webp",
        "alt": "سماق"
      }
    ],
    "productNumber": 63
  },
  {
    "name": "جوز هندی",
    "category": "ادویه‌ها",
    "price": 112000,
    "discount": 10,
    "stock": 142,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "جوز هندی کامل تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "جوز هندی کامل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "جوز هندی کامل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/064.webp",
        "alt": "جوز هندی"
      }
    ],
    "productNumber": 64
  },
  {
    "name": "زعفران ساییده",
    "category": "گیاهان دارویی",
    "price": 138000,
    "discount": 0,
    "stock": 137,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "زعفران ساییده با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "زعفران ساییده با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "زعفران ساییده"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 65,
    "images": [
      {
        "url": "/images/products/real/065.webp",
        "alt": "زعفران ساییده"
      }
    ]
  },
  {
    "name": "زعفران رشته‌ای",
    "category": "گیاهان دارویی",
    "price": 155000,
    "discount": 5,
    "stock": 30,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "زعفران رشته‌ای با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "زعفران رشته‌ای با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "زعفران رشته‌ای"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 66,
    "images": [
      {
        "url": "/images/products/real/066.webp",
        "alt": "زعفران رشته‌ای"
      }
    ]
  },
  {
    "name": "وانیل",
    "category": "ادویه‌ها",
    "price": 95000,
    "discount": 15,
    "stock": 42,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "وانیل طبیعی پودری تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "وانیل طبیعی پودری با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "وانیل طبیعی پودری"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/067.webp",
        "alt": "وانیل"
      }
    ],
    "productNumber": 67
  },
  {
    "name": "گلپر",
    "category": "ادویه‌ها",
    "price": 163000,
    "discount": 8,
    "stock": 123,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "گلپر آسیاب‌شده تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "گلپر آسیاب‌شده با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "گلپر آسیاب‌شده"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/068.webp",
        "alt": "گلپر"
      }
    ],
    "productNumber": 68
  },
  {
    "name": "عسل طبیعی",
    "category": "محصولات طبیعی",
    "price": 206000,
    "discount": 12,
    "stock": 69,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عسل طبیعی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "عسل طبیعی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "عسل طبیعی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 69,
    "images": [
      {
        "url": "/images/products/real/069.webp",
        "alt": "عسل طبیعی"
      }
    ]
  },
  {
    "name": "عسل آویشن",
    "category": "محصولات طبیعی",
    "price": 245000,
    "discount": 0,
    "stock": 25,
    "weight": 500,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عسل آویشن کوهی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عسل آویشن کوهی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عسل آویشن کوهی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/real/070.webp",
        "alt": "عسل آویشن"
      }
    ],
    "productNumber": 70
  },
  {
    "name": "عسل گون",
    "category": "محصولات طبیعی",
    "price": 279000,
    "discount": 8,
    "stock": 51,
    "weight": 500,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عسل گون زاگرس تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عسل گون زاگرس با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عسل گون زاگرس"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/071.webp",
        "alt": "عسل گون"
      }
    ],
    "productNumber": 71
  },
  {
    "name": "عسل کنار",
    "category": "محصولات طبیعی",
    "price": 262000,
    "discount": 5,
    "stock": 38,
    "weight": 500,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عسل کنار جنوب تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عسل کنار جنوب با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عسل کنار جنوب"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/real/072.webp",
        "alt": "عسل کنار"
      }
    ],
    "productNumber": 72
  },
  {
    "name": "عسل مرکبات",
    "category": "محصولات طبیعی",
    "price": 296000,
    "discount": 10,
    "stock": 64,
    "weight": 500,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عسل مرکبات شمال تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عسل مرکبات شمال با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عسل مرکبات شمال"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/073.webp",
        "alt": "عسل مرکبات"
      }
    ],
    "productNumber": 73
  },
  {
    "name": "عسل چهل‌گیاه",
    "category": "محصولات طبیعی",
    "price": 146000,
    "discount": 8,
    "stock": 134,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عسل چهل‌گیاه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "عسل چهل‌گیاه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "عسل چهل‌گیاه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 74,
    "images": [
      {
        "url": "/images/products/fixed/074.webp",
        "alt": "عسل چهل‌گیاه"
      }
    ]
  },
  {
    "name": "موم زنبور عسل",
    "category": "محصولات طبیعی",
    "price": 163000,
    "discount": 10,
    "stock": 27,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "موم زنبور عسل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "موم زنبور عسل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "موم زنبور عسل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 75,
    "images": [
      {
        "url": "/images/products/fixed/075.webp",
        "alt": "موم زنبور عسل"
      }
    ]
  },
  {
    "name": "بره موم",
    "category": "محصولات طبیعی",
    "price": 180000,
    "discount": 12,
    "stock": 40,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "بره موم با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "بره موم با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "بره موم"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 76,
    "images": [
      {
        "url": "/images/products/fixed/076.webp",
        "alt": "بره موم"
      }
    ]
  },
  {
    "name": "گرده گل",
    "category": "محصولات طبیعی",
    "price": 197000,
    "discount": 15,
    "stock": 53,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گرده گل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "گرده گل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "گرده گل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 77,
    "images": [
      {
        "url": "/images/products/fixed/077.webp",
        "alt": "گرده گل"
      }
    ]
  },
  {
    "name": "ژل رویال",
    "category": "محصولات طبیعی",
    "price": 69000,
    "discount": 0,
    "stock": 66,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ژل رویال با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ژل رویال با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ژل رویال"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 78,
    "images": [
      {
        "url": "/images/products/fixed/078.webp",
        "alt": "ژل رویال"
      }
    ]
  },
  {
    "name": "انجیر خشک",
    "category": "خشکبار",
    "price": 314000,
    "discount": 10,
    "stock": 142,
    "weight": 400,
    "unit": "گرم",
    "origin": "کرمان و آذربایجان",
    "shortDescription": "انجیر خشک پرک تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "انجیر خشک پرک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "انجیر خشک پرک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/079.webp",
        "alt": "انجیر خشک"
      }
    ],
    "productNumber": 79
  },
  {
    "name": "آلو خشک",
    "category": "خشکبار",
    "price": 314000,
    "discount": 12,
    "stock": 113,
    "weight": 400,
    "unit": "گرم",
    "origin": "کرمان و آذربایجان",
    "shortDescription": "آلو خشک آفتابی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "آلو خشک آفتابی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "آلو خشک آفتابی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/080.webp",
        "alt": "آلو خشک"
      }
    ],
    "productNumber": 80
  },
  {
    "name": "کشمش",
    "category": "خشکبار",
    "price": 382000,
    "discount": 0,
    "stock": 103,
    "weight": 400,
    "unit": "گرم",
    "origin": "کرمان و آذربایجان",
    "shortDescription": "کشمش سبز قلمی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "کشمش سبز قلمی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "کشمش سبز قلمی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/081.webp",
        "alt": "کشمش"
      }
    ],
    "productNumber": 81
  },
  {
    "name": "توت خشک",
    "category": "خشکبار",
    "price": 178000,
    "discount": 15,
    "stock": 76,
    "weight": 400,
    "shortDescription": "شیرینی طبیعی بدون شکر",
    "description": "توت خشک سفید تمیز و بدون چوب. جایگزین خوبی برای شیرینی و قند در چای.",
    "ingredients": [
      "توت خشک"
    ],
    "usage": "همراه چای یا در ترکیب آجیل.",
    "benefits": [
      "انرژی سریع",
      "بدون شکر افزوده"
    ],
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/082.webp",
        "alt": "توت خشک"
      }
    ],
    "productNumber": 82
  },
  {
    "name": "خرما",
    "category": "خشکبار",
    "price": 154000,
    "discount": 12,
    "stock": 131,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "خرما با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "خرما با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "خرما"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 83,
    "images": [
      {
        "url": "/images/products/fixed/083.webp",
        "alt": "خرما"
      }
    ]
  },
  {
    "name": "عناب",
    "category": "گیاهان دارویی",
    "price": 112000,
    "discount": 8,
    "stock": 129,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عناب ممتاز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "عناب ممتاز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "عناب ممتاز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/084.webp",
        "alt": "عناب"
      }
    ],
    "productNumber": 84
  },
  {
    "name": "سنجد",
    "category": "خشکبار",
    "price": 188000,
    "discount": 0,
    "stock": 37,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "سنجد با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "سنجد با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "سنجد"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 85,
    "images": [
      {
        "url": "/images/products/fixed/085.webp",
        "alt": "سنجد"
      }
    ]
  },
  {
    "name": "زرشک",
    "category": "خشکبار",
    "price": 205000,
    "discount": 0,
    "stock": 50,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "زرشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "زرشک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "زرشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 86,
    "images": [
      {
        "url": "/images/products/fixed/086.webp",
        "alt": "زرشک"
      }
    ]
  },
  {
    "name": "آلبالو خشک",
    "category": "خشکبار",
    "price": 331000,
    "discount": 15,
    "stock": 126,
    "weight": 400,
    "unit": "گرم",
    "origin": "کرمان و آذربایجان",
    "shortDescription": "آلبالو خشک تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "آلبالو خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "آلبالو خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/087.webp",
        "alt": "آلبالو خشک"
      }
    ],
    "productNumber": 87
  },
  {
    "name": "زغال‌اخته خشک",
    "category": "خشکبار",
    "price": 94000,
    "discount": 8,
    "stock": 76,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "زغال‌اخته خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "زغال‌اخته خشک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "زغال‌اخته خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 88,
    "images": [
      {
        "url": "/images/products/fixed/088.webp",
        "alt": "زغال‌اخته خشک"
      }
    ]
  },
  {
    "name": "نبات",
    "category": "محصولات طبیعی",
    "price": 111000,
    "discount": 10,
    "stock": 89,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "نبات با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "نبات با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "نبات"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 89,
    "images": [
      {
        "url": "/images/products/fixed/089.webp",
        "alt": "نبات"
      }
    ]
  },
  {
    "name": "نبات زعفرانی",
    "category": "محصولات طبیعی",
    "price": 128000,
    "discount": 12,
    "stock": 102,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "نبات زعفرانی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "نبات زعفرانی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "نبات زعفرانی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 90,
    "images": [
      {
        "url": "/images/products/fixed/090.webp",
        "alt": "نبات زعفرانی"
      }
    ]
  },
  {
    "name": "نبات دارچینی",
    "category": "محصولات طبیعی",
    "price": 145000,
    "discount": 15,
    "stock": 115,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "نبات دارچینی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "نبات دارچینی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "نبات دارچینی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 91,
    "images": [
      {
        "url": "/images/products/fixed/091.webp",
        "alt": "نبات دارچینی"
      }
    ]
  },
  {
    "name": "شکر سرخ",
    "category": "محصولات طبیعی",
    "price": 162000,
    "discount": 0,
    "stock": 128,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "شکر سرخ با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "شکر سرخ با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "شکر سرخ"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 92,
    "images": [
      {
        "url": "/images/products/fixed/092.webp",
        "alt": "شکر سرخ"
      }
    ]
  },
  {
    "name": "عصاره شیرین‌بیان",
    "category": "گیاهان دارویی",
    "price": 179000,
    "discount": 0,
    "stock": 141,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "عصاره شیرین‌بیان با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "عصاره شیرین‌بیان با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "عصاره شیرین‌بیان"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 93,
    "images": [
      {
        "url": "/images/products/fixed/093.webp",
        "alt": "عصاره شیرین‌بیان"
      }
    ]
  },
  {
    "name": "ریشه شیرین‌بیان",
    "category": "گیاهان دارویی",
    "price": 196000,
    "discount": 5,
    "stock": 34,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ریشه شیرین‌بیان با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ریشه شیرین‌بیان با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ریشه شیرین‌بیان"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 94,
    "images": [
      {
        "url": "/images/products/fixed/094.webp",
        "alt": "ریشه شیرین‌بیان"
      }
    ]
  },
  {
    "name": "ریشه کاسنی",
    "category": "گیاهان دارویی",
    "price": 95000,
    "discount": 10,
    "stock": 58,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ریشه کاسنی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "ریشه کاسنی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "ریشه کاسنی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/095.webp",
        "alt": "ریشه کاسنی"
      }
    ],
    "productNumber": 95
  },
  {
    "name": "ریشه قاصدک",
    "category": "گیاهان دارویی",
    "price": 85000,
    "discount": 10,
    "stock": 60,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ریشه قاصدک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ریشه قاصدک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ریشه قاصدک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 96,
    "images": [
      {
        "url": "/images/products/fixed/096.webp",
        "alt": "ریشه قاصدک"
      }
    ]
  },
  {
    "name": "ریشه زنجبیل",
    "category": "گیاهان دارویی",
    "price": 102000,
    "discount": 12,
    "stock": 73,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ریشه زنجبیل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ریشه زنجبیل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ریشه زنجبیل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 97,
    "images": [
      {
        "url": "/images/products/fixed/097.webp",
        "alt": "ریشه زنجبیل"
      }
    ]
  },
  {
    "name": "ریشه سنبل‌الطیب",
    "category": "گیاهان دارویی",
    "price": 119000,
    "discount": 15,
    "stock": 86,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ریشه سنبل‌الطیب با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ریشه سنبل‌الطیب با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ریشه سنبل‌الطیب"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 98,
    "images": [
      {
        "url": "/images/products/fixed/098.webp",
        "alt": "ریشه سنبل‌الطیب"
      }
    ]
  },
  {
    "name": "ریشه گل ختمی",
    "category": "گیاهان دارویی",
    "price": 136000,
    "discount": 0,
    "stock": 99,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ریشه گل ختمی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ریشه گل ختمی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ریشه گل ختمی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 99,
    "images": [
      {
        "url": "/images/products/fixed/099.webp",
        "alt": "ریشه گل ختمی"
      }
    ]
  },
  {
    "name": "گل ختمی",
    "category": "گیاهان دارویی",
    "price": 146000,
    "discount": 10,
    "stock": 64,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل ختمی سفید تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "گل ختمی سفید با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "گل ختمی سفید"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/100.webp",
        "alt": "گل ختمی"
      }
    ],
    "productNumber": 100
  },
  {
    "name": "گل پنیرک",
    "category": "گیاهان دارویی",
    "price": 170000,
    "discount": 5,
    "stock": 125,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل پنیرک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "گل پنیرک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "گل پنیرک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 101,
    "images": [
      {
        "url": "/images/products/fixed/101.webp",
        "alt": "گل پنیرک"
      }
    ]
  },
  {
    "name": "گل سرخ",
    "category": "گیاهان دارویی",
    "price": 187000,
    "discount": 8,
    "stock": 138,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل سرخ با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "گل سرخ با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "گل سرخ"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 102,
    "images": [
      {
        "url": "/images/products/fixed/102.webp",
        "alt": "گل سرخ"
      }
    ]
  },
  {
    "name": "گل همیشه‌بهار",
    "category": "گیاهان دارویی",
    "price": 180000,
    "discount": 15,
    "stock": 90,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل همیشه‌بهار تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "گل همیشه‌بهار با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "گل همیشه‌بهار"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/103.webp",
        "alt": "گل همیشه‌بهار"
      }
    ],
    "productNumber": 103
  },
  {
    "name": "گل بنفشه",
    "category": "گیاهان دارویی",
    "price": 76000,
    "discount": 12,
    "stock": 44,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل بنفشه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "گل بنفشه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "گل بنفشه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 104,
    "images": [
      {
        "url": "/images/products/fixed/104.webp",
        "alt": "گل بنفشه"
      }
    ]
  },
  {
    "name": "گل نسترن",
    "category": "گیاهان دارویی",
    "price": 93000,
    "discount": 15,
    "stock": 57,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل نسترن با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "گل نسترن با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "گل نسترن"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 105,
    "images": [
      {
        "url": "/images/products/fixed/105.webp",
        "alt": "گل نسترن"
      }
    ]
  },
  {
    "name": "گل نیلوفر",
    "category": "گیاهان دارویی",
    "price": 110000,
    "discount": 0,
    "stock": 70,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "گل نیلوفر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "گل نیلوفر با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "گل نیلوفر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 106,
    "images": [
      {
        "url": "/images/products/fixed/106.webp",
        "alt": "گل نیلوفر"
      }
    ]
  },
  {
    "name": "برگ سنا",
    "category": "گیاهان دارویی",
    "price": 127000,
    "discount": 0,
    "stock": 83,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "برگ سنا با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "برگ سنا با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "برگ سنا"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 107,
    "images": [
      {
        "url": "/images/products/fixed/107.webp",
        "alt": "برگ سنا"
      }
    ]
  },
  {
    "name": "برگ زیتون",
    "category": "گیاهان دارویی",
    "price": 146000,
    "discount": 0,
    "stock": 97,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "برگ زیتون خشک تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "برگ زیتون خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "برگ زیتون خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/108.webp",
        "alt": "برگ زیتون"
      }
    ],
    "productNumber": 108
  },
  {
    "name": "برگ بو",
    "category": "گیاهان دارویی",
    "price": 161000,
    "discount": 8,
    "stock": 109,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "برگ بو با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "برگ بو با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "برگ بو"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": true,
    "productNumber": 109,
    "images": [
      {
        "url": "/images/products/fixed/109.webp",
        "alt": "برگ بو"
      }
    ]
  },
  {
    "name": "برگ گزنه",
    "category": "گیاهان دارویی",
    "price": 178000,
    "discount": 10,
    "stock": 122,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "برگ گزنه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "برگ گزنه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "برگ گزنه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 110,
    "images": [
      {
        "url": "/images/products/fixed/110.webp",
        "alt": "برگ گزنه"
      }
    ]
  },
  {
    "name": "برگ اکالیپتوس",
    "category": "گیاهان دارویی",
    "price": 163000,
    "discount": 5,
    "stock": 110,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "برگ اکالیپتوس تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "برگ اکالیپتوس با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "برگ اکالیپتوس"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/111.webp",
        "alt": "برگ اکالیپتوس"
      }
    ],
    "productNumber": 111
  },
  {
    "name": "پوست پرتقال خشک",
    "category": "گیاهان دارویی",
    "price": 67000,
    "discount": 15,
    "stock": 28,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پوست پرتقال خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پوست پرتقال خشک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پوست پرتقال خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 112,
    "images": [
      {
        "url": "/images/products/fixed/112.webp",
        "alt": "پوست پرتقال خشک"
      }
    ]
  },
  {
    "name": "پوست لیمو خشک",
    "category": "گیاهان دارویی",
    "price": 84000,
    "discount": 0,
    "stock": 41,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پوست لیمو خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پوست لیمو خشک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پوست لیمو خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 113,
    "images": [
      {
        "url": "/images/products/fixed/113.webp",
        "alt": "پوست لیمو خشک"
      }
    ]
  },
  {
    "name": "پوست نارنج خشک",
    "category": "گیاهان دارویی",
    "price": 101000,
    "discount": 0,
    "stock": 54,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پوست نارنج خشک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پوست نارنج خشک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پوست نارنج خشک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 114,
    "images": [
      {
        "url": "/images/products/fixed/114.webp",
        "alt": "پوست نارنج خشک"
      }
    ]
  },
  {
    "name": "چوب دارچین",
    "category": "گیاهان دارویی",
    "price": 118000,
    "discount": 5,
    "stock": 67,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چوب دارچین با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چوب دارچین با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چوب دارچین"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 115,
    "images": [
      {
        "url": "/images/products/fixed/115.webp",
        "alt": "چوب دارچین"
      }
    ]
  },
  {
    "name": "چوب صندل",
    "category": "گیاهان دارویی",
    "price": 135000,
    "discount": 8,
    "stock": 80,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "چوب صندل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "چوب صندل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "چوب صندل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 116,
    "images": [
      {
        "url": "/images/products/fixed/116.webp",
        "alt": "چوب صندل"
      }
    ]
  },
  {
    "name": "کندر",
    "category": "گیاهان دارویی",
    "price": 152000,
    "discount": 10,
    "stock": 93,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "کندر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "کندر با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "کندر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 117,
    "images": [
      {
        "url": "/images/products/fixed/117.webp",
        "alt": "کندر"
      }
    ]
  },
  {
    "name": "مصطکی",
    "category": "گیاهان دارویی",
    "price": 169000,
    "discount": 12,
    "stock": 106,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "مصطکی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "مصطکی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "مصطکی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 118,
    "images": [
      {
        "url": "/images/products/fixed/118.webp",
        "alt": "مصطکی"
      }
    ]
  },
  {
    "name": "مریم‌گلی",
    "category": "گیاهان دارویی",
    "price": 186000,
    "discount": 15,
    "stock": 119,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "مریم‌گلی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "مریم‌گلی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "مریم‌گلی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 119,
    "images": [
      {
        "url": "/images/products/fixed/119.webp",
        "alt": "مریم‌گلی"
      }
    ]
  },
  {
    "name": "کندش",
    "category": "گیاهان دارویی",
    "price": 203000,
    "discount": 0,
    "stock": 132,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "کندش با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "کندش با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "کندش"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 120,
    "images": [
      {
        "url": "/images/products/fixed/120.webp",
        "alt": "کندش"
      }
    ]
  },
  {
    "name": "کافور",
    "category": "گیاهان دارویی",
    "price": 75000,
    "discount": 0,
    "stock": 25,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "کافور با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "کافور با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "کافور"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 121,
    "images": [
      {
        "url": "/images/products/fixed/121.webp",
        "alt": "کافور"
      }
    ]
  },
  {
    "name": "صمغ عربی",
    "category": "گیاهان دارویی",
    "price": 92000,
    "discount": 5,
    "stock": 38,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "صمغ عربی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "صمغ عربی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "صمغ عربی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 122,
    "images": [
      {
        "url": "/images/products/fixed/122.webp",
        "alt": "صمغ عربی"
      }
    ]
  },
  {
    "name": "بارهنگ دانه",
    "category": "گیاهان دارویی",
    "price": 109000,
    "discount": 8,
    "stock": 51,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "بارهنگ دانه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "بارهنگ دانه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "بارهنگ دانه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 123,
    "images": [
      {
        "url": "/images/products/fixed/123.webp",
        "alt": "بارهنگ دانه"
      }
    ]
  },
  {
    "name": "سنجد آسیاب‌شده",
    "category": "خشکبار",
    "price": 126000,
    "discount": 10,
    "stock": 64,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "سنجد آسیاب‌شده با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "سنجد آسیاب‌شده با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "سنجد آسیاب‌شده"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 124,
    "images": [
      {
        "url": "/images/products/fixed/124.webp",
        "alt": "سنجد آسیاب‌شده"
      }
    ]
  },
  {
    "name": "کنجد",
    "category": "ادویه‌ها",
    "price": 78000,
    "discount": 12,
    "stock": 29,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "کنجد سفید پاک‌شده تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "کنجد سفید پاک‌شده با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "کنجد سفید پاک‌شده"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/125.webp",
        "alt": "کنجد"
      }
    ],
    "productNumber": 125
  },
  {
    "name": "کنجد سیاه",
    "category": "خشکبار",
    "price": 160000,
    "discount": 15,
    "stock": 90,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "کنجد سیاه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "کنجد سیاه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "کنجد سیاه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 126,
    "images": [
      {
        "url": "/images/products/fixed/126.webp",
        "alt": "کنجد سیاه"
      }
    ]
  },
  {
    "name": "ارده کنجد",
    "category": "محصولات طبیعی",
    "price": 279000,
    "discount": 10,
    "stock": 142,
    "weight": 500,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ارده کنجد سنگی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "ارده کنجد سنگی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "ارده کنجد سنگی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/127.webp",
        "alt": "ارده کنجد"
      }
    ],
    "productNumber": 127
  },
  {
    "name": "روغن زیتون",
    "category": "روغن‌های گیاهی",
    "price": 210000,
    "discount": 0,
    "stock": 25,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن زیتون بکر تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن زیتون بکر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن زیتون بکر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/128.webp",
        "alt": "روغن زیتون"
      }
    ],
    "productNumber": 128
  },
  {
    "name": "روغن کنجد",
    "category": "روغن‌های گیاهی",
    "price": 196000,
    "discount": 0,
    "stock": 58,
    "weight": 500,
    "unit": "میلی‌لیتر",
    "shortDescription": "عطر کنجد برشته",
    "description": "روغن کنجد از دانه بوداده با عطر گرم و طعم آجیلی. برای پخت و پز و ماساژ.",
    "ingredients": [
      "کنجد"
    ],
    "usage": "پخت و پز یا مصرف مستقیم.",
    "benefits": [
      "منبع ویتامین E",
      "مناسب پوست"
    ],
    "images": [
      {
        "url": "/images/products/fixed/129.webp",
        "alt": "روغن کنجد"
      }
    ],
    "productNumber": 129
  },
  {
    "name": "روغن سیاه‌دانه",
    "category": "روغن‌های گیاهی",
    "price": 248000,
    "discount": 12,
    "stock": 46,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "shortDescription": "پرس سرد، شیشه تیره",
    "description": "روغن سیاه‌دانه پرس سرد در شیشه تیره برای محافظت از نور. طعم تند و مشخص، بدون تصفیه شیمیایی.",
    "ingredients": [
      "دانه سیاه‌دانه"
    ],
    "usage": "روزی یک قاشق مرباخوری.",
    "benefits": [
      "تقویت ایمنی",
      "ضدالتهاب"
    ],
    "isFeatured": true,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/130.webp",
        "alt": "روغن سیاه‌دانه"
      }
    ],
    "productNumber": 130
  },
  {
    "name": "روغن نارگیل",
    "category": "روغن‌های گیاهی",
    "price": 244000,
    "discount": 8,
    "stock": 51,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن نارگیل خوراکی تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن نارگیل خوراکی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن نارگیل خوراکی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/131.webp",
        "alt": "روغن نارگیل"
      }
    ],
    "productNumber": 131
  },
  {
    "name": "روغن بادام شیرین",
    "category": "روغن‌های گیاهی",
    "price": 218000,
    "discount": 8,
    "stock": 39,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "shortDescription": "سبک و بی‌بو برای پوست و مو",
    "description": "روغن بادام شیرین پرس سرد، سبک و کم‌بو. جذب سریع و مناسب پوست خشک و مو.",
    "ingredients": [
      "بادام شیرین"
    ],
    "usage": "روی پوست یا مو، چند قطره.",
    "benefits": [
      "نرم‌کننده پوست",
      "تقویت مو"
    ],
    "images": [
      {
        "url": "/images/products/fixed/132.webp",
        "alt": "روغن بادام شیرین"
      }
    ],
    "productNumber": 132
  },
  {
    "name": "روغن بادام تلخ",
    "category": "روغن‌های گیاهی",
    "price": 134000,
    "discount": 15,
    "stock": 61,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن بادام تلخ با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن بادام تلخ با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن بادام تلخ"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 133,
    "images": [
      {
        "url": "/images/products/fixed/133.webp",
        "alt": "روغن بادام تلخ"
      }
    ]
  },
  {
    "name": "روغن کرچک",
    "category": "روغن‌های گیاهی",
    "price": 210000,
    "discount": 8,
    "stock": 87,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن کرچک خالص تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن کرچک خالص با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن کرچک خالص"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/134.webp",
        "alt": "روغن کرچک"
      }
    ],
    "productNumber": 134
  },
  {
    "name": "روغن رزماری",
    "category": "روغن‌های گیاهی",
    "price": 295000,
    "discount": 15,
    "stock": 90,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن رزماری تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن رزماری با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن رزماری"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/135.webp",
        "alt": "روغن رزماری"
      }
    ],
    "productNumber": 135
  },
  {
    "name": "روغن آرگان",
    "category": "روغن‌های گیاهی",
    "price": 278000,
    "discount": 12,
    "stock": 77,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن آرگان اصل تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن آرگان اصل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن آرگان اصل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/136.webp",
        "alt": "روغن آرگان"
      }
    ],
    "productNumber": 136
  },
  {
    "name": "روغن مورد",
    "category": "روغن‌های گیاهی",
    "price": 202000,
    "discount": 8,
    "stock": 113,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن مورد با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن مورد با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن مورد"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 137,
    "images": [
      {
        "url": "/images/products/fixed/137.webp",
        "alt": "روغن مورد"
      }
    ]
  },
  {
    "name": "روغن بنفشه",
    "category": "روغن‌های گیاهی",
    "price": 74000,
    "discount": 10,
    "stock": 126,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن بنفشه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن بنفشه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن بنفشه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 138,
    "images": [
      {
        "url": "/images/products/fixed/138.webp",
        "alt": "روغن بنفشه"
      }
    ]
  },
  {
    "name": "روغن بابونه",
    "category": "روغن‌های گیاهی",
    "price": 91000,
    "discount": 12,
    "stock": 139,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن بابونه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن بابونه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن بابونه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 139,
    "images": [
      {
        "url": "/images/products/fixed/139.webp",
        "alt": "روغن بابونه"
      }
    ]
  },
  {
    "name": "روغن اسطوخودوس",
    "category": "روغن‌های گیاهی",
    "price": 312000,
    "discount": 0,
    "stock": 103,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن اسطوخودوس تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن اسطوخودوس با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن اسطوخودوس"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/140.webp",
        "alt": "روغن اسطوخودوس"
      }
    ],
    "productNumber": 140
  },
  {
    "name": "روغن آویشن",
    "category": "روغن‌های گیاهی",
    "price": 125000,
    "discount": 0,
    "stock": 45,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن آویشن با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن آویشن با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن آویشن"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 141,
    "images": [
      {
        "url": "/images/products/fixed/141.webp",
        "alt": "روغن آویشن"
      }
    ]
  },
  {
    "name": "روغن نعناع",
    "category": "روغن‌های گیاهی",
    "price": 210000,
    "discount": 5,
    "stock": 116,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن نعناع تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن نعناع با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن نعناع"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/142.webp",
        "alt": "روغن نعناع"
      }
    ],
    "productNumber": 142
  },
  {
    "name": "روغن زنجبیل",
    "category": "روغن‌های گیاهی",
    "price": 159000,
    "discount": 5,
    "stock": 71,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن زنجبیل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن زنجبیل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن زنجبیل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 143,
    "images": [
      {
        "url": "/images/products/fixed/143.webp",
        "alt": "روغن زنجبیل"
      }
    ]
  },
  {
    "name": "روغن دارچین",
    "category": "روغن‌های گیاهی",
    "price": 176000,
    "discount": 8,
    "stock": 84,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن دارچین با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن دارچین با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن دارچین"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 144,
    "images": [
      {
        "url": "/images/products/fixed/144.webp",
        "alt": "روغن دارچین"
      }
    ]
  },
  {
    "name": "روغن گل سرخ",
    "category": "روغن‌های گیاهی",
    "price": 227000,
    "discount": 8,
    "stock": 129,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن گل سرخ تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن گل سرخ با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن گل سرخ"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/145.webp",
        "alt": "روغن گل سرخ"
      }
    ],
    "productNumber": 145
  },
  {
    "name": "روغن گل همیشه‌بهار",
    "category": "روغن‌های گیاهی",
    "price": 65000,
    "discount": 12,
    "stock": 110,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن گل همیشه‌بهار با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن گل همیشه‌بهار با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن گل همیشه‌بهار"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 146,
    "images": [
      {
        "url": "/images/products/fixed/146.webp",
        "alt": "روغن گل همیشه‌بهار"
      }
    ]
  },
  {
    "name": "روغن هسته انگور",
    "category": "روغن‌های گیاهی",
    "price": 244000,
    "discount": 10,
    "stock": 142,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن هسته انگور تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن هسته انگور با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن هسته انگور"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/147.webp",
        "alt": "روغن هسته انگور"
      }
    ],
    "productNumber": 147
  },
  {
    "name": "روغن هسته زردآلو",
    "category": "روغن‌های گیاهی",
    "price": 99000,
    "discount": 0,
    "stock": 136,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن هسته زردآلو با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن هسته زردآلو با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن هسته زردآلو"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 148,
    "images": [
      {
        "url": "/images/products/fixed/148.webp",
        "alt": "روغن هسته زردآلو"
      }
    ]
  },
  {
    "name": "روغن هسته انار",
    "category": "روغن‌های گیاهی",
    "price": 261000,
    "discount": 12,
    "stock": 35,
    "weight": 250,
    "unit": "میلی‌لیتر",
    "origin": "تولید پرس سرد",
    "shortDescription": "روغن هسته انار تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "روغن هسته انار با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "روغن هسته انار"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "images": [
      {
        "url": "/images/products/fixed/149.webp",
        "alt": "روغن هسته انار"
      }
    ],
    "productNumber": 149
  },
  {
    "name": "روغن دنبه",
    "category": "روغن‌های گیاهی",
    "price": 133000,
    "discount": 5,
    "stock": 42,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن دنبه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن دنبه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن دنبه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 150,
    "images": [
      {
        "url": "/images/products/fixed/150.webp",
        "alt": "روغن دنبه"
      }
    ]
  },
  {
    "name": "روغن حیوانی",
    "category": "روغن‌های گیاهی",
    "price": 150000,
    "discount": 8,
    "stock": 55,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "روغن حیوانی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "روغن حیوانی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "روغن حیوانی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 151,
    "images": [
      {
        "url": "/images/products/fixed/151.webp",
        "alt": "روغن حیوانی"
      }
    ]
  },
  {
    "name": "پودر سنجد",
    "category": "محصولات طبیعی",
    "price": 245000,
    "discount": 8,
    "stock": 87,
    "weight": 500,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر سنجد کامل تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "پودر سنجد کامل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "پودر سنجد کامل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/152.webp",
        "alt": "پودر سنجد"
      }
    ],
    "productNumber": 152
  },
  {
    "name": "پودر جوانه گندم",
    "category": "ادویه‌ها",
    "price": 184000,
    "discount": 12,
    "stock": 81,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر جوانه گندم با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر جوانه گندم با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر جوانه گندم"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 153,
    "images": [
      {
        "url": "/images/products/fixed/153.webp",
        "alt": "پودر جوانه گندم"
      }
    ]
  },
  {
    "name": "پودر جوانه جو",
    "category": "ادویه‌ها",
    "price": 201000,
    "discount": 15,
    "stock": 94,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر جوانه جو با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر جوانه جو با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر جوانه جو"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 154,
    "images": [
      {
        "url": "/images/products/fixed/154.webp",
        "alt": "پودر جوانه جو"
      }
    ]
  },
  {
    "name": "پودر زنجبیل",
    "category": "ادویه‌ها",
    "price": 73000,
    "discount": 0,
    "stock": 107,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر زنجبیل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر زنجبیل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر زنجبیل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 155,
    "images": [
      {
        "url": "/images/products/fixed/155.webp",
        "alt": "پودر زنجبیل"
      }
    ]
  },
  {
    "name": "پودر دارچین",
    "category": "ادویه‌ها",
    "price": 90000,
    "discount": 0,
    "stock": 120,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر دارچین با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر دارچین با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر دارچین"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 156,
    "images": [
      {
        "url": "/images/products/fixed/156.webp",
        "alt": "پودر دارچین"
      }
    ]
  },
  {
    "name": "پودر زردچوبه",
    "category": "ادویه‌ها",
    "price": 107000,
    "discount": 5,
    "stock": 133,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر زردچوبه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر زردچوبه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر زردچوبه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 157,
    "images": [
      {
        "url": "/images/products/fixed/157.webp",
        "alt": "پودر زردچوبه"
      }
    ]
  },
  {
    "name": "پودر سیر",
    "category": "ادویه‌ها",
    "price": 180000,
    "discount": 0,
    "stock": 103,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "پودر سیر خالص تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "پودر سیر خالص با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "پودر سیر خالص"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/158.webp",
        "alt": "پودر سیر"
      }
    ],
    "productNumber": 158
  },
  {
    "name": "پودر پیاز",
    "category": "ادویه‌ها",
    "price": 78000,
    "discount": 5,
    "stock": 116,
    "weight": 100,
    "unit": "گرم",
    "origin": "هندوستان و ایران",
    "shortDescription": "پودر پیاز تازه و خوش‌عطر با کیفیت فروشگاهی",
    "description": "پودر پیاز با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در خانه.",
    "ingredients": [
      "پودر پیاز"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "images": [
      {
        "url": "/images/products/fixed/159.webp",
        "alt": "پودر پیاز"
      }
    ],
    "productNumber": 159
  },
  {
    "name": "پودر آویشن",
    "category": "ادویه‌ها",
    "price": 158000,
    "discount": 12,
    "stock": 52,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر آویشن با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر آویشن با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر آویشن"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 160,
    "images": [
      {
        "url": "/images/products/fixed/160.webp",
        "alt": "پودر آویشن"
      }
    ]
  },
  {
    "name": "پودر گل محمدی",
    "category": "ادویه‌ها",
    "price": 175000,
    "discount": 15,
    "stock": 65,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر گل محمدی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر گل محمدی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر گل محمدی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 161,
    "images": [
      {
        "url": "/images/products/fixed/161.webp",
        "alt": "پودر گل محمدی"
      }
    ]
  },
  {
    "name": "پودر نارگیل",
    "category": "ادویه‌ها",
    "price": 192000,
    "discount": 0,
    "stock": 78,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر نارگیل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر نارگیل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر نارگیل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 162,
    "images": [
      {
        "url": "/images/products/fixed/162.webp",
        "alt": "پودر نارگیل"
      }
    ]
  },
  {
    "name": "پودر سنبل‌الطیب",
    "category": "ادویه‌ها",
    "price": 209000,
    "discount": 0,
    "stock": 91,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر سنبل‌الطیب با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر سنبل‌الطیب با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر سنبل‌الطیب"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 163,
    "images": [
      {
        "url": "/images/products/fixed/163.webp",
        "alt": "پودر سنبل‌الطیب"
      }
    ]
  },
  {
    "name": "پودر شیرین‌بیان",
    "category": "ادویه‌ها",
    "price": 81000,
    "discount": 5,
    "stock": 104,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر شیرین‌بیان با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر شیرین‌بیان با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر شیرین‌بیان"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 164,
    "images": [
      {
        "url": "/images/products/fixed/164.webp",
        "alt": "پودر شیرین‌بیان"
      }
    ]
  },
  {
    "name": "پودر کاکائو",
    "category": "ادویه‌ها",
    "price": 98000,
    "discount": 8,
    "stock": 117,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر کاکائو با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر کاکائو با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر کاکائو"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 165,
    "images": [
      {
        "url": "/images/products/fixed/165.webp",
        "alt": "پودر کاکائو"
      }
    ]
  },
  {
    "name": "پودر هسته خرما",
    "category": "ادویه‌ها",
    "price": 115000,
    "discount": 10,
    "stock": 130,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر هسته خرما با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر هسته خرما با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر هسته خرما"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 166,
    "images": [
      {
        "url": "/images/products/fixed/166.webp",
        "alt": "پودر هسته خرما"
      }
    ]
  },
  {
    "name": "پودر بارهنگ",
    "category": "ادویه‌ها",
    "price": 132000,
    "discount": 12,
    "stock": 143,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر بارهنگ با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر بارهنگ با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر بارهنگ"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 167,
    "images": [
      {
        "url": "/images/products/fixed/167.webp",
        "alt": "پودر بارهنگ"
      }
    ]
  },
  {
    "name": "پودر اسفرزه",
    "category": "ادویه‌ها",
    "price": 149000,
    "discount": 15,
    "stock": 36,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر اسفرزه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر اسفرزه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر اسفرزه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 168,
    "images": [
      {
        "url": "/images/products/fixed/168.webp",
        "alt": "پودر اسفرزه"
      }
    ]
  },
  {
    "name": "پودر خاکشیر",
    "category": "ادویه‌ها",
    "price": 166000,
    "discount": 0,
    "stock": 49,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر خاکشیر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر خاکشیر با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر خاکشیر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": false,
    "productNumber": 169,
    "images": [
      {
        "url": "/images/products/fixed/169.webp",
        "alt": "پودر خاکشیر"
      }
    ]
  },
  {
    "name": "پودر سماق",
    "category": "ادویه‌ها",
    "price": 183000,
    "discount": 0,
    "stock": 62,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر سماق با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر سماق با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر سماق"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 170,
    "images": [
      {
        "url": "/images/products/fixed/170.webp",
        "alt": "پودر سماق"
      }
    ]
  },
  {
    "name": "پودر گلپر",
    "category": "ادویه‌ها",
    "price": 200000,
    "discount": 5,
    "stock": 75,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر گلپر با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر گلپر با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر گلپر"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 171,
    "images": [
      {
        "url": "/images/products/fixed/171.webp",
        "alt": "پودر گلپر"
      }
    ]
  },
  {
    "name": "پودر زیره",
    "category": "ادویه‌ها",
    "price": 72000,
    "discount": 8,
    "stock": 88,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر زیره با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر زیره با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر زیره"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": true,
    "productNumber": 172,
    "images": [
      {
        "url": "/images/products/fixed/172.webp",
        "alt": "پودر زیره"
      }
    ]
  },
  {
    "name": "پودر هل",
    "category": "ادویه‌ها",
    "price": 89000,
    "discount": 10,
    "stock": 101,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر هل با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر هل با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر هل"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 173,
    "images": [
      {
        "url": "/images/products/fixed/173.webp",
        "alt": "پودر هل"
      }
    ]
  },
  {
    "name": "پودر میخک",
    "category": "ادویه‌ها",
    "price": 106000,
    "discount": 12,
    "stock": 114,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر میخک با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر میخک با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر میخک"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 174,
    "images": [
      {
        "url": "/images/products/fixed/174.webp",
        "alt": "پودر میخک"
      }
    ]
  },
  {
    "name": "پودر جوز هندی",
    "category": "ادویه‌ها",
    "price": 123000,
    "discount": 15,
    "stock": 127,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "پودر جوز هندی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "پودر جوز هندی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "پودر جوز هندی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 175,
    "images": [
      {
        "url": "/images/products/fixed/175.webp",
        "alt": "پودر جوز هندی"
      }
    ]
  },
  {
    "name": "حب بادرنجبویه",
    "category": "دمنوش‌ها",
    "price": 140000,
    "discount": 0,
    "stock": 140,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "حب بادرنجبویه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "حب بادرنجبویه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "حب بادرنجبویه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 176,
    "images": [
      {
        "url": "/images/products/fixed/176.webp",
        "alt": "حب بادرنجبویه"
      }
    ]
  },
  {
    "name": "حب رازیانه",
    "category": "دمنوش‌ها",
    "price": 157000,
    "discount": 0,
    "stock": 33,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "حب رازیانه با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "حب رازیانه با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "حب رازیانه"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 177,
    "images": [
      {
        "url": "/images/products/fixed/177.webp",
        "alt": "حب رازیانه"
      }
    ]
  },
  {
    "name": "حب نعناع",
    "category": "دمنوش‌ها",
    "price": 174000,
    "discount": 5,
    "stock": 46,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "حب نعناع با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "حب نعناع با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "حب نعناع"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 178,
    "images": [
      {
        "url": "/images/products/fixed/178.webp",
        "alt": "حب نعناع"
      }
    ]
  },
  {
    "name": "ترکیب چای آرامش",
    "category": "دمنوش‌ها",
    "price": 191000,
    "discount": 8,
    "stock": 59,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ترکیب چای آرامش با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ترکیب چای آرامش با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ترکیب چای آرامش"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 179,
    "images": [
      {
        "url": "/images/products/fixed/179.webp",
        "alt": "ترکیب چای آرامش"
      }
    ]
  },
  {
    "name": "ترکیب چای سرماخوردگی",
    "category": "دمنوش‌ها",
    "price": 208000,
    "discount": 10,
    "stock": 72,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ترکیب چای سرماخوردگی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ترکیب چای سرماخوردگی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ترکیب چای سرماخوردگی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 180,
    "images": [
      {
        "url": "/images/products/fixed/180.webp",
        "alt": "ترکیب چای سرماخوردگی"
      }
    ]
  },
  {
    "name": "ترکیب چای لاغری",
    "category": "دمنوش‌ها",
    "price": 80000,
    "discount": 12,
    "stock": 85,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ترکیب چای لاغری با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ترکیب چای لاغری با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ترکیب چای لاغری"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": true,
    "isPopular": true,
    "productNumber": 181,
    "images": [
      {
        "url": "/images/products/fixed/181.webp",
        "alt": "ترکیب چای لاغری"
      }
    ]
  },
  {
    "name": "ترکیب دمنوش خواب",
    "category": "دمنوش‌ها",
    "price": 97000,
    "discount": 15,
    "stock": 98,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ترکیب دمنوش خواب با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ترکیب دمنوش خواب با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ترکیب دمنوش خواب"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 182,
    "images": [
      {
        "url": "/images/products/fixed/182.webp",
        "alt": "ترکیب دمنوش خواب"
      }
    ]
  },
  {
    "name": "ترکیب دمنوش انرژی",
    "category": "دمنوش‌ها",
    "price": 114000,
    "discount": 0,
    "stock": 111,
    "weight": 100,
    "unit": "گرم",
    "origin": "ایران",
    "shortDescription": "ترکیب دمنوش انرژی با کیفیت انتخاب‌شده و بسته‌بندی بهداشتی",
    "description": "ترکیب دمنوش انرژی با کیفیت انتخاب‌شده، تازه و دارای بسته‌بندی بهداشتی؛ مناسب مصرف روزانه و نگهداری در جای خشک و خنک.",
    "ingredients": [
      "ترکیب دمنوش انرژی"
    ],
    "usage": "طبق نیاز مصرف شود و در جای خشک و خنک نگهداری شود.",
    "benefits": [
      "کیفیت انتخاب‌شده",
      "بسته‌بندی بهداشتی"
    ],
    "isFeatured": false,
    "isPopular": false,
    "productNumber": 183,
    "images": [
      {
        "url": "/images/products/fixed/183.webp",
        "alt": "ترکیب دمنوش انرژی"
      }
    ]
  }
];

export const seedUsers = [
  {
    "name": "مریم رضایی",
    "email": "maryam@example.com",
    "phone": "09121110001",
    "password": "Attari@1404"
  },
  {
    "name": "سینا کاظمی",
    "email": "sina@example.com",
    "phone": "09121110002",
    "password": "Attari@1404"
  },
  {
    "name": "نگار موسوی",
    "email": "negar@example.com",
    "phone": "09121110003",
    "password": "Attari@1404"
  }
];

export const seedReviews = [
  {
    "rating": 5,
    "title": "عالی بود",
    "comment": "بسته‌بندی مرتب و عطر گل واقعاً تازه بود. دم‌کرده رنگ خوبی داد."
  },
  {
    "rating": 4,
    "title": "راضی‌ام",
    "comment": "کیفیت خوب، ارسال کمی طول کشید ولی سالم رسید."
  },
  {
    "rating": 5,
    "title": "دوباره می‌خرم",
    "comment": "با چیزی که از عطاری محل می‌گرفتم قابل مقایسه نیست، خیلی تمیزتر."
  },
  {
    "rating": 3,
    "title": "متوسط",
    "comment": "خوب بود اما انتظار داشتم مقدار بیشتری باشد."
  }
];
