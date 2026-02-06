import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'TVs, computers, phones, and more',
        icon: '📱',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gaming' },
      update: {},
      create: {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Consoles, games, and accessories',
        icon: '🎮',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-appliances' },
      update: {},
      create: {
        name: 'Home & Appliances',
        slug: 'home-appliances',
        description: 'Kitchen, bathroom, and home goods',
        icon: '🏠',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
        icon: '👕',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'groceries' },
      update: {},
      create: {
        name: 'Groceries',
        slug: 'groceries',
        description: 'Food, drinks, and household items',
        icon: '🛒',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'travel' },
      update: {},
      create: {
        name: 'Travel',
        slug: 'travel',
        description: 'Flights, hotels, and experiences',
        icon: '✈️',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create retailers
  const retailers = await Promise.all([
    prisma.retailer.upsert({
      where: { slug: 'amazon-au' },
      update: {},
      create: {
        name: 'Amazon Australia',
        slug: 'amazon-au',
        baseUrl: 'https://www.amazon.com.au',
        logoUrl: '/retailers/amazon.svg',
        affiliateId: 'dealhunter-22',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'jb-hifi' },
      update: {},
      create: {
        name: 'JB Hi-Fi',
        slug: 'jb-hifi',
        baseUrl: 'https://www.jbhifi.com.au',
        logoUrl: '/retailers/jbhifi.svg',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'harvey-norman' },
      update: {},
      create: {
        name: 'Harvey Norman',
        slug: 'harvey-norman',
        baseUrl: 'https://www.harveynorman.com.au',
        logoUrl: '/retailers/harveynorman.svg',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'officeworks' },
      update: {},
      create: {
        name: 'Officeworks',
        slug: 'officeworks',
        baseUrl: 'https://www.officeworks.com.au',
        logoUrl: '/retailers/officeworks.svg',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'kogan' },
      update: {},
      create: {
        name: 'Kogan',
        slug: 'kogan',
        baseUrl: 'https://www.kogan.com',
        logoUrl: '/retailers/kogan.svg',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'ebay-au' },
      update: {},
      create: {
        name: 'eBay Australia',
        slug: 'ebay-au',
        baseUrl: 'https://www.ebay.com.au',
        logoUrl: '/retailers/ebay.svg',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'woolworths' },
      update: {},
      create: {
        name: 'Woolworths',
        slug: 'woolworths',
        baseUrl: 'https://www.woolworths.com.au',
        logoUrl: '/retailers/woolworths.svg',
      },
    }),
    prisma.retailer.upsert({
      where: { slug: 'coles' },
      update: {},
      create: {
        name: 'Coles',
        slug: 'coles',
        baseUrl: 'https://www.coles.com.au',
        logoUrl: '/retailers/coles.svg',
      },
    }),
  ])

  console.log(`✅ Created ${retailers.length} retailers`)

  // Create sample products
  const electronicsCategory = categories.find(c => c.slug === 'electronics')!
  const gamingCategory = categories.find(c => c.slug === 'gaming')!
  
  const amazonRetailer = retailers.find(r => r.slug === 'amazon-au')!
  const jbRetailer = retailers.find(r => r.slug === 'jb-hifi')!
  const koganRetailer = retailers.find(r => r.slug === 'kogan')!

  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'sony-wh-1000xm5' },
      update: {},
      create: {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise cancellation with exceptional sound quality',
        brand: 'Sony',
        model: 'WH-1000XM5',
        imageUrl: '/products/sony-xm5.jpg',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'ps5-slim-console' },
      update: {},
      create: {
        name: 'PlayStation 5 Slim Console',
        slug: 'ps5-slim-console',
        description: 'The latest PlayStation console with 1TB SSD',
        brand: 'Sony',
        model: 'PS5 Slim',
        imageUrl: '/products/ps5-slim.jpg',
        categoryId: gamingCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'apple-macbook-air-m3' },
      update: {},
      create: {
        name: 'Apple MacBook Air M3 15"',
        slug: 'apple-macbook-air-m3',
        description: 'Supercharged by M3 chip with stunning Liquid Retina display',
        brand: 'Apple',
        model: 'MacBook Air M3 15"',
        imageUrl: '/products/macbook-air-m3.jpg',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'samsung-galaxy-s24-ultra' },
      update: {},
      create: {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'The ultimate Galaxy experience with AI features',
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        imageUrl: '/products/s24-ultra.jpg',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'nintendo-switch-oled' },
      update: {},
      create: {
        name: 'Nintendo Switch OLED Model',
        slug: 'nintendo-switch-oled',
        description: 'Enhanced gaming with vibrant 7-inch OLED screen',
        brand: 'Nintendo',
        model: 'Switch OLED',
        imageUrl: '/products/switch-oled.jpg',
        categoryId: gamingCategory.id,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create sample deals
  const deals = await Promise.all([
    prisma.deal.upsert({
      where: { id: 'deal-1' },
      update: {},
      create: {
        id: 'deal-1',
        productId: products[0].id,
        retailerId: jbRetailer.id,
        title: 'Sony WH-1000XM5 - Lowest Price Ever!',
        description: 'Black Friday pricing extended! Grab these premium headphones at the best price we\'ve seen.',
        price: 349,
        originalPrice: 549,
        discount: 36,
        url: 'https://www.jbhifi.com.au/products/sony-wh1000xm5',
        voteScore: 428,
        isHot: true,
        isFeatured: true,
      },
    }),
    prisma.deal.upsert({
      where: { id: 'deal-2' },
      update: {},
      create: {
        id: 'deal-2',
        productId: products[1].id,
        retailerId: amazonRetailer.id,
        title: 'PS5 Slim Bundle with Extra Controller',
        description: 'Console + extra DualSense controller at a great bundle price.',
        price: 699,
        originalPrice: 849,
        discount: 18,
        url: 'https://www.amazon.com.au/dp/B0CL5NN4WL',
        voteScore: 312,
        isHot: true,
      },
    }),
    prisma.deal.upsert({
      where: { id: 'deal-3' },
      update: {},
      create: {
        id: 'deal-3',
        productId: products[2].id,
        retailerId: jbRetailer.id,
        title: 'MacBook Air M3 15" - Educational Discount Stack',
        description: 'Education pricing + bonus gift card makes this an excellent deal.',
        price: 1899,
        originalPrice: 2199,
        discount: 14,
        url: 'https://www.jbhifi.com.au/products/apple-macbook-air-m3-15',
        voteScore: 156,
        isHot: false,
      },
    }),
    prisma.deal.upsert({
      where: { id: 'deal-4' },
      update: {},
      create: {
        id: 'deal-4',
        productId: products[3].id,
        retailerId: koganRetailer.id,
        title: 'Samsung S24 Ultra 256GB Unlocked',
        description: 'Grey import but with local warranty through Kogan.',
        price: 1399,
        originalPrice: 1899,
        discount: 26,
        url: 'https://www.kogan.com/samsung-s24-ultra',
        voteScore: 89,
        isHot: true,
      },
    }),
    prisma.deal.upsert({
      where: { id: 'deal-5' },
      update: {},
      create: {
        id: 'deal-5',
        productId: products[4].id,
        retailerId: amazonRetailer.id,
        title: 'Nintendo Switch OLED + Mario Kart Bundle',
        description: 'Perfect family bundle - console + game at great price.',
        price: 449,
        originalPrice: 549,
        discount: 18,
        url: 'https://www.amazon.com.au/dp/B09FXYZ123',
        voteScore: 234,
        isHot: true,
      },
    }),
  ])

  console.log(`✅ Created ${deals.length} deals`)

  // Create price history for products
  const now = new Date()
  for (const product of products) {
    const retailer = retailers[Math.floor(Math.random() * retailers.length)]
    const basePrice = 500 + Math.random() * 1500
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // Add some price variation
      const priceVariation = (Math.random() - 0.5) * 100
      const price = Math.round((basePrice + priceVariation) * 100) / 100
      
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          retailerId: retailer.id,
          price,
          recordedAt: date,
        },
      })
    }
  }

  console.log(`✅ Created price history for ${products.length} products`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
