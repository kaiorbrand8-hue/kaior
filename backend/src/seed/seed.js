require('dotenv').config();
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const placeholder = (label, w = 700, h = 900) =>
  `https://placehold.co/${w}x${h}/0B1B33/C9A227.png?text=${encodeURIComponent(label)}&font=playfair-display`;

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function buildVariants(colors, basePrice) {
  const variants = [];
  colors.forEach((color) => {
    SIZES.forEach((size) => {
      variants.push({
        size,
        color,
        stock: Math.floor(Math.random() * 15) + 5,
        sku: `${color.slice(0, 3).toUpperCase()}-${size}-${Math.floor(Math.random() * 9000) + 1000}`,
      });
    });
  });
  return variants;
}

const CATEGORY_DEFS = [
  {
    name: 'Shirts',
    nameAr: 'قمصان',
    description: 'Tailored shirts for the modern gentleman.',
    descriptionAr: 'قمصان مفصّلة للرجل العصري.',
  },
  {
    name: 'Suits & Blazers',
    nameAr: 'بدل وبليزر',
    description: 'Sharp tailoring for every occasion.',
    descriptionAr: 'تفصيل أنيق لكل مناسبة.',
  },
  {
    name: 'Trousers',
    nameAr: 'بنطلونات',
    description: 'Precision-cut trousers, formal and casual.',
    descriptionAr: 'بنطلونات مقصوصة بدقة، رسمي وكاجوال.',
  },
  {
    name: 'Knitwear',
    nameAr: 'تريكو',
    description: 'Refined knits for effortless layering.',
    descriptionAr: 'تريكو راقٍ لإطلالة طبقات بسيطة وأنيقة.',
  },
  {
    name: 'Outerwear',
    nameAr: 'ملابس خارجية',
    description: 'Coats and jackets built to last.',
    descriptionAr: 'معاطف وجواكت مصممة لتدوم طويلاً.',
  },
  {
    name: 'Polo & T-Shirts',
    nameAr: 'بولو وتيشيرتات',
    description: 'Everyday essentials, elevated.',
    descriptionAr: 'أساسيات يومية بمستوى أرقى.',
  },
  {
    name: 'Accessories',
    nameAr: 'إكسسوارات',
    description: 'Ties, belts and the finishing touches.',
    descriptionAr: 'كرافتات وأحزمة ولمسات النهاية.',
  },
];

const PRODUCT_DEFS = [
  {
    category: 'Shirts',
    name: 'Navy Slim-Fit Oxford Shirt',
    nameAr: 'قميص أكسفورد كحلي ضيق',
    price: 950,
    colors: ['Navy', 'White'],
    fabric: '100% Egyptian Cotton',
    fabricAr: 'قطن مصري 100%',
    featured: true,
    isNewArrival: true,
  },
  {
    category: 'Shirts',
    name: 'White Classic Poplin Shirt',
    nameAr: 'قميص بوبلين أبيض كلاسيك',
    price: 890,
    colors: ['White', 'Sky Blue'],
    fabric: 'Cotton Poplin',
    fabricAr: 'قطن بوبلين',
    featured: true,
  },
  {
    category: 'Shirts',
    name: 'Charcoal Twill Formal Shirt',
    nameAr: 'قميص رسمي توِيل رمادي غامق',
    price: 920,
    colors: ['Charcoal', 'Navy'],
    fabric: 'Cotton Twill',
    fabricAr: 'قطن توِيل',
  },
  {
    category: 'Suits & Blazers',
    name: 'Navy Tailored Two-Piece Suit',
    nameAr: 'بدلة كحلي من قطعتين مفصّلة',
    price: 4200,
    colors: ['Navy'],
    fabric: 'Wool Blend',
    fabricAr: 'خليط صوف',
    featured: true,
    isNewArrival: true,
  },
  {
    category: 'Suits & Blazers',
    name: 'Charcoal Grey Wool Blazer',
    nameAr: 'بليزر صوف رمادي غامق',
    price: 2600,
    colors: ['Charcoal'],
    fabric: 'Wool Blend',
    fabricAr: 'خليط صوف',
    featured: true,
  },
  {
    category: 'Suits & Blazers',
    name: 'Beige Linen Summer Blazer',
    nameAr: 'بليزر كتان صيفي بيج',
    price: 2350,
    colors: ['Beige'],
    fabric: 'Linen Blend',
    fabricAr: 'خليط كتان',
    isNewArrival: true,
  },
  {
    category: 'Trousers',
    name: 'Navy Tailored Chino Trousers',
    nameAr: 'بنطلون تشينو كحلي مفصّل',
    price: 780,
    colors: ['Navy', 'Beige', 'Black'],
    fabric: 'Cotton Chino',
    fabricAr: 'قطن تشينو',
  },
  {
    category: 'Trousers',
    name: 'Charcoal Formal Wool Trousers',
    nameAr: 'بنطلون صوف رسمي رمادي غامق',
    price: 850,
    colors: ['Charcoal', 'Black'],
    fabric: 'Wool Blend',
    fabricAr: 'خليط صوف',
  },
  {
    category: 'Knitwear',
    name: 'Gold-Stitch Navy Crewneck Sweater',
    nameAr: 'سويتر كحلي رقبة دائرية بخياطة ذهبية',
    price: 1100,
    colors: ['Navy', 'Charcoal'],
    fabric: 'Merino Wool',
    fabricAr: 'صوف مارينو',
    featured: true,
  },
  {
    category: 'Knitwear',
    name: 'Camel V-Neck Knit Pullover',
    nameAr: 'بلوفر تريكو رقبة V جملي',
    price: 1050,
    colors: ['Camel', 'Navy'],
    fabric: 'Wool Blend',
    fabricAr: 'خليط صوف',
  },
  {
    category: 'Outerwear',
    name: 'Navy Wool Overcoat',
    nameAr: 'معطف صوف كحلي طويل',
    price: 3600,
    colors: ['Navy', 'Black'],
    fabric: 'Wool Blend',
    fabricAr: 'خليط صوف',
    isNewArrival: true,
  },
  {
    category: 'Outerwear',
    name: 'Black Leather Biker Jacket',
    nameAr: 'جاكيت جلد أسود بايكر',
    price: 3200,
    colors: ['Black'],
    fabric: 'Genuine Leather',
    fabricAr: 'جلد طبيعي',
  },
  {
    category: 'Polo & T-Shirts',
    name: 'Navy Pique Polo Shirt',
    nameAr: 'تيشيرت بولو بيكيه كحلي',
    price: 650,
    colors: ['Navy', 'White', 'Charcoal'],
    fabric: 'Cotton Pique',
    fabricAr: 'قطن بيكيه',
    featured: true,
  },
  {
    category: 'Polo & T-Shirts',
    name: 'KAIOR Signature Crest T-Shirt',
    nameAr: 'تيشيرت KAIOR سيجنتشر بشعار الدرع',
    price: 480,
    colors: ['White', 'Black', 'Navy'],
    fabric: '100% Cotton',
    fabricAr: 'قطن 100%',
    isNewArrival: true,
  },
  {
    category: 'Accessories',
    name: 'Gold-Buckle Leather Belt',
    nameAr: 'حزام جلد بإبزيم ذهبي',
    price: 520,
    colors: ['Black', 'Brown'],
    fabric: 'Genuine Leather',
    fabricAr: 'جلد طبيعي',
  },
  {
    category: 'Accessories',
    name: 'Navy Silk Textured Tie',
    nameAr: 'كرافتة حرير كحلي بملمس مميز',
    price: 420,
    colors: ['Navy', 'Gold'],
    fabric: '100% Silk',
    fabricAr: 'حرير 100%',
    featured: true,
  },
];

async function run() {
  await connectDB();
  console.log('Seeding KAIOR database...');

  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  const categories = {};
  for (const def of CATEGORY_DEFS) {
    const cat = await Category.create({
      name: def.name,
      nameAr: def.nameAr,
      description: def.description,
      descriptionAr: def.descriptionAr,
      image: placeholder(def.name, 800, 600),
    });
    categories[def.name] = cat;
  }
  console.log(`Created ${CATEGORY_DEFS.length} categories`);

  for (const def of PRODUCT_DEFS) {
    const category = categories[def.category];
    const variants = buildVariants(def.colors, def.price);
    await Product.create({
      name: def.name,
      nameAr: def.nameAr,
      category: category._id,
      description: `${def.name} — crafted with ${def.fabric.toLowerCase()} for a refined, timeless silhouette. Part of the KAIOR Men's Wear collection.`,
      descriptionAr: `${def.nameAr} — مصنوع من ${def.fabricAr} لإطلالة أنيقة وخالدة. جزء من مجموعة KAIOR Men's Wear.`,
      shortDescription: def.fabric,
      shortDescriptionAr: def.fabricAr,
      images: [
        placeholder(def.name),
        placeholder(`${def.name} - Detail`),
        placeholder(`${def.name} - Back`),
      ],
      price: def.price,
      compareAtPrice: Math.random() > 0.6 ? Math.round(def.price * 1.2) : null,
      variants,
      colors: def.colors,
      sizes: SIZES,
      featured: !!def.featured,
      isNewArrival: !!def.isNewArrival,
      fabric: def.fabric,
      fabricAr: def.fabricAr,
      tags: [def.category.toLowerCase(), 'kaior', 'menswear'],
    });
  }
  console.log(`Created ${PRODUCT_DEFS.length} products`);

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kaior.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'KAIOR Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  console.log('Seed complete.');
  await connectDB.disconnectDB();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('Seed failed:', err);
  try {
    await connectDB.disconnectDB();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
