import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { db } from "../../../../lib/db";

// Define a custom user type to include stripeId
interface UserWithStripe {
  id: string;
  stripeId?: string | null;
  [key: string]: any;
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stripeId?: string | null;
    }
  }
  
  interface User extends UserWithStripe {}
}

// Extend JWT to include stripeId
declare module "next-auth/jwt" {
  interface JWT {
    stripeId?: string | null;
  }
}

// Make sure the Prisma client is initialized
try {
  // A simple query to test the connection
  db.$connect();
} catch (error) {
  console.error("Failed to connect to the database:", error);
}

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Implement credentials authentication
        // For now, we'll use a placeholder
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        // In a real implementation, you would:
        // 1. Find the user by email
        // 2. Verify password hash
        // 3. Return user data or null
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        const userWithStripe = user as UserWithStripe;
        token.sub = userWithStripe.id;
        
        // Fetch the user's stripeId if it's not already included
        if (!userWithStripe.stripeId) {
          const dbUser = await db.user.findUnique({
            where: { id: userWithStripe.id },
            select: { stripeId: true }
          });
          if (dbUser?.stripeId) {
            token.stripeId = dbUser.stripeId;
          }
        } else {
          token.stripeId = userWithStripe.stripeId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.stripeId = token.stripeId;
      }
      return session;
    },
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST }; 