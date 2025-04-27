import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Connect to database
        await dbConnect();

        // Try to find existing user
        let dbUser = await User.findOne({ email: user.email });

        // If user doesn't exist, create new user
        if (!dbUser) {
          dbUser = await User.create({
            username: user.name,
            email: user.email,
            isOAuthUser: true,
            [account?.provider + "Id"]: user.id,
          });
        }

        // Always return true to allow sign in
        return true;
      } catch (error) {
        console.error("Database error:", error);
        // Still return true to allow sign in even if DB operation fails
        return true;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Get the base URL from environment variable or use baseUrl
      const siteUrl = process.env.NEXTAUTH_URL || baseUrl;

      // After successful sign in, always redirect to dashboard
      if (url.includes("/api/auth/callback")) {
        return `${siteUrl}/dashboard`;
      }

      // For sign in page, keep as is
      if (url === siteUrl) {
        return url;
      }

      // For all other cases, redirect to the requested URL
      return url.startsWith(siteUrl) ? url : siteUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
};
