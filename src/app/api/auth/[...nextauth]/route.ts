import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { db } from "../../../../lib/db";
import bcrypt from 'bcrypt';

// Define a custom user type to include stripeId
interface UserWithStripe {
  id: string;
  stripeId?: string | null;
  [key: string]: string | null;
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

// Ensure environment variables are handled correctly.
// Placeholders are used here if actual environment variables are not set.
const githubId = process.env.GITHUB_ID || 'YOUR_GITHUB_ID_PLACEHOLDER';
const githubSecret = process.env.GITHUB_SECRET || 'YOUR_GITHUB_SECRET_PLACEHOLDER';
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'YOUR_NEXTAUTH_SECRET_PLACEHOLDER';

if (githubId === 'YOUR_GITHUB_ID_PLACEHOLDER' || githubSecret === 'YOUR_GITHUB_SECRET_PLACEHOLDER') {
  console.warn(
    '\x1b[33m%s\x1b[0m', // Yellow color
    'Warning: GITHUB_ID or GITHUB_SECRET environment variables are not set or are using placeholders. GitHub OAuth will not work.'
  );
}
if (nextAuthSecret === 'YOUR_NEXTAUTH_SECRET_PLACEHOLDER') {
    console.warn(
      '\x1b[33m%s\x1b[0m', // Yellow color
      'Warning: NEXTAUTH_SECRET environment variable is not set or is using a placeholder. This is insecure for production.'
    );
  }

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        
        // Find user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        
        // If no user found or password doesn't match
        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }
        
        // Compare password with bcrypt
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        
        if (!isValid) {
          throw new Error("Invalid email or password");
        }
        
        // Return user data
        return {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0], // Basic name from email
          stripeId: user.stripeId,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret, // Added NEXTAUTH_SECRET to the config
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