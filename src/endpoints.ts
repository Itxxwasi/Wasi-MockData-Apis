/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EndpointInfo } from './types';

export const API_ENDPOINTS: EndpointInfo[] = [
  {
    id: 'get-health-root',
    category: 'System',
    method: 'GET',
    path: '/api/v1',
    description: 'Bridges status metadata, running environment variables, online state, and total live records inside the mock database engine.',
    queryParams: [
      { name: 'delay', type: 'number', required: false, description: 'Simulates network latency in milliseconds. Range: 0 - 5000ms.', defaultValue: '0' }
    ],
    rateLimit: '80 req/15min (1000 with Key)',
    sampleResponseJson: `{
  "status": "online",
  "service": "MockDev API Hub Service",
  "version": "1.0.0",
  "docsUrl": "/api-docs",
  "environment": "production-ready",
  "supportedCategories": [
    "users",
    "finance",
    "ecommerce",
    "social",
    "analytics",
    "utilities",
    "custom schemas"
  ],
  "totalAvailableDatabaseRecords": {
    "users": 200,
    "userSessions": 200,
    "financeTransactions": 250,
    "products": 150,
    "orders": 150,
    "posts": 100,
    "comments": 300,
    "analyticsMetrics": 350,
    "utilityTokens": 100
  },
  "systemTime": "2026-06-13T15:08:11.000Z"
}`
  },
  {
    id: 'get-health-check',
    category: 'System',
    method: 'GET',
    path: '/api/v1/health',
    description: 'Retrieves server infrastructure state for automated heartbeat monitors.',
    queryParams: [],
    rateLimit: '80 req/15min (1000 with Key)',
    sampleResponseJson: `{
  "status": "healthy",
  "timestamp": "2026-06-13T15:08:15.110Z"
}`
  },
  {
    id: 'get-users',
    category: 'Users',
    method: 'GET',
    path: '/api/v1/users',
    description: 'Fetches deterministic list of system-wide user credentials, status triggers, roles, and deep address coordinates.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Current index page for pagination sequence.', defaultValue: '1' },
      { name: 'limit', type: 'number', required: false, description: 'Number of user profiles retrieved in payload (Max: 50).', defaultValue: '10' },
      { name: 'search', type: 'string', required: false, description: 'Fuzzy search parameter matches usernames, emails, roles, country titles, etc.' },
      { name: 'sortBy', type: 'string', required: false, description: 'Sort criteria field matching any schema parameter (e.g. firstName, role).', defaultValue: 'id' },
      { name: 'sortOrder', type: 'string', required: false, description: 'Sorting rotation direction: asc / desc.', defaultValue: 'asc' },
      { name: 'role', type: 'string', required: false, description: 'Filters results by roles: admin / user / editor' },
      { name: 'status', type: 'string', required: false, description: 'Filters results by state: active / suspended / pending' },
      { name: 'delay', type: 'number', required: false, description: 'Simulated network response lag (ms).' }
    ],
    rateLimit: '80 req/15min (1000 with Key)',
    sampleResponseJson: `{
  "data": [
    {
      "id": "1",
      "uuid": "8ec7b09d-e74f-40be-bd60-5fbc35da0a47",
      "username": "adrienne_howe",
      "firstName": "Adrienne",
      "lastName": "Howe",
      "email": "adrienne.howe@gmail.com",
      "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=adrienne_howe",
      "birthdate": "1984-11-20",
      "phone": "(451) 857-3625",
      "website": "https://adrienne.net",
      "company": "Kshlerin - O'Reilly",
      "jobTitle": "Direct Paradigm Developer",
      "role": "editor",
      "status": "active",
      "address": {
        "street": "93427 Cole Meadow",
        "city": "East Elbertfort",
        "state": "Wyoming",
        "zipCode": "19403",
        "country": "Honduras",
        "coordinates": { "lat": -42.1009, "lng": 83.2109 }
      },
      "lastLogin": "2026-06-11T04:22:00.125Z",
      "createdAt": "2024-09-12T08:15:30.000Z"
    }
  ],
  "pagination": {
    "totalItems": 200,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 200,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'get-users-id',
    category: 'Users',
    method: 'GET',
    path: '/api/v1/users/:id',
    description: 'Retrieves complete profile data schema of a specific registered developer target by numerical internal key.',
    queryParams: [
      { name: 'delay', type: 'number', required: false, description: 'Lag latency in ms.' }
    ],
    rateLimit: '80 req/15min (1000 with key)',
    sampleResponseJson: `{
  "id": "12",
  "uuid": "df81debe-2cc5-4e3e-a1fb-bc426d11f00a",
  "username": "shane_jenkins",
  "firstName": "Shane",
  "lastName": "Jenkins",
  "email": "shane.jenkins@gmail.com",
  "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=shane_jenkins",
  "birthdate": "1978-02-14",
  "phone": "555-0158",
  "website": "https://jenkins.org",
  "company": "Fay - Stark",
  "jobTitle": "Corporate Communications Liaison",
  "role": "user",
  "status": "active",
  "address": {
    "street": "142 Swift Meadows",
    "city": "Lake Rosanne",
    "state": "Ohio",
    "zipCode": "44321",
    "country": "United States",
    "coordinates": { "lat": 41.071, "lng": -81.512 }
  },
  "lastLogin": "2026-06-12T19:33:04.110Z",
  "createdAt": "2025-01-10T12:00:00.000Z"
}`
  },
  {
    id: 'get-users-sessions',
    category: 'Users',
    method: 'GET',
    path: '/api/v1/users/:id/sessions',
    description: 'Exposes active developer log sessions mapping active authentication JWT tokens, clients, and IPv4 connections.',
    queryParams: [],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "userId": "12",
  "sessionsCount": 1,
  "sessions": [
    {
      "sessionId": "a823bf1d82f7c02b9f3459c2",
      "userId": "12",
      "username": "shane_jenkins",
      "token": "jwt_eyJhY2Nlc3MiOiJleHRlcm5hbCIsImltZCI6MSwidHlwZSI6Imp3dCJ9.shane_token_348911",
      "ip": "212.155.84.9",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/121.0",
      "loginTime": "2026-06-12T08:15:30.000Z",
      "expiryTime": "2026-06-13T08:15:30.000Z",
      "isActive": true
    }
  ]
}`
  },
  {
    id: 'get-finance-transactions',
    category: 'Finance',
    method: 'GET',
    path: '/api/v1/finance/transactions',
    description: 'Retrieves multi-currency transactional records containing IBAN accounts, BIC metadata, routing descriptions, and state values.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Page sequence.' },
      { name: 'limit', type: 'number', required: false, description: 'Result batch limits.' },
      { name: 'search', type: 'string', required: false, description: 'Fuzzy matches account names, ID, merchants, descriptions.' },
      { name: 'sortBy', type: 'string', required: false, description: 'Sort key: e.g. amount, date, bankName.', defaultValue: 'id' },
      { name: 'sortOrder', type: 'string', required: false, description: 'Sort sequence orientation: asc / desc.', defaultValue: 'asc' },
      { name: 'type', type: 'string', required: false, description: 'Filters transaction method: deposit / withdrawal / transfer / payment' },
      { name: 'status', type: 'string', required: false, description: 'Filters status: pending / completed / failed' }
    ],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "data": [
    {
      "id": "1",
      "transactionId": "TXN402910482390",
      "accountId": "ACC5829104",
      "accountName": "Bessie Jenkins Ledger",
      "accountType": "Savings",
      "amount": -245.99,
      "currency": "EUR",
      "type": "payment",
      "status": "completed",
      "merchant": "Netflix",
      "category": "Entertainment",
      "creditCardNumber": "4532-1593-4820-2219",
      "creditCardType": "Visa Enterprise",
      "date": "2026-06-11T20:14:50.000Z",
      "description": "Card transaction at Netflix Amsterdam",
      "reference": "REF930218491",
      "iban": "DE12 5003 4022 1920 4812",
      "bic": "WELADED1BBB"
    }
  ],
  "pagination": {
    "totalItems": 250,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 250,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'get-finance-transactions-id',
    category: 'Finance',
    method: 'GET',
    path: '/api/v1/finance/transactions/:id',
    description: 'Retrieves multi-currency transactional metadata statement of a specific payment catalog ID.',
    queryParams: [],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "id": "5",
  "transactionId": "TXN948102394012",
  "accountId": "ACC4821094",
  "accountName": "Gregory Ortiz Ledger",
  "accountType": "Checking",
  "amount": 1500.00,
  "currency": "USD",
  "type": "deposit",
  "status": "completed",
  "merchant": "ApexTech Solutions",
  "category": "Salary",
  "creditCardNumber": "4392-1249-1052-1951",
  "creditCardType": "Mastercard Gold",
  "date": "2026-06-09T09:00:00.000Z",
  "description": "Direct Deposit Salary Payroll",
  "reference": "REFPAYROLL2026",
  "iban": "US89 MOCK 4821 0294 12",
  "bic": "MOCKUS33XXX"
}`
  },
  {
    id: 'get-ecommerce-products',
    category: 'E-commerce',
    method: 'GET',
    path: '/api/v1/ecommerce/products',
    description: 'Accesses e-commerce items categorized by price matrices, retail warehouses, dimensions, barcodes, and reviews counters.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Catalog index page.' },
      { name: 'limit', type: 'number', required: false, description: 'Rec count.' },
      { name: 'search', type: 'string', required: false, description: 'Fuzzy matches titles, brands, category keywords.' },
      { name: 'sortBy', type: 'string', required: false, description: 'Sort specs: price, rating, stock.', defaultValue: 'id' },
      { name: 'sortOrder', type: 'string', required: false, description: 'Direction: asc / desc.', defaultValue: 'asc' },
      { name: 'category', type: 'string', required: false, description: 'Filter products: Electronics, Clothing, Beauty, Books, etc.' }
    ],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "data": [
    {
      "id": "1",
      "uuid": "43b37996-5cb3-487c-864a-25beaffb4db0",
      "title": "Ergonomic Mechanical Keyboard",
      "description": "True aluminum desktop RGB setup with brown tactile linear switch integration, hot swappable layout.",
      "price": 129.99,
      "discountPercentage": 15,
      "discountedPrice": 110.49,
      "rating": 4.8,
      "stock": 250,
      "brand": "ApexTech",
      "category": "Electronics",
      "thumbnail": "https://picsum.photos/seed/product-1/400/300",
      "sku": "PROD-APX845",
      "barcode": "9783161484100",
      "weight": 1.25,
      "dimensions": { "width": 35.5, "height": 4.2, "depth": 14.8 },
      "reviewsCount": 425,
      "lifecycleStatus": "active",
      "createdAt": "2025-08-11T12:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 150,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 150,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'get-ecommerce-orders',
    category: 'E-commerce',
    method: 'GET',
    path: '/api/v1/ecommerce/orders',
    description: 'Retrieves corporate shipping records nested with item pricing matrices, customer email contacts, carrier tracking, and status details.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Page query.' },
      { name: 'limit', type: 'number', required: false, description: 'Rec size limit.' },
      { name: 'search', type: 'string', required: false, description: 'Search criteria matching orderNumber, names, payment methods.' },
      { name: 'status', type: 'string', required: false, description: 'Filters status: pending / processing / shipped / delivered / cancelled' }
    ],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "data": [
    {
      "id": "1",
      "orderNumber": "ORD-2026-48591034",
      "customerId": "8ec7b09d",
      "customerName": "Adrienne Howe",
      "email": "adrienne.howe@gmail.com",
      "items": [
        {
          "productId": "41",
          "title": "Ultra Protection Hydro-Cream",
          "price": 28.50,
          "quantity": 2,
          "total": 57.00
        }
      ],
      "totalPrice": 57.00,
      "status": "delivered",
      "paymentMethod": "apple_pay",
      "paymentStatus": "paid",
      "shippingAddress": {
        "street": "93427 Cole Meadow",
        "city": "East Elbertfort",
        "state": "Wyoming",
        "zipCode": "19403",
        "country": "Honduras"
      },
      "carrier": "FedEx",
      "trackingNumber": "TRK90382104921",
      "date": "2026-06-12T14:12:00.000Z",
      "notes": "Please drop at front desk."
    }
  ],
  "pagination": {
    "totalItems": 150,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 150,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'get-social-posts',
    category: 'Social',
    method: 'GET',
    path: '/api/v1/social/posts',
    description: 'A robust catalog API mapping blog entries, publisher user profile entities, tag arrays, viewer tallies, and commentary counters.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Feed index page.' },
      { name: 'limit', type: 'number', required: false, description: 'Feed batch limitation.' },
      { name: 'search', type: 'string', required: false, description: 'Matches within titles, authors, categories.' },
      { name: 'sortBy', type: 'string', required: false, description: 'Sort factors: likes, views, commentsCount.', defaultValue: 'id' }
    ],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "data": [
    {
      "id": "1",
      "title": "Deconstructing Web Assembly Runtimes",
      "content": "Exploring the compile execution vectors of sandboxed system programs directly inside JS engines...",
      "authorId": "a81d4b2e",
      "authorName": "Celia Reynolds",
      "authorAvatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=Celia",
      "likes": 1254,
      "dislikes": 19,
      "views": 25890,
      "tags": ["tech", "coding", "productivity"],
      "commentsCount": 14,
      "isPublished": true,
      "createdAt": "2026-06-11T12:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 100,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 100,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'get-social-post-comments',
    category: 'Social',
    method: 'GET',
    path: '/api/v1/social/posts/:id/comments',
    description: 'Exposes active comments anchored directly under a specific blog post identifier.',
    queryParams: [],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "postId": "1",
  "commentsCount": 2,
  "comments": [
    {
      "id": "1",
      "postId": "1",
      "authorName": "Derrick Hanson",
      "authorAvatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Derrick",
      "email": "derrick.h@gmail.com",
      "body": "Incredibly rich explanation on C stack allocation! Helped a lot.",
      "rating": 5,
      "likes": 24,
      "status": "approved",
      "createdAt": "2026-06-11T14:22:04.000Z"
    }
  ]
}`
  },
  {
    id: 'get-analytics',
    category: 'Analytics',
    method: 'GET',
    path: '/api/v1/analytics',
    description: 'Retrieves live logs of simulated platform API user paths, tracking IP addresses, latency timings, and system bounce metrics.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Page sequence.' },
      { name: 'limit', type: 'number', required: false, description: 'Limit parameter.' },
      { name: 'device', type: 'string', required: false, description: 'Filters device triggers: desktop / mobile / tablet' }
    ],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "data": [
    {
      "id": "1",
      "timestamp": "2026-06-13T07:44:02.125Z",
      "path": "/api/v1/users",
      "method": "GET",
      "statusCode": 200,
      "responseTimeMs": 48,
      "ip": "22.103.49.25",
      "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 Chrome/120.0.0.0 Safari/604.1",
      "device": "mobile",
      "browser": "Chrome",
      "country": "Germany",
      "referer": "https://ycombinator.com",
      "sessionDurationSec": 320,
      "bounceRate": 0.42,
      "activeUsers": 128
    }
  ],
  "pagination": {
    "totalItems": 350,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 350,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'get-utilities',
    category: 'Utilities',
    method: 'GET',
    path: '/api/v1/utilities/random',
    description: 'A versatile dynamic payload returning random addresses, UUID v4s, Hex/RGB colors, file configurations, and IPv6 coordinates.',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'Sequence index.' },
      { name: 'limit', type: 'number', required: false, description: 'Batch list size.' }
    ],
    rateLimit: '80 req/15min',
    sampleResponseJson: `{
  "data": [
    {
      "uuid": "4fb5ef23-93d1-419b-ab9f-dfbe4a4fdefc",
      "ipAddress": "192.168.12.84",
      "ipv6Address": "3ffe:1900:4545:3:200:f8ff:fe21:67cf",
      "macAddress": "00:1a:2b:3c:4d:5e",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/121.0",
      "mimeType": "application/pdf",
      "fileExtension": "pdf",
      "hexColor": "#fbbf24",
      "rgbColor": "rgb(251, 191, 36)",
      "isbn": "9781449331818",
      "word": "sandboxing",
      "sentence": "Simulate client environments before production testing.",
      "paragraph": "Enabling resilient mock servers bypasses slow live databases and securely avoids exposing third-party developer secrets.",
      "boolean": true,
      "currencyCode": "EUR",
      "countryCode": "DE",
      "locale": "en_US"
    }
  ],
  "pagination": {
    "totalItems": 100,
    "pagedCount": 1,
    "page": 1,
    "limit": 1,
    "totalPages": 100,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}`
  },
  {
    id: 'post-schema',
    category: 'Custom Schemas',
    method: 'POST',
    path: '/api/v1/schema',
    description: 'The ultimate on-the-fly customizable record compilers. Submit desired types and keys, and receive up to 100 perfectly formed dynamic data fields.',
    queryParams: [],
    requestBodyJson: `{
  "count": 5,
  "fields": [
    { "name": "uid", "type": "id" },
    { "name": "clientName", "type": "fullName" },
    { "name": "clientEmail", "type": "email" },
    { "name": "priceSpent", "type": "amount" },
    { "name": "activeUser", "type": "boolean" }
  ]
}`,
    rateLimit: '60 req/15min',
    sampleResponseJson: `{
  "status": "success",
  "count": 5,
  "schemaFields": [
    { "name": "uid", "type": "id" },
    { "name": "clientName", "type": "fullName" },
    { "name": "clientEmail", "type": "email" },
    { "name": "priceSpent", "type": "amount" },
    { "name": "activeUser", "type": "boolean" }
  ],
  "generatedAt": "2026-06-13T15:08:22.000Z",
  "data": [
    {
      "uid": "1",
      "clientName": "Shane Jenkins",
      "clientEmail": "shane.jenkins@gmail.com",
      "priceSpent": 648.25,
      "activeUser": true
    },
    {
      "uid": "2",
      "clientName": "Bessie Howe",
      "clientEmail": "bessie.howe@gmail.com",
      "priceSpent": 124.90,
      "activeUser": false
    }
  ]
}`
  }
];
