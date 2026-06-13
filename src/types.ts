/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface UserProfile {
  id: string;
  uuid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  birthdate: string;
  phone: string;
  website: string;
  company: string;
  jobTitle: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'suspended' | 'pending';
  address: Address;
  lastLogin: string;
  createdAt: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  username: string;
  token: string;
  ip: string;
  userAgent: string;
  loginTime: string;
  expiryTime: string;
  isActive: boolean;
}

export interface FinanceTransaction {
  id: string;
  transactionId: string;
  accountId: string;
  accountName: string;
  accountType: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  status: 'pending' | 'completed' | 'failed' | 'processing';
  merchant: string;
  category: string;
  creditCardNumber: string;
  creditCardType: string;
  date: string;
  description: string;
  reference: string;
  iban: string;
  bic: string;
}

export interface Product {
  id: string;
  uuid: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  sku: string;
  barcode: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  reviewsCount: number;
  lifecycleStatus: 'active' | 'discontinued' | 'draft';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'apple_pay';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  shippingAddress: Address;
  carrier: string;
  trackingNumber: string;
  date: string;
  notes: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: OrderItem[];
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  dislikes: number;
  views: number;
  tags: string[];
  commentsCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface SocialComment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar: string;
  email: string;
  body: string;
  rating?: number;
  likes: number;
  status: 'moderated' | 'approved' | 'removed';
  createdAt: string;
}

export interface InteractionMetric {
  id: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ip: string;
  userAgent: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  country: string;
  referer: string;
  sessionDurationSec: number;
  bounceRate: number;
  activeUsers: number;
}

export interface RandomUtility {
  uuid: string;
  ipAddress: string;
  ipv6Address: string;
  macAddress: string;
  userAgent: string;
  mimeType: string;
  fileExtension: string;
  hexColor: string;
  rgbColor: string;
  isbn: string;
  word: string;
  sentence: string;
  paragraph: string;
  boolean: boolean;
  currencyCode: string;
  countryCode: string;
  locale: string;
}

// Schemas Builder Types
export interface SchemaField {
  name: string;
  type: string; // e.g. 'id', 'uuid', 'firstName', 'lastName', 'email', 'price', etc.
}

export interface CustomSchemaRequest {
  fields: SchemaField[];
  count: number;
}

// Sidebar API Group definitions for Documentation
export interface EndpointInfo {
  id: string;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  queryParams?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: string;
  }[];
  requestBodyJson?: string;
  sampleResponseJson: string;
  rateLimit: string;
}
