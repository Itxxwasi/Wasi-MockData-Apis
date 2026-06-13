import {
  generateUsers,
  generateUserSessions,
  generateTransactions,
  generateProducts,
  generateOrders,
  generatePosts,
  generateComments,
  generateAnalytics,
  generateUtilities
} from "./mockEngine";
import {
  UserProfile,
  UserSession,
  FinanceTransaction,
  Product,
  Order,
  SocialPost,
  SocialComment,
  InteractionMetric,
  RandomUtility
} from "./types";

export const SEED_VAL = 2026;

export const usersDb: UserProfile[] = generateUsers(200, SEED_VAL);
export const sessionsDb: UserSession[] = generateUserSessions(200, usersDb, SEED_VAL);
export const transactionsDb: FinanceTransaction[] = generateTransactions(250, SEED_VAL);
export const productsDb: Product[] = generateProducts(150, SEED_VAL);
export const ordersDb: Order[] = generateOrders(150, productsDb, SEED_VAL);
export const postsDb: SocialPost[] = generatePosts(100, SEED_VAL);
export const commentsDb: SocialComment[] = generateComments(300, SEED_VAL);
export const analyticsDb: InteractionMetric[] = generateAnalytics(350, SEED_VAL);
export const utilitiesDb: RandomUtility[] = generateUtilities(100, SEED_VAL);
