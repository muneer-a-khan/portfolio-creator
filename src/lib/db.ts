import { PrismaClient } from "@prisma/client";

// This prevents multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if PrismaClient is already defined or create a new instance
export const db = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Cache the client in development to prevent too many client instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Ensure Prisma Client is properly initialized before export
try {
  // Warm up the connection
  db.$connect();
} catch (error) {
  console.error("Failed to connect to the database:", error);
  // Allow the application to continue without crashing
  // The error will be handled at the request level
}

//test