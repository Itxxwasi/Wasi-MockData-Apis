import {
  usersDb,
  sessionsDb,
  transactionsDb,
  productsDb,
  ordersDb,
  postsDb,
  commentsDb,
  analyticsDb,
  utilitiesDb,
} from "./dbCache";
import { handleCollectionQuery } from "./mockEngine";

export const typeDefs = `
  type Coordinates {
    lat: Float!
    lng: Float!
  }

  type Address {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
    coordinates: Coordinates!
  }

  type User {
    id: ID!
    uuid: String!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    avatar: String!
    birthdate: String!
    phone: String!
    website: String!
    company: String!
    jobTitle: String!
    role: String!
    status: String!
    address: Address!
    lastLogin: String!
    createdAt: String!
    sessions: [UserSession!]!
    posts: [Post!]!
    orders: [Order!]!
  }

  type UserSession {
    sessionId: String!
    userId: ID!
    username: String!
    token: String!
    ip: String!
    userAgent: String!
    loginTime: String!
    expiryTime: String!
    isActive: Boolean!
    user: User
  }

  type Transaction {
    id: ID!
    transactionId: String!
    accountId: String!
    accountName: String!
    accountType: String!
    amount: Float!
    currency: String!
    type: String!
    status: String!
    merchant: String!
    category: String!
    creditCardNumber: String!
    creditCardType: String!
    date: String!
    description: String!
    reference: String!
    iban: String!
    bic: String!
  }

  type Dimensions {
    width: Float!
    height: Float!
    depth: Float!
  }

  type Product {
    id: ID!
    uuid: String!
    title: String!
    description: String!
    price: Float!
    discountPercentage: Float!
    discountedPrice: Float!
    rating: Float!
    stock: Int!
    brand: String!
    category: String!
    thumbnail: String!
    sku: String!
    barcode: String!
    weight: Float!
    dimensions: Dimensions!
    reviewsCount: Int!
    lifecycleStatus: String!
    createdAt: String!
  }

  type OrderItem {
    productId: ID!
    title: String!
    price: Float!
    quantity: Int!
    total: Float!
    product: Product
  }

  type Order {
    id: ID!
    orderNumber: String!
    customerId: String!
    customerName: String!
    email: String!
    items: [OrderItem!]!
    totalPrice: Float!
    status: String!
    paymentMethod: String!
    paymentStatus: String!
    shippingAddress: Address!
    carrier: String!
    trackingNumber: String!
    date: String!
    notes: String
    customer: User
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: String!
    authorName: String!
    authorAvatar: String!
    likes: Int!
    dislikes: Int!
    views: Int!
    tags: [String!]!
    commentsCount: Int!
    isPublished: Boolean!
    createdAt: String!
    comments: [Comment!]!
    author: User
  }

  type Comment {
    id: ID!
    postId: ID!
    authorName: String!
    authorAvatar: String!
    email: String!
    body: String!
    rating: Int
    likes: Int!
    status: String!
    createdAt: String!
    post: Post
  }

  type AnalyticsMetric {
    id: ID!
    timestamp: String!
    path: String!
    method: String!
    statusCode: Int!
    responseTimeMs: Int!
    ip: String!
    userAgent: String!
    device: String!
    browser: String!
    country: String!
    referer: String!
    sessionDurationSec: Int!
    bounceRate: Float!
    activeUsers: Int!
  }

  type RandomUtility {
    uuid: String!
    ipAddress: String!
    ipv6Address: String!
    macAddress: String!
    userAgent: String!
    mimeType: String!
    fileExtension: String!
    hexColor: String!
    rgbColor: String!
    isbn: String!
    word: String!
    sentence: String!
    paragraph: String!
    boolean: Boolean!
    currencyCode: String!
    countryCode: String!
    locale: String!
  }

  type Pagination {
    totalItems: Int!
    pagedCount: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
    hasPrevPage: Boolean!
    hasNextPage: Boolean!
  }

  type UsersResult {
    data: [User!]!
    pagination: Pagination!
  }

  type ProductsResult {
    data: [Product!]!
    pagination: Pagination!
  }

  type OrdersResult {
    data: [Order!]!
    pagination: Pagination!
  }

  type TransactionsResult {
    data: [Transaction!]!
    pagination: Pagination!
  }

  type PostsResult {
    data: [Post!]!
    pagination: Pagination!
  }

  type AnalyticsResult {
    data: [AnalyticsMetric!]!
    pagination: Pagination!
  }

  type UtilitiesResult {
    data: [RandomUtility!]!
    pagination: Pagination!
  }

  type Query {
    users(
      limit: Int
      page: Int
      search: String
      sortBy: String
      sortOrder: String
      role: String
      status: String
    ): UsersResult!

    user(id: ID!): User

    userSessions(userId: ID!): [UserSession!]!

    products(
      limit: Int
      page: Int
      search: String
      sortBy: String
      sortOrder: String
      category: String
      brand: String
    ): ProductsResult!

    product(id: ID!): Product

    orders(
      limit: Int
      page: Int
      search: String
      sortBy: String
      sortOrder: String
      status: String
    ): OrdersResult!

    order(id: ID!): Order

    transactions(
      limit: Int
      page: Int
      search: String
      sortBy: String
      sortOrder: String
      category: String
      type: String
      status: String
    ): TransactionsResult!

    transaction(id: ID!): Transaction

    posts(
      limit: Int
      page: Int
      search: String
      sortBy: String
      sortOrder: String
      tag: String
    ): PostsResult!

    post(id: ID!): Post

    comments(
      limit: Int
      page: Int
      search: String
      postId: String
    ): [Comment!]!

    analytics(
      limit: Int
      page: Int
      search: String
    ): AnalyticsResult!

    utilities(
      limit: Int
      page: Int
    ): UtilitiesResult!
  }
`;

export const resolvers = {
  Query: {
    users: (_parent: any, args: any) => {
      return handleCollectionQuery(usersDb, args);
    },
    user: (_parent: any, { id }: { id: string }) => {
      return usersDb.find((u) => u.id === id) || null;
    },
    userSessions: (_parent: any, { userId }: { userId: string }) => {
      return sessionsDb.filter((s) => s.userId === userId);
    },
    products: (_parent: any, args: any) => {
      return handleCollectionQuery(productsDb, args);
    },
    product: (_parent: any, { id }: { id: string }) => {
      return productsDb.find((p) => p.id === id) || null;
    },
    orders: (_parent: any, args: any) => {
      return handleCollectionQuery(ordersDb, args);
    },
    order: (_parent: any, { id }: { id: string }) => {
      return ordersDb.find((o) => o.id === id) || null;
    },
    transactions: (_parent: any, args: any) => {
      return handleCollectionQuery(transactionsDb, args);
    },
    transaction: (_parent: any, { id }: { id: string }) => {
      return transactionsDb.find((t) => t.id === id) || null;
    },
    posts: (_parent: any, args: any) => {
      return handleCollectionQuery(postsDb, args);
    },
    post: (_parent: any, { id }: { id: string }) => {
      return postsDb.find((p) => p.id === id) || null;
    },
    comments: (_parent: any, args: any) => {
      const q: any = {};
      if (args.postId) q.postId = args.postId;
      if (args.search) q.search = args.search;
      const res = handleCollectionQuery(commentsDb, { ...args, ...q });
      return res.data;
    },
    analytics: (_parent: any, args: any) => {
      return handleCollectionQuery(analyticsDb, args);
    },
    utilities: (_parent: any, args: any) => {
      return handleCollectionQuery(utilitiesDb, args);
    }
  },

  User: {
    sessions: (parent: any) => {
      return sessionsDb.filter((s) => s.userId === parent.id);
    },
    posts: (parent: any) => {
      // Authors have authorId values like authorId or name matching
      return postsDb.filter((p) => p.authorId === parent.id || p.authorName.toLowerCase().includes(parent.username));
    },
    orders: (parent: any) => {
      return ordersDb.filter((o) => o.customerId === parent.id || o.email === parent.email);
    }
  },

  UserSession: {
    user: (parent: any) => {
      return usersDb.find((u) => u.id === parent.userId) || null;
    }
  },

  Order: {
    customer: (parent: any) => {
      return usersDb.find((u) => u.id === parent.customerId || u.email === parent.email) || null;
    }
  },

  OrderItem: {
    product: (parent: any) => {
      return productsDb.find((p) => p.id === parent.productId) || null;
    }
  },

  Post: {
    comments: (parent: any) => {
      return commentsDb.filter((c) => c.postId === parent.id);
    },
    author: (parent: any) => {
      return usersDb.find((u) => u.id === parent.authorId || u.username.toLowerCase().includes(parent.authorName.split(' ')[0].toLowerCase())) || null;
    }
  },

  Comment: {
    post: (parent: any) => {
      return postsDb.find((p) => p.id === parent.postId) || null;
    }
  }
};
