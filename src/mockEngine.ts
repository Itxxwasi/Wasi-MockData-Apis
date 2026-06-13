/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { faker } from '@faker-js/faker';
import {
  UserProfile,
  FinanceTransaction,
  Product,
  Order,
  SocialPost,
  SocialComment,
  InteractionMetric,
  RandomUtility,
  SchemaField,
  UserSession,
  Address
} from './types';

// Helper to seed deterministically so pagination is stable but dynamic
export function setSeededFaker(entityType: string, index: number, customSeed = 9999) {
  // Let's create a seed from the customSeed, entityType string character values and the index
  let charSum = 0;
  for (let i = 0; i < entityType.length; i++) {
    charSum += entityType.charCodeAt(i);
  }
  const seedMultiplier = customSeed + charSum + index;
  faker.seed(seedMultiplier);
}

// Generates stable random Address
export function generateRandomAddress(): Address {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    coordinates: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
  };
}

// Generate Users
export function generateUsers(count: number, baseSeed = 1000): UserProfile[] {
  const users: UserProfile[] = [];
  for (let i = 0; i < count; i++) {
    setSeededFaker('user', i, baseSeed);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName }).toLowerCase();
    const id = (i + 1).toString();

    users.push({
      id,
      uuid: faker.string.uuid(),
      username,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      birthdate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
      phone: faker.phone.number(),
      website: faker.internet.url(),
      company: faker.company.name(),
      jobTitle: faker.person.jobTitle(),
      role: faker.helpers.arrayElement(['admin', 'user', 'editor'] as const),
      status: faker.helpers.arrayElement(['active', 'suspended', 'pending'] as const),
      address: generateRandomAddress(),
      lastLogin: faker.date.recent({ days: 30 }).toISOString(),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    });
  }
  return users;
}

// Generate Sessions
export function generateUserSessions(count: number, users: UserProfile[], baseSeed = 2000): UserSession[] {
  const sessions: UserSession[] = [];
  const activeUsers = users.slice(0, count);
  activeUsers.forEach((user, index) => {
    setSeededFaker('session', index, baseSeed);
    const loginTime = faker.date.recent({ days: 5 });
    const expiryTime = new Date(loginTime.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    sessions.push({
      sessionId: faker.string.alphanumeric(24),
      userId: user.id,
      username: user.username,
      token: `jwt_${faker.string.alphanumeric(64)}`,
      ip: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
      loginTime: loginTime.toISOString(),
      expiryTime: expiryTime.toISOString(),
      isActive: faker.datatype.boolean(0.85),
    });
  });
  return sessions;
}

// Generate Finance Transactions
export function generateTransactions(count: number, baseSeed = 3000): FinanceTransaction[] {
  const transactions: FinanceTransaction[] = [];
  const accountTypes = ['Checking', 'Savings', 'Investment', 'Credit Card'];
  const merchants = ['Amazon', 'WalMart', 'Target', 'Uber', 'Netflix', 'Starbucks', 'Apple', 'BestBuy', 'Steam', 'Chevron'];
  const categories = ['Shopping', 'Groceries', 'Entertainment', 'Transport', 'Utilities', 'Investment', 'Dining', 'Salary'];

  for (let i = 0; i < count; i++) {
    setSeededFaker('transaction', i, baseSeed);
    const amount = parseFloat(faker.finance.amount({ min: 2, max: 2500, dec: 2 }));
    const type = faker.helpers.arrayElement(['deposit', 'withdrawal', 'transfer', 'payment'] as const);

    transactions.push({
      id: (i + 1).toString(),
      transactionId: `TXN${faker.string.numeric(12)}`,
      accountId: `ACC${faker.string.numeric(8)}`,
      accountName: faker.person.fullName() + ' Ledger',
      accountType: faker.helpers.arrayElement(accountTypes),
      amount: type === 'deposit' ? amount : -amount,
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'PKR', 'JPY', 'INR']),
      type,
      status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'processing'] as const),
      merchant: faker.helpers.arrayElement(merchants),
      category: faker.helpers.arrayElement(categories),
      creditCardNumber: faker.finance.creditCardNumber('####-####-####-####'),
      creditCardType: faker.finance.creditCardIssuer(),
      date: faker.date.recent({ days: 60 }).toISOString(),
      description: faker.finance.transactionDescription(),
      reference: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
      iban: faker.finance.iban(),
      bic: faker.finance.bic(),
    });
  }
  return transactions;
}

// Generate E-commerce Products
export function generateProducts(count: number, baseSeed = 4000): Product[] {
  const products: Product[] = [];
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports & Outdoors', 'Books', 'Automotive', 'Toys', 'Health'];
  const brands = ['ApexTech', 'FitLife', 'Elegance', 'HomeChill', 'Optimum', 'ReadCraft', 'DriveSafe', 'KidsJoy', 'PureNature'];

  for (let i = 0; i < count; i++) {
    setSeededFaker('product', i, baseSeed);
    const price = parseFloat(faker.commerce.price({ min: 4.99, max: 1499.99 }));
    const discountPercentage = faker.datatype.boolean(0.6) ? parseFloat(faker.number.float({ min: 5, max: 50, fractionDigits: 1 }).toFixed(1)) : 0;
    const discountedPrice = discountPercentage > 0 ? parseFloat((price * (1 - discountPercentage / 100)).toFixed(2)) : price;

    products.push({
      id: (i + 1).toString(),
      uuid: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price,
      discountPercentage,
      discountedPrice,
      rating: parseFloat(faker.number.float({ min: 1.5, max: 5.0, fractionDigits: 1 }).toFixed(1)),
      stock: faker.number.int({ min: 0, max: 500 }),
      brand: faker.helpers.arrayElement(brands),
      category: faker.helpers.arrayElement(categories),
      thumbnail: `https://picsum.photos/seed/product-${i + 1}/400/300`,
      sku: `PROD-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
      barcode: faker.commerce.isbn(13),
      weight: parseFloat(faker.number.float({ min: 0.1, max: 15, fractionDigits: 2 }).toFixed(2)),
      dimensions: {
        width: parseFloat(faker.number.float({ min: 5, max: 100, fractionDigits: 1 }).toFixed(1)),
        height: parseFloat(faker.number.float({ min: 5, max: 100, fractionDigits: 1 }).toFixed(1)),
        depth: parseFloat(faker.number.float({ min: 2, max: 50, fractionDigits: 1 }).toFixed(1)),
      },
      reviewsCount: faker.number.int({ min: 0, max: 1200 }),
      lifecycleStatus: faker.helpers.arrayElement(['active', 'discontinued', 'draft'] as const),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
    });
  }
  return products;
}

// Generate Orders
export function generateOrders(count: number, products: Product[], baseSeed = 5000): Order[] {
  const orders: Order[] = [];
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
  const carriers = ['DHL', 'FedEx', 'UPS', 'USPS', 'Aramex'];

  for (let i = 0; i < count; i++) {
    setSeededFaker('order', i, baseSeed);

    // Pick 1 to 4 products randomly
    const itemsCount = faker.number.int({ min: 1, max: 4 });
    const orderItems = Array.from({ length: itemsCount }).map(() => {
      // Pick a random product from list
      const randomProduct = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = randomProduct.discountedPrice;
      return {
        productId: randomProduct.id,
        title: randomProduct.title,
        price,
        quantity,
        total: parseFloat((price * quantity).toFixed(2)),
      };
    });

    const totalPrice = parseFloat(orderItems.reduce((acc, item) => acc + item.total, 0).toFixed(2));
    const customerFirstName = faker.person.firstName();
    const customerLastName = faker.person.lastName();

    orders.push({
      id: (i + 1).toString(),
      orderNumber: `ORD-${faker.date.recent().getFullYear()}-${faker.string.numeric(8)}`,
      customerId: faker.string.uuid().slice(0, 8),
      customerName: `${customerFirstName} ${customerLastName}`,
      email: faker.internet.email({ firstName: customerFirstName, lastName: customerLastName }).toLowerCase(),
      items: orderItems,
      totalPrice,
      status: faker.helpers.arrayElement(statusOptions),
      paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer', 'apple_pay'] as const),
      paymentStatus: faker.helpers.arrayElement(['paid', 'unpaid', 'refunded'] as const),
      shippingAddress: generateRandomAddress(),
      carrier: faker.helpers.arrayElement(carriers),
      trackingNumber: `TRK${faker.string.numeric(12)}`,
      date: faker.date.recent({ days: 45 }).toISOString(),
      notes: faker.datatype.boolean(0.4) ? faker.lorem.sentence() : '',
    });
  }
  return orders;
}

// Generate Social Media Posts
export function generatePosts(count: number, baseSeed = 6000): SocialPost[] {
  const posts: SocialPost[] = [];
  const availableTags = ['tech', 'gaming', 'life', 'productivity', 'finance', 'music', 'coding', 'travel', 'food', 'science'];

  for (let i = 0; i < count; i++) {
    setSeededFaker('post', i, baseSeed);
    const authorFirstName = faker.person.firstName();
    const authorLastName = faker.person.lastName();
    const id = (i + 1).toString();

    posts.push({
      id,
      title: faker.lorem.sentence({ min: 4, max: 10 }),
      content: faker.lorem.paragraphs({ min: 1, max: 3 }),
      authorId: faker.string.uuid().slice(0, 8),
      authorName: `${authorFirstName} ${authorLastName}`,
      authorAvatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${authorFirstName}`,
      likes: faker.number.int({ min: 0, max: 15200 }),
      dislikes: faker.number.int({ min: 0, max: 350 }),
      views: faker.number.int({ min: 10, max: 120000 }),
      tags: faker.helpers.arrayElements(availableTags, { min: 1, max: 3 }),
      commentsCount: faker.number.int({ min: 0, max: 150 }),
      isPublished: faker.datatype.boolean(0.9),
      createdAt: faker.date.recent({ days: 90 }).toISOString(),
    });
  }
  return posts;
}

// Generate Social Comments
export function generateComments(count: number, baseSeed = 7000): SocialComment[] {
  const comments: SocialComment[] = [];
  for (let i = 0; i < count; i++) {
    setSeededFaker('comment', i, baseSeed);
    const authorFirstName = faker.person.firstName();
    const authorLastName = faker.person.lastName();

    comments.push({
      id: (i + 1).toString(),
      postId: faker.number.int({ min: 1, max: 50 }).toString(),
      authorName: `${authorFirstName} ${authorLastName}`,
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${authorFirstName}`,
      email: faker.internet.email({ firstName: authorFirstName, lastName: authorLastName }).toLowerCase(),
      body: faker.lorem.paragraph(),
      rating: faker.datatype.boolean(0.5) ? faker.number.int({ min: 1, max: 5 }) : undefined,
      likes: faker.number.int({ min: 0, max: 1250 }),
      status: faker.helpers.arrayElement(['moderated', 'approved'] as const),
      createdAt: faker.date.recent({ days: 45 }).toISOString(),
    });
  }
  return comments;
}

// Generate Analytics Interactions
export function generateAnalytics(count: number, baseSeed = 8000): InteractionMetric[] {
  const metrics: InteractionMetric[] = [];
  const paths = ['/api/v1/users', '/api/v1/finance/transactions', '/api/v1/ecommerce/products', '/api/v1/social/posts', '/api/v1/analytics', '/docs'];
  const methods = ['GET', 'GET', 'GET', 'POST', 'PUT', 'DELETE'];
  const referers = ['https://google.com', 'https://github.com', 'https://ycombinator.com', 'https://twitter.com', 'Direct', 'https://copilot.com'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  ];

  for (let i = 0; i < count; i++) {
    setSeededFaker('analytics', i, baseSeed);
    const isSuccess = faker.datatype.boolean(0.97);

    metrics.push({
      id: (i + 1).toString(),
      timestamp: faker.date.recent({ days: 7 }).toISOString(),
      path: faker.helpers.arrayElement(paths),
      method: faker.helpers.arrayElement(methods),
      statusCode: isSuccess ? faker.helpers.arrayElement([200, 201, 304]) : faker.helpers.arrayElement([400, 401, 404, 500]),
      responseTimeMs: faker.number.int({ min: 5, max: 450 }),
      ip: faker.internet.ipv4(),
      userAgent: faker.helpers.arrayElement(userAgents),
      device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet'] as const),
      browser: faker.helpers.arrayElement(['Chrome', 'Safari', 'Firefox', 'Edge']),
      country: faker.location.country(),
      referer: faker.helpers.arrayElement(referers),
      sessionDurationSec: faker.number.int({ min: 10, max: 1200 }),
      bounceRate: parseFloat(faker.number.float({ min: 0.2, max: 0.7, fractionDigits: 2 }).toFixed(2)),
      activeUsers: faker.number.int({ min: 50, max: 500 }),
    });
  }
  return metrics;
}

// Generate Utilities
export function generateUtilities(count: number, baseSeed = 9000): RandomUtility[] {
  const utilities: RandomUtility[] = [];
  for (let i = 0; i < count; i++) {
    setSeededFaker('utility', i, baseSeed);
    utilities.push({
      uuid: faker.string.uuid(),
      ipAddress: faker.internet.ipv4(),
      ipv6Address: faker.internet.ipv6(),
      macAddress: faker.internet.mac(),
      userAgent: faker.internet.userAgent(),
      mimeType: faker.system.mimeType(),
      fileExtension: faker.system.commonFileExt(),
      hexColor: faker.color.rgb(),
      rgbColor: `rgb(${faker.number.int(255)}, ${faker.number.int(255)}, ${faker.number.int(255)})`,
      isbn: faker.commerce.isbn(13),
      word: faker.lorem.word(),
      sentence: faker.lorem.sentence(),
      paragraph: faker.lorem.paragraph(),
      boolean: faker.datatype.boolean(),
      currencyCode: faker.finance.currencyCode(),
      countryCode: faker.location.countryCode(),
      locale: faker.helpers.arrayElement(['en_US', 'en_GB', 'es_ES', 'fr_FR', 'de_DE', 'ur_PK']),
    });
  }
  return utilities;
}

// Custom mock schema engine mapping
export function generateCustomValue(type: string, index: number, customSeed: number): any {
  setSeededFaker('custom_schema_val', index, customSeed + index);

  switch (type) {
    case 'id':
      return (index + 1).toString();
    case 'uuid':
      return faker.string.uuid();
    case 'username':
      return faker.internet.username().toLowerCase();
    case 'firstName':
      return faker.person.firstName();
    case 'lastName':
      return faker.person.lastName();
    case 'fullName':
      return faker.person.fullName();
    case 'email':
      return faker.internet.email().toLowerCase();
    case 'avatar':
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${faker.string.alphanumeric(6)}`;
    case 'phone':
      return faker.phone.number();
    case 'website':
      return faker.internet.url();
    case 'company':
      return faker.company.name();
    case 'jobTitle':
      return faker.person.jobTitle();
    case 'address':
      return faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.country();
    case 'city':
      return faker.location.city();
    case 'country':
      return faker.location.country();
    case 'amount':
      return parseFloat(faker.finance.amount({ min: 10, max: 1000, dec: 2 }));
    case 'currency':
      return faker.finance.currencyCode();
    case 'creditCard':
      return faker.finance.creditCardNumber('####-####-####-####');
    case 'iban':
      return faker.finance.iban();
    case 'merchant':
      return faker.company.name();
    case 'price':
      return parseFloat(faker.commerce.price({ min: 1, max: 500 }));
    case 'discount':
      return faker.number.int({ min: 0, max: 70 });
    case 'rating':
      return parseFloat(faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 }).toFixed(1));
    case 'stock':
      return faker.number.int({ min: 0, max: 1000 });
    case 'brand':
      return faker.commerce.productName().split(' ')[0];
    case 'category':
      return faker.commerce.department();
    case 'title':
      return faker.lorem.sentence();
    case 'content':
      return faker.lorem.paragraph();
    case 'likes':
      return faker.number.int({ min: 0, max: 10000 });
    case 'ip':
      return faker.internet.ipv4();
    case 'userAgent':
      return faker.internet.userAgent();
    case 'userRole':
      return faker.helpers.arrayElement(['admin', 'user', 'manager']);
    case 'userStatus':
      return faker.helpers.arrayElement(['active', 'inactive', 'pending']);
    case 'boolean':
      return faker.datatype.boolean();
    case 'date':
      return faker.date.recent().toISOString();
    case 'color':
      return faker.color.rgb();
    default:
      return faker.lorem.word();
  }
}

// Generate the ultimate custom schema
export function generateCustomSchema(fields: SchemaField[], count = 10, baseSeed = 10000): Record<string, any>[] {
  const records: Record<string, any>[] = [];
  const safeCount = Math.max(1, Math.min(100, count)); // Limit to max 100 records for performance

  for (let i = 0; i < safeCount; i++) {
    const item: Record<string, any> = {};
    fields.forEach((field) => {
      // Use standard naming defaults or safe strings
      const fieldName = field.name || field.type;
      item[fieldName] = generateCustomValue(field.type, i, baseSeed);
    });
    records.push(item);
  }
  return records;
}

// Global Paginated / Filtered Query Manager
export function handleCollectionQuery<T extends { id?: string; [key: string]: any }>(
  collection: T[],
  queryParams: any
): {
  data: T[];
  pagination: {
    totalItems: number;
    pagedCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
} {
  let filtered = [...collection];
  const page = parseInt(queryParams.page as string, 10) || 1;
  const limit = parseInt(queryParams.limit as string, 10) || 10;
  const search = (queryParams.search as string || '').toLowerCase();
  const sortBy = queryParams.sortBy as keyof T || 'id';
  const sortOrder = (queryParams.sortOrder as string || '').toLowerCase() === 'desc' ? 'desc' : 'asc';

  // 1. Universal Text Search Matcher (matches any string field)
  if (search) {
    filtered = filtered.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'object') {
          return Object.values(value).some((subVal) =>
            String(subVal).toLowerCase().includes(search)
          );
        }
        return String(value).toLowerCase().includes(search);
      });
    });
  }

  // 2. Extra Key-Value Filters (matching query variables e.g. role=admin, category=Electronics)
  const standardParams = ['page', 'limit', 'search', 'sortBy', 'sortOrder', 'apikey'];
  Object.keys(queryParams).forEach((key) => {
    if (standardParams.includes(key)) return;
    const filterValue = String(queryParams[key]).toLowerCase();

    filtered = filtered.filter((item) => {
      const itemFieldVal = item[key];
      if (itemFieldVal === undefined) return true; // ignore fields not present
      if (typeof itemFieldVal === 'object') return false; // skip complex objects for custom queries
      return String(itemFieldVal).toLowerCase() === filterValue;
    });
  });

  // 3. Sorting
  filtered.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA === undefined) return 1;
    if (valB === undefined) return -1;

    // Numerical sort
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    }

    // String sort
    return sortOrder === 'desc'
      ? String(valB).localeCompare(String(valA))
      : String(valA).localeCompare(String(valB));
  });

  // 4. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const safePage = Math.max(1, Math.min(totalPages, page));
  const startIndex = (safePage - 1) * limit;
  const pagedData = filtered.slice(startIndex, startIndex + limit);

  return {
    data: pagedData,
    pagination: {
      totalItems,
      pagedCount: pagedData.length,
      page: safePage,
      limit,
      totalPages,
      hasPrevPage: safePage > 1,
      hasNextPage: safePage < totalPages,
    },
  };
}
