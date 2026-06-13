/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ApolloServer } from "@apollo/server";
// @ts-expect-error - express4 contains valid ESM but types require NodeNext resolution in specific configurations
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./src/graphqlSchema";
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
} from "./src/dbCache";
import {
  generateCustomSchema,
  handleCollectionQuery,
} from "./src/mockEngine";

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Let's create an in-memory Rate Limiting table
interface RateLimitTracker {
  count: number;
  resetTime: number;
}
const ipRateLimits = new Map<string, RateLimitTracker>();

// Global Rate Limiting / API Key Auth / Simulated Delay middleware
const developerGatewayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Optional Delayed Response Simulator (?delay=ms)
  const delayParam = parseInt(req.query.delay as string, 10);
  const delayMs = !isNaN(delayParam) ? Math.min(5000, Math.max(0, delayParam)) : 0;

  // 2. Mock API Key check
  const apiKey = req.headers['x-api-key'] || req.query.apikey || null;
  const isAuthorized = !!apiKey; // Any API Key acts as valid for MVP to make testing fluid

  // 3. Simple IP Rate Limiting
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 mins window

  let tracker = ipRateLimits.get(ip);
  if (!tracker || now > tracker.resetTime) {
    tracker = { count: 0, resetTime: now + windowMs };
    ipRateLimits.set(ip, tracker);
  }

  tracker.count += 1;

  // Anonymous limit is 80; API key limit is 1000
  const limitCeiling = isAuthorized ? 1000 : 80;
  const remaining = Math.max(0, limitCeiling - tracker.count);

  // Set API Hub specific response headers
  res.setHeader('X-RateLimit-Limit', limitCeiling);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(tracker.resetTime / 1000));
  res.setHeader('X-Developer-Platform', 'MockDev-API-Hub');
  res.setHeader('X-API-Seeded-Status', 'Stable-Deterministic');

  if (tracker.count > limitCeiling) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `You have exceeded your mock API gateway quota of ${limitCeiling} requests per 15 minutes. Sign up or include 'x-api-key' in headers to raise limits to 1000.`,
      rateLimitLimit: limitCeiling,
      rateLimitRemaining: remaining,
      rateLimitReset: Math.ceil(tracker.resetTime / 1000),
    });
  }

  // Trigger delayed return if requested
  if (delayMs > 0) {
    setTimeout(() => next(), delayMs);
  } else {
    next();
  }
};

// Apply Gatekeeping middleware to our /api Group
app.use('/api/v1', developerGatewayMiddleware);

/**
 * ============================================================================
 * REST API ENDPOINTS - VERSION 1
 * ============================================================================
 */

// API Health Summary
app.get("/api/v1", (req: Request, res: Response) => {
  res.json({
    status: "online",
    service: "MockDev API Hub Service",
    version: "1.0.0",
    docsUrl: "/api-docs",
    environment: "production-ready",
    supportedCategories: ["users", "finance", "ecommerce", "social", "analytics", "utilities", "custom schemas"],
    totalAvailableDatabaseRecords: {
      users: usersDb.length,
      userSessions: sessionsDb.length,
      financeTransactions: transactionsDb.length,
      products: productsDb.length,
      orders: ordersDb.length,
      posts: postsDb.length,
      comments: commentsDb.length,
      analyticsMetrics: analyticsDb.length,
      utilityTokens: utilitiesDb.length
    },
    systemTime: new Date().toISOString()
  });
});

// GET /api/v1/health
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// -------------- 1. USERS CATEGORY --------------
// GET /users
app.get("/api/v1/users", (req: Request, res: Response) => {
  const result = handleCollectionQuery(usersDb, req.query);
  res.json(result);
});

// GET /users/:id
app.get("/api/v1/users/:id", (req: Request, res: Response) => {
  const user = usersDb.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User Not Found", message: `No user exists with id '${req.params.id}'` });
  }
  res.json(user);
});

// GET /users/:id/sessions
app.get("/api/v1/users/:id/sessions", (req: Request, res: Response) => {
  const sessions = sessionsDb.filter((s) => s.userId === req.params.id);
  res.json({
    userId: req.params.id,
    sessionsCount: sessions.length,
    sessions
  });
});


// -------------- 2. FINANCE CATEGORY --------------
// GET /finance/transactions
app.get("/api/v1/finance/transactions", (req: Request, res: Response) => {
  const result = handleCollectionQuery(transactionsDb, req.query);
  res.json(result);
});

// GET /finance/transactions/:id
app.get("/api/v1/finance/transactions/:id", (req: Request, res: Response) => {
  const tx = transactionsDb.find((t) => t.id === req.params.id);
  if (!tx) {
    return res.status(404).json({ error: "Transaction Not Found", message: `No transactional log exists with id '${req.params.id}'` });
  }
  res.json(tx);
});


// -------------- 3. E-COMMERCE CATEGORY --------------
// GET /ecommerce/products
app.get("/api/v1/ecommerce/products", (req: Request, res: Response) => {
  const result = handleCollectionQuery(productsDb, req.query);
  res.json(result);
});

// GET /ecommerce/products/:id
app.get("/api/v1/ecommerce/products/:id", (req: Request, res: Response) => {
  const product = productsDb.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product Not Found", message: `No catalog product matches index '${req.params.id}'` });
  }
  res.json(product);
});

// GET /ecommerce/orders
app.get("/api/v1/ecommerce/orders", (req: Request, res: Response) => {
  const result = handleCollectionQuery(ordersDb, req.query);
  res.json(result);
});

// GET /ecommerce/orders/:id
app.get("/api/v1/ecommerce/orders/:id", (req: Request, res: Response) => {
  const order = ordersDb.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order Not Found", message: `No ecommerce checkout order matched index '${req.params.id}'` });
  }
  res.json(order);
});


// -------------- 4. SOCIAL MEDIA CATEGORY --------------
// GET /social/posts
app.get("/api/v1/social/posts", (req: Request, res: Response) => {
  const result = handleCollectionQuery(postsDb, req.query);
  res.json(result);
});

// GET /social/posts/:id
app.get("/api/v1/social/posts/:id", (req: Request, res: Response) => {
  const post = postsDb.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Social Post Not Found", message: `No post exists matching id '${req.params.id}'` });
  }
  res.json(post);
});

// GET /social/posts/:id/comments
app.get("/api/v1/social/posts/:id/comments", (req: Request, res: Response) => {
  const postComments = commentsDb.filter((c) => c.postId === req.params.id);
  res.json({
    postId: req.params.id,
    commentsCount: postComments.length,
    comments: postComments
  });
});

// GET /social/comments
app.get("/api/v1/social/comments", (req: Request, res: Response) => {
  const result = handleCollectionQuery(commentsDb, req.query);
  res.json(result);
});


// -------------- 5. ANALYTICS CATEGORY --------------
// GET /analytics
app.get("/api/v1/analytics", (req: Request, res: Response) => {
  const result = handleCollectionQuery(analyticsDb, req.query);
  res.json(result);
});


// -------------- 6. UTILITIES CATEGORY --------------
// GET /utilities/random
app.get("/api/v1/utilities/random", (req: Request, res: Response) => {
  const result = handleCollectionQuery(utilitiesDb, req.query);
  res.json(result);
});


// -------------- 7. ADVANCED DYNAMIC SCHEMA GENERATOR --------------
// POST /api/v1/schema
app.post("/api/v1/schema", (req: Request, res: Response) => {
  const { fields, count } = req.body;
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide an array of objects under 'fields', where each object specifies 'name' and 'type' (e.g., 'uuid', 'firstName', 'price')."
    });
  }

  const safeCount = Math.min(100, Math.max(1, parseInt(count as string, 10) || 10));
  const generatedData = generateCustomSchema(fields, safeCount, Date.now() % 10000);

  res.json({
    status: "success",
    count: generatedData.length,
    schemaFields: fields,
    generatedAt: new Date().toISOString(),
    data: generatedData
  });
});

/**
 * ============================================================================
 * FRONTEND BUILD ENVIRONMENT INTEGRATION (Vite vs Prod Build statically)
 * ============================================================================
 */
async function bootServer() {
  // 1. Initialize and Start Apollo GraphQL Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();

  // 2. Mount GraphQL Endpoint under /api/graphql and apply developer gateway mechanisms (delay / rate limits / key inspection)
  app.use(
    "/api/graphql",
    developerGatewayMiddleware,
    expressMiddleware(apolloServer)
  );

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MockDev Server Engine] Live on http://0.0.0.0:${PORT}`);
    console.log(`[Apollo Server Engine] GraphQL Endpoint available at http://0.0.0.0:${PORT}/api/graphql`);
  });
}

bootServer().catch((err) => {
  console.error("Critical error during server bootstrap:", err);
});
